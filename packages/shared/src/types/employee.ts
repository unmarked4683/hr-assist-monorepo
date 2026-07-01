import type { DayStatus } from './day-status'
import type { ContractType } from './contract-type'
import type { Location } from './location'
import type { WorkDimension } from './work-dimension'

export type IsoDate = `${number}-${number}-${number}`

export interface DayRecord {
  date: IsoDate
  status: DayStatus | null
}

export interface Employee {
  id: string
  firstName: string
  lastName: string
  pesel: string
  contractType: ContractType
  workDimension: WorkDimension
  startHour: string
  endHour: string
  location: Location
  position: string
  companyId: string
  dayRecords: DayRecord[]
}

export type EmployeeInput = Omit<Employee, 'id' | 'dayRecords'>

export interface UpsertDayRecordInput {
  employeeId: string
  date: IsoDate
  status: DayStatus
}
