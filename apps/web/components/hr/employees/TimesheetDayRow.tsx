'use client'

import { forwardRef, memo } from 'react'
import type { IsoDate, RowStatus } from '@hr-assist/shared'
import { AttendanceStatusBadge } from '../shared/AttendanceStatusBadge'
import { TodayDayCell } from '../shared/TodayDayCell'

interface TimesheetDayRowProps {
  day: number
  dateStr: IsoDate
  dayOfWeek: string
  weekend: boolean
  rowStatus: RowStatus | null
  isToday: boolean
  isFutureUnset: boolean
  isAbsent: boolean
  workRangeLabel: string
  nominalHours: string
  realHours: string
  onDayClick: (date: IsoDate) => void
}

const areRowStatusesEqual = (
  left: RowStatus | null,
  right: RowStatus | null,
): boolean => {
  if (left === right) return true
  if (!left || !right) return false
  if (left.type !== right.type) return false
  if (left.type === 'leave' && right.type === 'leave') return left.label === right.label
  return true
}

const areTimesheetDayRowPropsEqual = (
  previous: TimesheetDayRowProps,
  next: TimesheetDayRowProps,
): boolean =>
  previous.dateStr === next.dateStr &&
  previous.day === next.day &&
  previous.dayOfWeek === next.dayOfWeek &&
  previous.weekend === next.weekend &&
  previous.isToday === next.isToday &&
  previous.isFutureUnset === next.isFutureUnset &&
  previous.isAbsent === next.isAbsent &&
  previous.workRangeLabel === next.workRangeLabel &&
  previous.nominalHours === next.nominalHours &&
  previous.realHours === next.realHours &&
  areRowStatusesEqual(previous.rowStatus, next.rowStatus) &&
  previous.onDayClick === next.onDayClick

export const TimesheetDayRow = memo(
  forwardRef<HTMLTableRowElement, TimesheetDayRowProps>(function TimesheetDayRow(
    {
      day,
      dateStr,
      dayOfWeek,
      weekend,
      rowStatus,
      isToday,
      isFutureUnset,
      isAbsent,
      workRangeLabel,
      nominalHours,
      realHours,
      onDayClick,
    },
    ref,
  ) {
    return (
      <tr
        ref={ref}
        onClick={() => !weekend && onDayClick(dateStr)}
        className={[
          'hr-table-row',
          weekend ? 'text-muted-foreground cursor-default' : 'hr-table-row-clickable',
          isFutureUnset && 'text-muted-foreground/60',
          isAbsent && 'animate-pulse-red-row',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {isToday ? (
          <TodayDayCell day={day} />
        ) : (
          <td className="px-2 py-2.5 text-center font-medium tabular-nums">{day}</td>
        )}
        <td className="px-2 py-2.5 text-center">{dayOfWeek}</td>
        <td className="px-2 py-2.5 text-center tabular-nums whitespace-nowrap">
          {weekend ? (
            <span className="text-xs text-muted-foreground/60 italic">wolne</span>
          ) : (
            workRangeLabel
          )}
        </td>
        <td className="px-2 py-2.5 text-center tabular-nums">{weekend ? '—' : nominalHours}</td>
        <td className="px-2 py-2.5 text-center tabular-nums">{weekend ? '—' : realHours}</td>
        <td className="px-2 py-2.5 text-center">
          {weekend ? (
            <span className="text-xs text-muted-foreground/60 italic">—</span>
          ) : (
            rowStatus && <AttendanceStatusBadge variant="table" status={rowStatus} />
          )}
        </td>
      </tr>
    )
  }),
  areTimesheetDayRowPropsEqual,
)

TimesheetDayRow.displayName = 'TimesheetDayRow'
