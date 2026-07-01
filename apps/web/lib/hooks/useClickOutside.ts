import { useEffect, type RefObject } from 'react'

export const useClickOutside = (
  ref: RefObject<HTMLElement | null>,
  onClose: () => void,
): void => {
  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [ref, onClose])
}
