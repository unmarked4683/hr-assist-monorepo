import type { DayStatus } from './day-status'

export type RowStatus =
  | { type: 'ok' }
  | { type: 'absent' }
  | { type: 'leave'; label: DayStatus }
  | { type: 'future' }

export type ListAttendanceStatus = 'ok-list' | 'action-required'

export const REMOVE_FUTURE_ATTENDANCE = '__remove_future_attendance__' as const

export const REMOVE_FUTURE_ATTENDANCE_LABEL = 'Usuń frekwencję'
