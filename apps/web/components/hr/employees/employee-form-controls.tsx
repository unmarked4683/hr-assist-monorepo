'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { DIMENSION_LABEL, WORK_DIMENSIONS, formatHour, type WorkDimension } from '@hr-assist/shared'
import { useClickOutside } from '@/lib/hooks/useClickOutside'

const DROPDOWN_PANEL =
  'absolute top-full left-0 right-0 z-[100] bg-popover border border-border rounded-lg shadow-xl overflow-y-auto'

const ALL_HOURS = Array.from({ length: 24 }, (_, index) => formatHour(index))

interface FormSelectProps<T extends string> {
  label: string
  value: T
  options: ReadonlyArray<{ value: T; label: string }>
  onChange: (value: T) => void
  locked?: boolean
  maxHeightClass?: string
}

export const FormSelect = <T extends string>({
  label,
  value,
  options,
  onChange,
  locked = false,
  maxHeightClass = 'max-h-48',
}: FormSelectProps<T>) => {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const close = useCallback(() => setOpen(false), [])
  const selected = options.find((option) => option.value === value)?.label ?? value

  useClickOutside(ref, close)

  return (
    <div className="flex flex-col gap-1.5" ref={ref}>
      <label className="text-xs font-semibold text-muted-foreground">{label}</label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className="h-9 w-full min-w-0 px-3 pr-8 rounded-lg border border-input bg-background text-sm text-foreground text-left focus:outline-none focus:ring-2 focus:ring-primary/30 hover:border-primary/40 transition relative"
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          <span className="block leading-tight">{selected}</span>
          <ChevronDown
            size={14}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none shrink-0"
          />
        </button>
        {open && (
          <div className={`${DROPDOWN_PANEL} ${maxHeightClass}`} role="listbox">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={option.value === value}
                disabled={locked && option.value !== value}
                onClick={() => {
                  if (locked) return
                  onChange(option.value)
                  setOpen(false)
                }}
                className={`w-full text-left px-3 py-2 text-sm transition-colors hover:bg-accent ${
                  option.value === value
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-foreground'
                } ${locked && option.value !== value ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

interface HourPickerProps {
  value: string
  onChange: (value: string) => void
  label: string
  hint?: string
}

export const HourPicker = ({ value, onChange, label, hint }: HourPickerProps) => {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const close = useCallback(() => setOpen(false), [])

  useClickOutside(ref, close)

  return (
    <div className="flex flex-col gap-1.5" ref={ref}>
      <label className="text-xs font-semibold text-muted-foreground">{label}</label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className="h-9 w-full px-3 rounded-lg border border-input bg-background text-sm text-foreground text-left focus:outline-none focus:ring-2 focus:ring-primary/30 hover:border-primary/40 transition"
        >
          {value}
        </button>
        {open && (
          <div className={`${DROPDOWN_PANEL} max-h-48`}>
            {ALL_HOURS.map((hour) => (
              <button
                key={hour}
                type="button"
                onClick={() => {
                  onChange(hour)
                  setOpen(false)
                }}
                className={`w-full text-left px-3 py-2 text-sm transition-colors hover:bg-accent ${
                  value === hour ? 'bg-primary/10 text-primary font-medium' : 'text-foreground'
                }`}
              >
                {hour}
              </button>
            ))}
          </div>
        )}
      </div>
      {hint && (
        <span className="text-xs text-amber-500 dark:text-amber-400 font-medium">{hint}</span>
      )}
    </div>
  )
}

interface AutocompleteInputProps {
  value: string
  onChange: (value: string) => void
  suggestions: readonly string[]
  placeholder?: string
  label: string
}

export const AutocompleteInput = ({
  value,
  onChange,
  suggestions,
  placeholder,
  label,
}: AutocompleteInputProps) => {
  const [open, setOpen] = useState(false)
  const [filtered, setFiltered] = useState<string[]>([])
  const ref = useRef<HTMLDivElement>(null)
  const close = useCallback(() => setOpen(false), [])

  useEffect(() => {
    setFiltered(
      suggestions.filter((suggestion) =>
        suggestion.toLowerCase().includes(value.toLowerCase()),
      ),
    )
  }, [value, suggestions])

  useClickOutside(ref, close)

  return (
    <div className="flex flex-col gap-1.5" ref={ref}>
      <label className="text-xs font-semibold text-muted-foreground">{label}</label>
      <div className="relative">
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(event) => {
            onChange(event.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          className="h-9 w-full px-3 rounded-lg border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
        />
        {open && filtered.length > 0 && (
          <div className={`${DROPDOWN_PANEL} max-h-40`}>
            {filtered.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => {
                  onChange(suggestion)
                  setOpen(false)
                }}
                className="w-full text-left px-3 py-2 text-sm hover:bg-accent text-foreground transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

interface DimensionSelectProps {
  value: WorkDimension
  onChange: (value: WorkDimension) => void
}

export const DimensionSelect = ({ value, onChange }: DimensionSelectProps) => {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const close = useCallback(() => setOpen(false), [])

  useClickOutside(ref, close)

  return (
    <div className="flex flex-col gap-1.5" ref={ref}>
      <label className="text-xs font-semibold text-muted-foreground">Wymiar pracy</label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className="h-9 w-full px-3 pr-8 rounded-lg border border-input bg-background text-sm text-foreground text-left focus:outline-none focus:ring-2 focus:ring-primary/30 hover:border-primary/40 transition relative"
        >
          {value === '1' ? '1 (pełny etat)' : value}
          <ChevronDown
            size={14}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
        </button>
        {open && (
          <div className={`${DROPDOWN_PANEL} overflow-hidden`}>
            {WORK_DIMENSIONS.map((dimension) => (
              <button
                key={dimension}
                type="button"
                onClick={() => {
                  onChange(dimension)
                  setOpen(false)
                }}
                className={`w-full text-left px-3 py-2.5 text-sm transition-colors hover:bg-accent flex items-center justify-between ${
                  value === dimension
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-foreground'
                }`}
              >
                <span>{dimension === '1' ? '1 (pełny etat)' : dimension}</span>
                <span className="text-xs text-muted-foreground">{DIMENSION_LABEL[dimension]}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      <span className="text-xs text-primary font-medium leading-none">{DIMENSION_LABEL[value]}</span>
    </div>
  )
}
