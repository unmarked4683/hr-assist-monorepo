'use client'

import { useEffect } from 'react'
import { X } from 'lucide-react'
import { useBlockBrowserBackWhileOpen } from '@/lib/hooks/use-block-browser-back'
import { cn } from '@/lib/utils'

const backdropStyle = {
  backdropFilter: 'blur(6px)',
  backgroundColor: 'oklch(0 0 0 / 40%)',
} as const

interface ModalProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  maxWidth?: string
  zIndex?: string
  className?: string
}

export function Modal({
  open,
  onClose,
  children,
  maxWidth = 'max-w-md',
  zIndex = 'z-50',
  className,
}: ModalProps) {
  const isTopLayer = useBlockBrowserBackWhileOpen(open, onClose)

  useEffect(() => {
    if (!open || !isTopLayer) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, isTopLayer, onClose])

  if (!open) return null

  return (
    <div
      className={cn('fixed inset-0 flex items-center justify-center p-4', zIndex)}
      style={backdropStyle}
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
        className={cn(
          'bg-card border border-border rounded-2xl shadow-2xl w-full flex flex-col overflow-visible',
          maxWidth,
          className,
        )}
      >
        {children}
      </div>
    </div>
  )
}

interface ModalHeaderProps {
  title?: string
  onClose: () => void
  className?: string
}

export function ModalHeader({ title, onClose, className }: ModalHeaderProps) {
  return (
    <div
      className={cn(
        'flex items-center shrink-0 border-b border-border',
        title ? 'justify-between px-5 pt-5 pb-4' : 'justify-end px-5 pt-4 pb-2',
        !title && 'border-b-0',
        className,
      )}
    >
      {title && <h2 className="text-base font-semibold text-foreground">{title}</h2>}
      <button
        type="button"
        onClick={onClose}
        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Zamknij"
      >
        <X size={16} />
      </button>
    </div>
  )
}

export function ModalFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('px-5 pb-5 pt-1 shrink-0', className)}>
      {children}
    </div>
  )
}
