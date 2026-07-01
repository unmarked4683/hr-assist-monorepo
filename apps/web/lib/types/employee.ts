export type ContractType = 'Umowa o pracę' | 'Umowa zlecenie' | 'Umowa o dzieło' | 'B2B'

export type WorkDimension = '1' | '7/8' | '3/4' | '5/8' | '1/2' | '3/8' | '1/4' | '1/8'

export type Location = 'Biuro' | 'Hala'

export type Company = 'Spółka Produkcja' | 'Spółka Serwis' | 'Spółka Marka Własna'

export type DayStatus =
  | 'Obecność'
  | 'Nieobecność nieusprawiedliwiona'
  | 'Urlop wypoczynkowy'
  | 'Urlop na żądanie'
  | 'Urlop macierzyński'
  | 'Urlop wychowawczy'
  | 'Urlop bezpłatny'
  | 'Choroba'
  | 'Opieka'
  | 'Zwolnienie płatne'
  | 'Zwolnienie niepłatne'
  | 'Służba wojskowa'

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
  company: Company
  dayRecords: DayRecord[]
}

export type EmployeeInput = Omit<Employee, 'id' | 'dayRecords'>

export interface UpsertDayRecordInput {
  employeeId: string
  date: IsoDate
  status: DayStatus
}
