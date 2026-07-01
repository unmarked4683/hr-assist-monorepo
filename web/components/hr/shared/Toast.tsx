'use client'

import { useEffect } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ToastState {
  id: number
  message: string
  variant: 'success'
}

interface ToastProps {
  toast: ToastState | null
  onDismiss: () => void
}

const TOAST_DURATION_MS = 1000

export function Toast({ toast, onDismiss }: ToastProps) {
  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(onDismiss, TOAST_DURATION_MS)
    return () => window.clearTimeout(timer)
  }, [toast, onDismiss])

  return (
    <div
      className={cn(
        'pointer-events-none fixed top-5 left-1/2 z-[100] flex -translate-x-1/2 transition-all duration-200 ease-out',
        toast ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0',
      )}
      role="status"
      aria-live="polite"
    >
      {toast && (
        <div
          key={toast.id}
          className="flex items-center gap-2.5 rounded-lg px-4 py-2.5 shadow-lg min-w-[min(100vw-2rem,22rem)]"
          style={{ backgroundColor: 'var(--status-green)' }}
        >
          <CheckCircle2 size={16} className="shrink-0 text-white" />
          <p className="text-sm font-semibold text-white">{toast.message}</p>
        </div>
      )}
    </div>
  )
}
