'use client'

import { useEffect, useRef } from 'react'

/**
 * Gdy modal jest otwarty, dokłada wpis do historii przeglądarki.
 * Cofnięcie (gest, przycisk wstecz) zamyka modal zamiast opuszczać ekran.
 */
export function useBlockBrowserBackWhileOpen(open: boolean, onClose: () => void) {
  const pushedRef = useRef(false)
  const closedByPopRef = useRef(false)
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    if (!open) return

    closedByPopRef.current = false
    history.pushState({ hrModal: true }, '', window.location.href)
    pushedRef.current = true

    const onPopState = () => {
      closedByPopRef.current = true
      pushedRef.current = false
      onCloseRef.current()
    }

    window.addEventListener('popstate', onPopState)
    return () => {
      window.removeEventListener('popstate', onPopState)
      // Zamknięcie programowe (Zapisz / X): bez history.back(), bo Next.js
      // traktuje to jak nawigację do poprzedniej trasy (np. lista pracowników).
      pushedRef.current = false
    }
  }, [open])
}
