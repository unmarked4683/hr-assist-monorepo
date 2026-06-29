'use client'

import { useState, useRef, useEffect } from 'react'
import { Users, Sun, Moon, Monitor, ChevronRight } from 'lucide-react'
import { useApp, Theme } from '../AppContext'

export function Sidebar() {
  const { theme, setTheme } = useApp()
  const [popoverOpen, setPopoverOpen] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        !triggerRef.current?.contains(e.target as Node)
      ) {
        setPopoverOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const themeOptions: { value: Theme; label: string; Icon: React.ElementType }[] = [
    { value: 'light', label: 'Jasny', Icon: Sun },
    { value: 'dark', label: 'Ciemny', Icon: Moon },
    { value: 'system', label: 'Systemowy', Icon: Monitor },
  ]

  return (
    <aside className="w-60 shrink-0 h-screen flex flex-col bg-sidebar border-r border-sidebar-border">
      <div className="px-5 pt-6 pb-4">
        <span className="text-lg font-bold text-sidebar-foreground tracking-tight">HR Assist</span>
      </div>

      <nav className="flex-1 px-3 py-2">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-sidebar-accent text-sidebar-primary font-medium text-sm cursor-default select-none">
          <Users size={17} />
          <span>Pracownicy</span>
        </div>
      </nav>

      <div className="px-3 pb-4 relative">
        <button
          ref={triggerRef}
          onClick={() => setPopoverOpen((v) => !v)}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-sidebar-accent transition-colors text-left"
          aria-label="Opcje profilu"
        >
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-primary-foreground">BK</span>
          </div>
          <div className="leading-tight min-w-0">
            <div className="text-sm font-semibold text-sidebar-foreground">Basia</div>
            <div className="text-sm font-semibold text-sidebar-foreground">Kowalska</div>
          </div>
          <ChevronRight
            size={14}
            className={`ml-auto text-muted-foreground transition-transform duration-200 ${popoverOpen ? 'rotate-90' : ''}`}
          />
        </button>

        {popoverOpen && (
          <div
            ref={popoverRef}
            className="absolute bottom-full left-3 mb-2 w-52 bg-popover border border-border rounded-xl shadow-lg p-3 z-50"
            role="dialog"
            aria-label="Wybór motywu"
          >
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 px-1">
              Motyw
            </p>
            <div className="flex flex-col gap-0.5">
              {themeOptions.map(({ value, label, Icon }) => (
                <button
                  key={value}
                  onClick={() => {
                    setTheme(value)
                    setPopoverOpen(false)
                  }}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors w-full text-left ${
                    theme === value
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'hover:bg-accent text-foreground'
                  }`}
                >
                  <Icon size={15} />
                  {label}
                  {theme === value && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
