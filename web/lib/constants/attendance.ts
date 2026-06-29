import type { DayStatus } from '@/lib/types'

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
