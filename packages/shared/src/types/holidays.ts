import type { IsoDate } from './employee'

export const DAY_TYPES = {
  STATUTORY: 0,
  COMPANY_GIFT: 1,
} as const

export type DayTypeCode = (typeof DAY_TYPES)[keyof typeof DAY_TYPES]

export interface DayOff {
  id: string
  date: IsoDate
  name: string
  typeCode: DayTypeCode
}

export interface HolidaySyncResult {
  syncedCount: number
  years: number[]
}
