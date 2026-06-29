import { employeeStore } from '@/lib/mock/employee-store'
import { mockApiDelay } from '@/lib/api/mock-delay'
import type { DayStatus, Employee, EmployeeInput, IsoDate } from '@/lib/types'

export const fetchEmployees = async (): Promise<Employee[]> => {
  await mockApiDelay()
  return employeeStore.getAll()
}

export const fetchEmployeeById = async (id: string): Promise<Employee | null> => {
  await mockApiDelay()
  return employeeStore.getById(id)
}

export const createEmployee = async (input: EmployeeInput): Promise<Employee> =>
  employeeStore.create(input)

export const updateEmployee = async (id: string, input: EmployeeInput): Promise<Employee | null> =>
  employeeStore.update(id, input)

export const upsertDayRecord = async (
  employeeId: string,
  date: IsoDate,
  status: DayStatus,
): Promise<Employee | null> => employeeStore.upsertDayRecord(employeeId, date, status)
