import { DayStatus } from '../types/day-status'
import type { ListAttendanceStatus, RowStatus } from '../types/attendance'
import type { Employee } from '../types/employee'
import { calcShiftHours } from './shift'

export const getRowStatus = (
  dateStr: string,
  employee: Employee,
  todayStr: string,
): RowStatus => {
  const record = employee.dayRecords.find(({ date }) => date === dateStr)

  if (record?.status) {
    if (record.status === DayStatus.PRESENT) return { type: 'ok' }
    if (record.status === DayStatus.UNEXCUSED_ABSENCE) return { type: 'absent' }
    return { type: 'leave', label: record.status }
  }

  if (dateStr > todayStr) return { type: 'future' }

  return { type: 'ok' }
}

export const hasDayRecord = (dateStr: string, employee: Employee): boolean =>
  employee.dayRecords.some(({ date, status }) => date === dateStr && Boolean(status))

export const getRealHours = (dateStr: string, employee: Employee): string => {
  const record = employee.dayRecords.find(({ date }) => date === dateStr)
  if (!record?.status || record.status === DayStatus.PRESENT) {
    return `${calcShiftHours(employee.startHour, employee.endHour)}h`
  }
  return '0h'
}

export const employeeNeedsAction = (employee: Employee): boolean =>
  employee.dayRecords.some(({ status }) => status === DayStatus.UNEXCUSED_ABSENCE)

export const isDayAbsent = (dateStr: string, employee: Employee): boolean => {
  const record = employee.dayRecords.find(({ date }) => date === dateStr)
  return record?.status === DayStatus.UNEXCUSED_ABSENCE
}

export const toListAttendanceStatus = (needsAction: boolean): ListAttendanceStatus =>
  needsAction ? 'action-required' : 'ok-list'
