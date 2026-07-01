'use client'

import { useEffect, useRef } from 'react'
import { Modal, ModalFooter } from '../shared/Modal'

interface EmployeeDeleteConfirmModalProps {
  open: boolean
  employeeName: string
  onCancel: () => void
  onConfirm: () => void
}

export const EmployeeDeleteConfirmModal = ({
  open,
  employeeName,
  onCancel,
  onConfirm,
}: EmployeeDeleteConfirmModalProps) => {
  const cancelRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return

    const frame = requestAnimationFrame(() => {
      cancelRef.current?.focus()
    })

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCancel()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onCancel])

  return (
    <Modal
      open={open}
      onClose={onCancel}
      maxWidth="max-w-sm"
      zIndex="z-[70]"
      blockBrowserBack={false}
    >
      <div className="px-6 pt-6 pb-2">
        <h2 className="text-base font-semibold text-foreground">Usuń pracownika</h2>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          Czy na pewno chcesz usunąć pracownika{' '}
          <span className="font-medium text-foreground">{employeeName}</span>? Tej operacji nie można
          cofnąć.
        </p>
      </div>

      <ModalFooter className="px-6 pb-6 pt-4">
        <div className="flex gap-3">
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            className="flex-1 h-11 rounded-lg border border-border bg-background text-sm font-semibold text-foreground hover:bg-accent active:scale-[0.99] transition-all"
          >
            Anuluj
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 h-11 rounded-lg bg-destructive text-white text-sm font-semibold hover:opacity-90 active:scale-[0.99] transition-all shadow-sm"
          >
            Usuń
          </button>
        </div>
      </ModalFooter>
    </Modal>
  )
}
