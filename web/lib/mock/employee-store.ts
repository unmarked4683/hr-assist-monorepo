import type { DayStatus, Employee, EmployeeInput, IsoDate } from '@/lib/types'

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
    contractType: 'Umowa o pracę',
    workDimension: '1',
    startHour: '08:00',
    endHour: '16:00',
    location: 'Hala',
    position: 'Brygadzista',
    company: 'Spółka Produkcja',
    dayRecords: [],
  },
  {
    id: '2',
    firstName: 'Anna',
    lastName: 'Nowak',
    pesel: '92061598765',
    contractType: 'Umowa o pracę',
    workDimension: '1/2',
    startHour: '08:00',
    endHour: '12:00',
    location: 'Biuro',
    position: 'Specjalista',
    company: 'Spółka Serwis',
    dayRecords: [{ date: '2026-06-02', status: 'Nieobecność nieusprawiedliwiona' }],
  },
]

export const employeeStore = {
  getAll: (): Employee[] => cloneEmployees(employees),

  getById: (id: string): Employee | null => {
    const employee = employees.find((item) => item.id === id)
    return employee ? cloneEmployees([employee])[0] : null
  },

  create: (input: EmployeeInput): Employee => {
    const created: Employee = {
      ...input,
      id: String(Date.now()),
      dayRecords: [],
    }
    employees = [...employees, created]
    return cloneEmployees([created])[0]
  },

  update: (id: string, input: EmployeeInput): Employee | null => {
    const index = employees.findIndex((item) => item.id === id)
    if (index === -1) return null

    employees = employees.map((item) =>
      item.id === id ? { ...item, ...input, id: item.id, dayRecords: item.dayRecords } : item,
    )

    return employeeStore.getById(id)
  },

  upsertDayRecord: (employeeId: string, date: IsoDate, status: DayStatus): Employee | null => {
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

    return employeeStore.getById(employeeId)
  },

  deleteDayRecord: (employeeId: string, date: IsoDate): Employee | null => {
    const index = employees.findIndex((item) => item.id === employeeId)
    if (index === -1) return null

    employees = employees.map((employee) => {
      if (employee.id !== employeeId) return employee
      return {
        ...employee,
        dayRecords: employee.dayRecords.filter((record) => record.date !== date),
      }
    })

    return employeeStore.getById(employeeId)
  },

  delete: (id: string): boolean => {
    const exists = employees.some((item) => item.id === id)
    if (!exists) return false
    employees = employees.filter((item) => item.id !== id)
    return true
  },
}
