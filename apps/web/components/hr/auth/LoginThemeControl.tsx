'use client'

import { useCallback, useRef, useState } from 'react'
import { useApp } from '../AppContext'
import { AnchoredFlyout } from '../shared/AnchoredFlyout'
import { getThemeOption, ThemePickerMenu } from '../shared/theme-picker'

export function LoginThemeControl() {
  const { theme, setTheme } = useApp()
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const flyoutRef = useRef<HTMLDivElement>(null)

  const close = useCallback(() => setOpen(false), [])
  const { Icon: ThemeIcon, label: themeLabel } = getThemeOption(theme)

  const handleThemeSelect = (value: typeof theme) => {
    setTheme(value)
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="fixed bottom-5 right-5 z-50 w-11 h-11 flex items-center justify-center rounded-xl border border-border bg-card text-muted-foreground shadow-md hover:bg-accent hover:text-foreground transition-colors"
        aria-label={`Motyw: ${themeLabel}`}
        aria-expanded={open}
      >
        <ThemeIcon size={18} />
      </button>

      <AnchoredFlyout
        open={open}
        onClose={close}
        triggerRef={triggerRef}
        flyoutRef={flyoutRef}
        title="Motyw"
        placement="left"
      >
        <ThemePickerMenu theme={theme} onSelect={handleThemeSelect} />
      </AnchoredFlyout>
    </>
  )
}
