import type { DayStatus, Employee, EmployeeInput, IsoDate, UnexcusedAbsence } from '@hr-assist/shared'
import { mockApiDelay } from '@/lib/api/mock/delay'
import {
  mockCreateEmployee,
  mockDeleteDayRecord,
  mockDeleteEmployee,
  mockFetchEmployeeById,
  mockFetchEmployees,
  mockFetchEmployeeUnexcusedAbsences,
  mockUpdateEmployee,
  mockUpsertDayRecord,
} from '@/lib/api/mock/employees'

export const fetchEmployees = async (): Promise<Employee[]> => {
  await mockApiDelay()
  // const response = await apiGet<ResponseWrapper<Employee[]>>('/employees')
  // return unwrapResponse(response)
  return mockFetchEmployees()
}

export const fetchEmployeeById = async (id: string): Promise<Employee | null> => {
  await mockApiDelay()
  // const response = await apiGet<ResponseWrapper<Employee>>(`/employees/${id}`)
  // return unwrapResponse(response)
  return mockFetchEmployeeById(id)
}

export const createEmployee = async (input: EmployeeInput): Promise<Employee> => {
  await mockApiDelay()
  // const response = await apiPost<ResponseWrapper<Employee>>('/employees', input)
  // return unwrapResponse(response)
  return mockCreateEmployee(input)
}

export const updateEmployee = async (
  id: string,
  input: EmployeeInput,
): Promise<Employee | null> => {
  await mockApiDelay()
  // const response = await apiPut<ResponseWrapper<Employee>>(`/employees/${id}`, input)
  // return unwrapResponse(response)
  return mockUpdateEmployee(id, input)
}

export const deleteEmployee = async (id: string): Promise<boolean> => {
  await mockApiDelay()
  // await apiDelete(`/employees/${id}`)
  // return true
  return mockDeleteEmployee(id)
}

export const upsertDayRecord = async (
  employeeId: string,
  date: IsoDate,
  status: DayStatus,
): Promise<Employee | null> => {
  await mockApiDelay()
  // const response = await apiPut<ResponseWrapper<Employee>>(
  //   `/employees/${employeeId}/day-records/${date}`,
  //   { status },
  // )
  // return unwrapResponse(response)
  return mockUpsertDayRecord(employeeId, date, status)
}

export const deleteDayRecord = async (
  employeeId: string,
  date: IsoDate,
): Promise<Employee | null> => {
  await mockApiDelay()
  // const response = await apiDelete<ResponseWrapper<Employee>>(
  //   `/employees/${employeeId}/day-records/${date}`,
  // )
  // return unwrapResponse(response)
  return mockDeleteDayRecord(employeeId, date)
}

export const fetchEmployeeUnexcusedAbsences = async (
  employeeId: string,
): Promise<UnexcusedAbsence[]> => {
  await mockApiDelay()
  // const response = await apiGet<ResponseWrapper<UnexcusedAbsence[]>>(
  //   `/employees/${employeeId}/unexcused-absences`,
  // )
  // return unwrapResponse(response)
  return mockFetchEmployeeUnexcusedAbsences(employeeId)
}
