import { DAY_ABBR, MONTH_NAMES_GEN } from '../types/dates'
import type { IsoDate } from '../types/employee'

export const formatPolishDate = (day: number, month: number, year: number): string =>
  `${day} ${MONTH_NAMES_GEN[month - 1]} ${year}`

export const getDaysInMonth = (year: number, month: number): number =>
  new Date(year, month, 0).getDate()

export const getDayOfWeek = (year: number, month: number, day: number): string =>
  DAY_ABBR[new Date(year, month - 1, day).getDay()]

export const isWeekend = (year: number, month: number, day: number): boolean => {
  const dayOfWeek = new Date(year, month - 1, day).getDay()
  return dayOfWeek === 0 || dayOfWeek === 6
}

export const getTodayIsoDate = (): IsoDate => {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}` as IsoDate
}

export const toIsoDate = (year: number, month: number, day: number): IsoDate => {
  const monthPart = String(month).padStart(2, '0')
  const dayPart = String(day).padStart(2, '0')
  return `${year}-${monthPart}-${dayPart}` as IsoDate
}

export const getInitialTimesheetPeriod = (): { month: number; year: number } => {
  const now = new Date()
  const year = now.getFullYear()
  return {
    month: now.getMonth() + 1,
    year: year < 2026 ? 2026 : year,
  }
}
