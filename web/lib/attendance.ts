import { calcShiftHours, Employee } from '@/lib/hr-data'

export type RowStatus =
  | { type: 'ok' }
  | { type: 'absent' }
  | { type: 'leave'; label: string }
  | { type: 'future' }

export function getTodayStr(): string {
  const today = new Date()
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
}

export function getRowStatus(
  dateStr: string,
  employee: Employee,
  todayStr: string,
): RowStatus {
  if (dateStr > todayStr) return { type: 'future' }
  const record = employee.dayRecords.find((d) => d.date === dateStr)
  if (!record || !record.status || record.status === 'Obecność') return { type: 'ok' }
  if (record.status === 'Nieobecność nieusprawiedliwiona') return { type: 'absent' }
  return { type: 'leave', label: record.status }
}

export function getRealHours(dateStr: string, employee: Employee): string {
  const record = employee.dayRecords.find((d) => d.date === dateStr)
  if (!record || !record.status || record.status === 'Obecność') {
    return `${calcShiftHours(employee.startHour, employee.endHour)}h`
  }
  return '0h'
}

export function employeeNeedsAction(employee: Employee): boolean {
  return employee.dayRecords.some((d) => d.status === 'Nieobecność nieusprawiedliwiona')
}

export function isDayAbsent(dateStr: string, employee: Employee): boolean {
  const record = employee.dayRecords.find((d) => d.date === dateStr)
  return record?.status === 'Nieobecność nieusprawiedliwiona'
}
