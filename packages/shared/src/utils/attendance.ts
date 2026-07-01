import {
  PRESENT_STATUS,
  UNEXCUSED_ABSENCE_STATUS,
  type ListAttendanceStatus,
  type RowStatus,
} from '../types/attendance'
import type { Employee } from '../types/employee'
import { calcShiftHours } from './shift'

export const getRowStatus = (
  dateStr: string,
  employee: Employee,
  todayStr: string,
): RowStatus => {
  const record = employee.dayRecords.find(({ date }) => date === dateStr)

  if (record?.status) {
    if (record.status === PRESENT_STATUS) return { type: 'ok' }
    if (record.status === UNEXCUSED_ABSENCE_STATUS) return { type: 'absent' }
    return { type: 'leave', label: record.status }
  }

  if (dateStr > todayStr) return { type: 'future' }

  return { type: 'ok' }
}

export const hasDayRecord = (dateStr: string, employee: Employee): boolean =>
  employee.dayRecords.some(({ date, status }) => date === dateStr && Boolean(status))

export const getRealHours = (dateStr: string, employee: Employee): string => {
  const record = employee.dayRecords.find(({ date }) => date === dateStr)
  if (!record?.status || record.status === PRESENT_STATUS) {
    return `${calcShiftHours(employee.startHour, employee.endHour)}h`
  }
  return '0h'
}

export const employeeNeedsAction = (employee: Employee): boolean =>
  employee.dayRecords.some(({ status }) => status === UNEXCUSED_ABSENCE_STATUS)

export const isDayAbsent = (dateStr: string, employee: Employee): boolean => {
  const record = employee.dayRecords.find(({ date }) => date === dateStr)
  return record?.status === UNEXCUSED_ABSENCE_STATUS
}

export const toListAttendanceStatus = (needsAction: boolean): ListAttendanceStatus =>
  needsAction ? 'action-required' : 'ok-list'
