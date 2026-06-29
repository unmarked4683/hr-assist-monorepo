'use client'

import { useEffect, useRef } from 'react'

/**
 * Gdy modal jest otwarty, dokłada wpis do historii przeglądarki.
 * Cofnięcie (gest, przycisk wstecz) zamyka modal zamiast opuszczać ekran.
 */
export function useBlockBrowserBackWhileOpen(open: boolean, onClose: () => void) {
  const pushedRef = useRef(false)
  const closedByPopRef = useRef(false)

  useEffect(() => {
    if (!open) return

    closedByPopRef.current = false
    history.pushState({ hrModal: true }, '', window.location.href)
    pushedRef.current = true

    const onPopState = () => {
      closedByPopRef.current = true
      pushedRef.current = false
      onClose()
    }

    window.addEventListener('popstate', onPopState)
    return () => {
      window.removeEventListener('popstate', onPopState)
      if (pushedRef.current && !closedByPopRef.current) {
        history.back()
      }
      pushedRef.current = false
    }
  }, [open, onClose])
}
