'use client'

import type { ElementType } from 'react'
import { Monitor, Moon, Sun } from 'lucide-react'
import type { Theme } from '@/lib/types/theme'

export const THEME_OPTIONS: ReadonlyArray<{
  value: Theme
  label: string
  Icon: ElementType
}> = [
  { value: 'light', label: 'Jasny', Icon: Sun },
  { value: 'dark', label: 'Ciemny', Icon: Moon },
  { value: 'system', label: 'Systemowy', Icon: Monitor },
]

export const getThemeOption = (theme: Theme) =>
  THEME_OPTIONS.find((option) => option.value === theme) ?? THEME_OPTIONS[2]

interface ThemePickerMenuProps {
  theme: Theme
  onSelect: (theme: Theme) => void
}

export function ThemePickerMenu({ theme, onSelect }: ThemePickerMenuProps) {
  return (
    <div className="flex flex-col gap-0.5">
      {THEME_OPTIONS.map(({ value, label, Icon }) => (
        <button
          key={value}
          type="button"
          onClick={() => onSelect(value)}
          className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors w-full text-left ${
            theme === value
              ? 'bg-primary/10 text-primary font-medium'
              : 'hover:bg-accent text-foreground'
          }`}
        >
          <Icon size={15} />
          {label}
          {theme === value && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
        </button>
      ))}
    </div>
  )
}
