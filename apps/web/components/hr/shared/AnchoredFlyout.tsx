'use client'

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
  type ReactNode,
  type RefObject,
} from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

const VIEWPORT_EDGE_MARGIN = 10
const FLYOUT_GAP = 8

interface FlyoutLayout {
  top: number
  left: number
  arrowTop: number
}

const computeFlyoutLayout = (
  triggerRect: DOMRect,
  flyoutHeight: number,
  flyoutWidth: number,
  placement: 'right' | 'left',
): FlyoutLayout => {
  const triggerCenterY = triggerRect.top + triggerRect.height / 2
  const maxTop = window.innerHeight - VIEWPORT_EDGE_MARGIN - flyoutHeight
  const minTop = VIEWPORT_EDGE_MARGIN

  const centeredTop = triggerCenterY - flyoutHeight / 2
  const top = Math.min(maxTop, Math.max(minTop, centeredTop))
  const left =
    placement === 'right'
      ? triggerRect.right + FLYOUT_GAP
      : triggerRect.left - flyoutWidth - FLYOUT_GAP
  const arrowTop = triggerCenterY - top

  return { top, left, arrowTop }
}

interface AnchoredFlyoutProps {
  open: boolean
  onClose: () => void
  triggerRef: RefObject<HTMLElement | null>
  flyoutRef: RefObject<HTMLDivElement | null>
  title: string
  placement?: 'right' | 'left'
  showCloseButton?: boolean
  panelClassName?: string
  children: ReactNode
}

export function AnchoredFlyout({
  open,
  onClose,
  triggerRef,
  flyoutRef,
  title,
  placement = 'right',
  showCloseButton = false,
  panelClassName = 'w-52',
  children,
}: AnchoredFlyoutProps) {
  const [layout, setLayout] = useState<FlyoutLayout | null>(null)

  const updateLayout = useCallback(() => {
    if (!open || !triggerRef.current || !flyoutRef.current) return

    const triggerRect = triggerRef.current.getBoundingClientRect()
    const flyoutRect = flyoutRef.current.getBoundingClientRect()
    setLayout(computeFlyoutLayout(triggerRect, flyoutRect.height, flyoutRect.width, placement))
  }, [flyoutRef, open, placement, triggerRef])

  useEffect(() => {
    if (!open) setLayout(null)
  }, [open])

  useLayoutEffect(() => {
    if (!open) return
    updateLayout()

    const flyoutElement = flyoutRef.current
    if (!flyoutElement) return

    const resizeObserver = new ResizeObserver(updateLayout)
    resizeObserver.observe(flyoutElement)

    window.addEventListener('resize', updateLayout)
    window.addEventListener('scroll', updateLayout, true)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', updateLayout)
      window.removeEventListener('scroll', updateLayout, true)
    }
  }, [flyoutRef, open, updateLayout, children])

  useEffect(() => {
    if (!open) return

    const handleMouseDown = (event: MouseEvent) => {
      const target = event.target as Node
      if (flyoutRef.current?.contains(target)) return
      if (triggerRef.current?.contains(target)) return
      onClose()
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [flyoutRef, onClose, open, triggerRef])

  if (!open) return null

  const fallbackTop = triggerRef.current
    ? triggerRef.current.getBoundingClientRect().top
    : VIEWPORT_EDGE_MARGIN
  const fallbackLeft =
    placement === 'right'
      ? triggerRef.current
        ? triggerRef.current.getBoundingClientRect().right + FLYOUT_GAP
        : 0
      : triggerRef.current
        ? triggerRef.current.getBoundingClientRect().left - FLYOUT_GAP
        : 0

  const arrowClassName =
    placement === 'right'
      ? 'absolute -left-[5px] border-l border-b border-border'
      : 'absolute -right-[5px] border-r border-t border-border'

  return createPortal(
    <div
      className="fixed z-100"
      style={{
        top: layout?.top ?? fallbackTop,
        left: layout?.left ?? fallbackLeft,
        visibility: layout ? 'visible' : 'hidden',
      }}
      role="dialog"
      aria-label={title}
    >
      {layout && (
        <span
          aria-hidden
          className={`pointer-events-none w-2.5 h-2.5 rotate-45 bg-popover ${arrowClassName}`}
          style={{
            top: layout.arrowTop,
            transform: 'translateY(-50%) rotate(45deg)',
          }}
        />
      )}

      <div
        ref={flyoutRef}
        className={`bg-popover border border-border rounded-xl shadow-lg p-3 ${panelClassName}`}
      >
        <div className="flex items-start justify-between gap-2 mb-2 px-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            {title}
          </p>
          {showCloseButton ? (
            <button
              type="button"
              onClick={onClose}
              className="w-6 h-6 -mt-0.5 -mr-0.5 flex items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors shrink-0"
              aria-label="Zamknij"
            >
              <X size={14} />
            </button>
          ) : null}
        </div>
        {children}
      </div>
    </div>,
    document.body,
  )
}
