import { DAY_TYPES, type DayTypeCode } from '../types/holidays'

const DAY_TYPE_LABELS: Record<DayTypeCode, string> = {
  [DAY_TYPES.STATUTORY]: 'Ustawowe',
  [DAY_TYPES.COMPANY_GIFT]: 'Prezent firmowy',
}

export function getDayOffTypeLabel(typeCode: DayTypeCode): string {
  return DAY_TYPE_LABELS[typeCode]
}

export function isValidDayTypeCode(value: number): value is DayTypeCode {
  return (Object.values(DAY_TYPES) as number[]).includes(value)
}
