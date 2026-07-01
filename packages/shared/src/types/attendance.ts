import type { DayStatus } from './employee'

export type RowStatus =
  | { type: 'ok' }
  | { type: 'absent' }
  | { type: 'leave'; label: string }
  | { type: 'future' }

export type ListAttendanceStatus = 'ok-list' | 'action-required'

export const PRESENT_STATUS: DayStatus = 'Obecność'

export const UNEXCUSED_ABSENCE_STATUS: DayStatus = 'Nieobecność nieusprawiedliwiona'

export const DAY_STATUS_OPTIONS: readonly DayStatus[] = [
  PRESENT_STATUS,
  UNEXCUSED_ABSENCE_STATUS,
  'Urlop wypoczynkowy',
  'Urlop na żądanie',
  'Urlop macierzyński',
  'Urlop wychowawczy',
  'Urlop bezpłatny',
  'Choroba',
  'Opieka',
  'Zwolnienie płatne',
  'Zwolnienie niepłatne',
  'Służba wojskowa',
]

export const REMOVE_FUTURE_ATTENDANCE = '__remove_future_attendance__' as const

export const REMOVE_FUTURE_ATTENDANCE_LABEL = 'Usuń frekwencję'
