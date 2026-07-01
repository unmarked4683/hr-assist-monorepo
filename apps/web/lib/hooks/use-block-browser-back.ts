'use client'

import { useEffect, useRef, useState } from 'react'

type ModalLayer = {
  id: number
  onClose: () => void
}

const layers: ModalLayer[] = []
let nextLayerId = 0
let popListenerAttached = false

const handlePopState = () => {
  const top = layers.at(-1)
  if (!top) return
  layers.pop()
  top.onClose()
}

const ensurePopListener = () => {
  if (popListenerAttached) return
  window.addEventListener('popstate', handlePopState)
  popListenerAttached = true
}

const syncTopLayer = () => {
  const topId = layers.at(-1)?.id ?? null
  for (const listener of topLayerListeners) {
    listener(topId)
  }
}

const topLayerListeners = new Set<(topId: number | null) => void>()

/**
 * Gdy modal jest otwarty, dokłada wpis do historii przeglądarki.
 * Cofnięcie / gest wstecz zamyka najwyższy modal zamiast opuszczać ekran.
 */
export function useBlockBrowserBackWhileOpen(open: boolean, onClose: () => void) {
  const onCloseRef = useRef(onClose)
  const layerIdRef = useRef<number | null>(null)
  const [isTopLayer, setIsTopLayer] = useState(false)
  onCloseRef.current = onClose

  useEffect(() => {
    const onTopLayerChange = (topId: number | null) => {
      setIsTopLayer(topId !== null && topId === layerIdRef.current)
    }

    topLayerListeners.add(onTopLayerChange)
    return () => {
      topLayerListeners.delete(onTopLayerChange)
    }
  }, [])

  useEffect(() => {
    if (!open) {
      layerIdRef.current = null
      setIsTopLayer(false)
      return
    }

    ensurePopListener()

    const id = ++nextLayerId
    layerIdRef.current = id

    history.pushState({ hrModal: true }, '', window.location.href)
    layers.push({ id, onClose: () => onCloseRef.current() })
    syncTopLayer()

    return () => {
      const index = layers.findIndex((layer) => layer.id === id)
      if (index !== -1) layers.splice(index, 1)
      layerIdRef.current = null
      syncTopLayer()
    }
  }, [open])

  return isTopLayer
}
