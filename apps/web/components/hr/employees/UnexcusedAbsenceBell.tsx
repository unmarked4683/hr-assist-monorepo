'use client'

import { useCallback, useRef, useState } from 'react'
import { Bell } from 'lucide-react'
import {
  formatPolishDate,
  parseIsoDate,
  type IsoDate,
  type UnexcusedAbsence,
} from '@hr-assist/shared'
import { AnchoredFlyout } from '../shared/AnchoredFlyout'
import { useUnexcusedAbsences } from '@/lib/hooks/useUnexcusedAbsences'
import { cn } from '@/lib/utils'

const LIST_ITEM_HEIGHT_REM = 2.5
const MAX_VISIBLE_ITEMS = 4

interface UnexcusedAbsenceBellProps {
  employeeId: string
  refreshToken?: string | number
  onSelectAbsence: (date: IsoDate) => void
}

const formatAbsenceLabel = (date: IsoDate): string => {
  const { year, month, day } = parseIsoDate(date)
  return formatPolishDate(day, month, year)
}

function AbsenceList({
  absences,
  isLoading,
  onSelect,
}: {
  absences: UnexcusedAbsence[]
  isLoading: boolean
  onSelect: (date: IsoDate) => void
}) {
  if (isLoading) {
    return <p className="px-2 py-3 text-sm text-muted-foreground">Ładowanie…</p>
  }

  if (absences.length === 0) {
    return (
      <div className="px-2 py-4 text-center">
        <p className="text-sm font-medium text-foreground">Wszystko w porządku</p>
        <p className="text-xs text-muted-foreground mt-1">
          Brak nieobecności nieusprawiedliwionych
        </p>
      </div>
    )
  }

  const listMaxHeight = `${MAX_VISIBLE_ITEMS * LIST_ITEM_HEIGHT_REM}rem`

  return (
    <div
      className="overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent -mx-1"
      style={{ maxHeight: listMaxHeight }}
    >
      <ul className="flex flex-col gap-0.5">
        {absences.map(({ date }) => (
          <li key={date}>
            <button
              type="button"
              onClick={() => onSelect(date)}
              className="w-full text-left px-3 rounded-lg text-sm transition-colors hover:bg-accent animate-pulse-red-text"
              style={{ minHeight: `${LIST_ITEM_HEIGHT_REM}rem` }}
            >
              {formatAbsenceLabel(date)}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function UnexcusedAbsenceBell({
  employeeId,
  refreshToken = 0,
  onSelectAbsence,
}: UnexcusedAbsenceBellProps) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const flyoutRef = useRef<HTMLDivElement>(null)
  const { absences, isLoading, hasAbsences, reload } = useUnexcusedAbsences(
    employeeId,
    refreshToken,
  )

  const close = useCallback(() => setOpen(false), [])

  const handleToggle = () => {
    setOpen((current) => {
      const next = !current
      if (next) void reload()
      return next
    })
  }

  const handleSelect = (date: IsoDate) => {
    onSelectAbsence(date)
  }

  const showAlertState = !isLoading && hasAbsences

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={handleToggle}
        className={cn(
          'w-8 h-8 flex items-center justify-center rounded-lg border border-border transition-colors shrink-0',
          showAlertState
            ? 'animate-bell-btn-alert text-[oklch(0.53_0.22_25)] hover:text-[oklch(0.48_0.22_25)]'
            : 'hover:bg-accent text-muted-foreground hover:text-foreground',
        )}
        aria-label="Nieobecności nieusprawiedliwione"
        aria-expanded={open}
      >
        <Bell size={15} className={showAlertState ? 'animate-bell-ring' : undefined} />
      </button>

      <AnchoredFlyout
        open={open}
        onClose={close}
        triggerRef={triggerRef}
        flyoutRef={flyoutRef}
        title="Nieobecności NN"
        placement="left"
        showCloseButton
        panelClassName="w-64"
      >
        <AbsenceList absences={absences} isLoading={isLoading} onSelect={handleSelect} />
      </AnchoredFlyout>
    </>
  )
}
