'use client'

import { DayStatus, getDayStatusLabel, type RowStatus, type ListAttendanceStatus } from '@hr-assist/shared'

type ListStatus = ListAttendanceStatus

interface AttendanceStatusBadgeProps {
  variant: 'list'
  status: ListStatus
}

interface AttendanceStatusBadgeTableProps {
  variant: 'table'
  status: RowStatus
}

type Props = AttendanceStatusBadgeProps | AttendanceStatusBadgeTableProps

function toRowStatus(props: Props): RowStatus {
  if (props.variant === 'table') return props.status
  return props.status === 'action-required' ? { type: 'absent' } : { type: 'ok' }
}

export function AttendanceStatusBadge(props: Props) {
  const status = toRowStatus(props)

  if (status.type === 'future') {
    return (
      <span className="inline-flex items-center justify-center text-muted-foreground/50 text-sm select-none">
        —
      </span>
    )
  }

  if (status.type === 'ok') {
    return (
      <span className="inline-flex items-center justify-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-[oklch(0.52_0.17_145)] dark:bg-[oklch(0.6_0.17_145)] shrink-0" />
        <span className="text-[oklch(0.52_0.17_145)] dark:text-[oklch(0.6_0.17_145)] font-bold text-xs tracking-widest">
          OK
        </span>
      </span>
    )
  }

  if (status.type === 'absent') {
    return (
      <span className="relative inline-flex items-center justify-center gap-1.5 group">
        <span className="w-2 h-2 rounded-full bg-[oklch(0.53_0.22_25)] shrink-0" />
        <span className="text-[oklch(0.53_0.22_25)] dark:text-[oklch(0.62_0.22_25)] font-bold text-xs tracking-widest">
          NN
        </span>
        <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 whitespace-nowrap rounded-md border border-border bg-popover px-2.5 py-1 text-xs text-popover-foreground shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-50">
          {DayStatus.UNEXCUSED_ABSENCE}
        </span>
      </span>
    )
  }

  return (
    <span className="relative inline-flex items-center justify-center gap-1.5 group">
      <span className="w-2 h-2 rounded-full bg-[oklch(0.72_0.17_70)] shrink-0" />
      <span className="text-[oklch(0.65_0.14_70)] dark:text-[oklch(0.78_0.17_70)] font-bold text-xs tracking-widest">
        USP
      </span>
      <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 whitespace-nowrap rounded-md border border-border bg-popover px-2.5 py-1 text-xs text-popover-foreground shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-50">
        {getDayStatusLabel(status.label)}
      </span>
    </span>
  )
}
