import {
  ContractType,
  DayStatus,
  Location,
  WORK_DIMENSION,
  type Employee,
  type EmployeeInput,
  type IsoDate,
  type UnexcusedAbsence,
} from '@hr-assist/shared'

const cloneEmployees = (items: Employee[]): Employee[] =>
  items.map((employee) => ({
    ...employee,
    dayRecords: employee.dayRecords.map((record) => ({ ...record })),
  }))

let employees: Employee[] = [
  {
    id: '1',
    firstName: 'Andrzej',
    lastName: 'Kowalski',
    pesel: '85042312345',
    contractType: ContractType.EMPLOYMENT,
    workDimension: WORK_DIMENSION.FULL.fraction,
    startHour: '08:00',
    endHour: '16:00',
    location: Location.HALL,
    position: 'Brygadzista',
    companyId: 'prod',
    dayRecords: [],
  },
  {
    id: '2',
    firstName: 'Anna',
    lastName: 'Nowak',
    pesel: '92061598765',
    contractType: ContractType.EMPLOYMENT,
    workDimension: WORK_DIMENSION.HALF.fraction,
    startHour: '08:00',
    endHour: '12:00',
    location: Location.OFFICE,
    position: 'Specjalista',
    companyId: 'service',
    dayRecords: [
      { date: '2026-06-02', status: DayStatus.UNEXCUSED_ABSENCE },
      { date: '2026-06-05', status: DayStatus.UNEXCUSED_ABSENCE },
      { date: '2026-06-10', status: DayStatus.UNEXCUSED_ABSENCE },
      { date: '2026-06-15', status: DayStatus.UNEXCUSED_ABSENCE },
      { date: '2026-06-18', status: DayStatus.UNEXCUSED_ABSENCE },
    ],
  },
]

export const mockFetchEmployees = async (): Promise<Employee[]> => cloneEmployees(employees)

export const mockFetchEmployeeById = async (id: string): Promise<Employee | null> => {
  const employee = employees.find((item) => item.id === id)
  return employee ? cloneEmployees([employee])[0] : null
}

export const mockCreateEmployee = async (input: EmployeeInput): Promise<Employee> => {
  const created: Employee = {
    ...input,
    id: String(Date.now()),
    dayRecords: [],
  }
  employees = [...employees, created]
  return cloneEmployees([created])[0]
}

export const mockUpdateEmployee = async (
  id: string,
  input: EmployeeInput,
): Promise<Employee | null> => {
  const index = employees.findIndex((item) => item.id === id)
  if (index === -1) return null

  employees = employees.map((item) =>
    item.id === id ? { ...item, ...input, id: item.id, dayRecords: item.dayRecords } : item,
  )

  return mockFetchEmployeeById(id)
}

export const mockDeleteEmployee = async (id: string): Promise<boolean> => {
  const exists = employees.some((item) => item.id === id)
  if (!exists) return false
  employees = employees.filter((item) => item.id !== id)
  return true
}

export const mockUpsertDayRecord = async (
  employeeId: string,
  date: IsoDate,
  status: DayStatus,
): Promise<Employee | null> => {
  const index = employees.findIndex((item) => item.id === employeeId)
  if (index === -1) return null

  employees = employees.map((employee) => {
    if (employee.id !== employeeId) return employee

    const existingRecord = employee.dayRecords.find((record) => record.date === date)
    if (existingRecord) {
      return {
        ...employee,
        dayRecords: employee.dayRecords.map((record) =>
          record.date === date ? { ...record, status } : record,
        ),
      }
    }

    return {
      ...employee,
      dayRecords: [...employee.dayRecords, { date, status }],
    }
  })

  return mockFetchEmployeeById(employeeId)
}

export const mockDeleteDayRecord = async (
  employeeId: string,
  date: IsoDate,
): Promise<Employee | null> => {
  const index = employees.findIndex((item) => item.id === employeeId)
  if (index === -1) return null

  employees = employees.map((employee) => {
    if (employee.id !== employeeId) return employee
    return {
      ...employee,
      dayRecords: employee.dayRecords.filter((record) => record.date !== date),
    }
  })

  return mockFetchEmployeeById(employeeId)
}

export const mockFetchEmployeeUnexcusedAbsences = async (
  employeeId: string,
): Promise<UnexcusedAbsence[]> => {
  const employee = employees.find((item) => item.id === employeeId)
  if (!employee) return []

  return employee.dayRecords
    .filter((record) => record.status === DayStatus.UNEXCUSED_ABSENCE)
    .map((record) => ({ date: record.date }))
    .sort((a, b) => a.date.localeCompare(b.date))
}
