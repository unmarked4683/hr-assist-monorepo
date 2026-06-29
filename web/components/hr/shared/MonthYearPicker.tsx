'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { MONTH_NAMES_NOM } from '@/lib/hr-data'
import { cn } from '@/lib/utils'

interface MonthYearPickerProps {
  month: number
  year: number
  onChange: (month: number, year: number) => void
  minYear?: number
  minMonth?: number
  yearStart?: number
  yearCount?: number
  compact?: boolean
  className?: string
}

export function MonthYearPicker({
  month,
  year,
  onChange,
  minYear,
  minMonth = 1,
  yearStart = 2026,
  yearCount = 10,
  compact = false,
  className,
}: MonthYearPickerProps) {
  const canGoBack = minYear === undefined || !(year === minYear && month === minMonth)

  function prev() {
    if (!canGoBack) return
    if (month === 1) onChange(12, year - 1)
    else onChange(month - 1, year)
  }

  function next() {
    if (month === 12) onChange(1, year + 1)
    else onChange(month + 1, year)
  }

  const selectHeight = compact ? 'h-8' : 'h-9'

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <button
        type="button"
        onClick={prev}
        disabled={!canGoBack}
        className={cn(
          'w-8 h-8 flex items-center justify-center rounded-lg border border-border transition-colors',
          canGoBack
            ? 'hover:bg-accent text-foreground'
            : 'text-muted-foreground/30 cursor-not-allowed',
        )}
        aria-label="Poprzedni miesiąc"
      >
        <ChevronLeft size={15} />
      </button>

      <div className={cn('flex gap-2', compact ? '' : 'flex-1')}>
        <select
          value={month}
          onChange={(e) => {
            const m = parseInt(e.target.value, 10)
            if (minYear !== undefined && year === minYear && m < minMonth) return
            onChange(m, year)
          }}
          className={cn(
            'px-2 rounded-lg border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition appearance-none cursor-pointer',
            compact ? selectHeight : `flex-1 ${selectHeight}`,
          )}
        >
          {MONTH_NAMES_NOM.map((name, idx) => {
            const m = idx + 1
            const disabled = minYear !== undefined && year === minYear && m < minMonth
            return (
              <option key={m} value={m} disabled={disabled}>
                {name}
              </option>
            )
          })}
        </select>

        <select
          value={year}
          onChange={(e) => onChange(month, parseInt(e.target.value, 10))}
          className={cn(
            'px-2 rounded-lg border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition appearance-none cursor-pointer',
            compact ? `${selectHeight} w-auto` : `w-24 ${selectHeight}`,
          )}
        >
          {Array.from({ length: yearCount }, (_, i) => yearStart + i).map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      <button
        type="button"
        onClick={next}
        className="w-8 h-8 flex items-center justify-center rounded-lg border border-border hover:bg-accent text-foreground transition-colors"
        aria-label="Następny miesiąc"
      >
        <ChevronRight size={15} />
      </button>
    </div>
  )
}

export function getInitialPeriod() {
  const now = new Date()
  const year = Math.max(now.getFullYear(), 2026)
  const month = now.getFullYear() < 2026 ? 1 : now.getMonth() + 1
  return { month, year }
}
