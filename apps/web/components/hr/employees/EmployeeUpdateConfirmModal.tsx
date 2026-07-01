'use client'

import { useEffect, useRef } from 'react'
import { Modal, ModalFooter, ModalHeader } from '../shared/Modal'

interface EmployeeUpdateConfirmModalProps {
  open: boolean
  onCancel: () => void
  onConfirm: () => void
}

export const EmployeeUpdateConfirmModal = ({
  open,
  onCancel,
  onConfirm,
}: EmployeeUpdateConfirmModalProps) => {
  const cancelRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return

    const frame = requestAnimationFrame(() => {
      cancelRef.current?.focus()
    })

    return () => cancelAnimationFrame(frame)
  }, [open])

  return (
    <Modal open={open} onClose={onCancel} maxWidth="max-w-sm" zIndex="z-[70]">
      <ModalHeader title="Potwierdź zapis" onClose={onCancel} className="px-6 pt-5 pb-4" />

      <div className="px-6 pb-2">
        <p className="text-sm text-muted-foreground leading-relaxed">
          Zmiany dotyczą wszystkich dni tego pracownika. Tej operacji nie można cofnąć. Czy na
          pewno chcesz zapisać?
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
            className="flex-1 h-11 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 active:scale-[0.99] transition-all shadow-sm"
          >
            Aktualizuj
          </button>
        </div>
      </ModalFooter>
    </Modal>
  )
}
