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

export const EMPLOYMENT_CONTRACT: ContractType = 'Umowa o pracę'

export const CONTRACT_TYPE_OPTIONS: ReadonlyArray<{ value: ContractType; label: string }> = [
  { value: EMPLOYMENT_CONTRACT, label: EMPLOYMENT_CONTRACT },
]

export const COMPANY_OPTIONS: ReadonlyArray<{ value: Company; label: string }> = [
  { value: 'Spółka Produkcja', label: 'Spółka Produkcja' },
  { value: 'Spółka Serwis', label: 'Spółka Serwis' },
  { value: 'Spółka Marka Własna', label: 'Spółka Marka Własna' },
]

export const WORK_DIMENSIONS: readonly WorkDimension[] = [
  '1',
  '7/8',
  '3/4',
  '5/8',
  '1/2',
  '3/8',
  '1/4',
  '1/8',
]

export const LOCATIONS = ['Biuro', 'Hala'] as const

export const POSITION_SUGGESTIONS: readonly string[] = [
  'Brygadzista',
  'Specjalista',
  'Kierownik',
  'Pracownik',
  'Operator',
  'Technik',
  'Analityk',
  'Manager',
]

export const DIMENSION_HOURS: Record<WorkDimension, number> = {
  '1': 8,
  '7/8': 7,
  '3/4': 6,
  '5/8': 5,
  '1/2': 4,
  '3/8': 3,
  '1/4': 2,
  '1/8': 1,
}

export const DIMENSION_LABEL: Record<WorkDimension, string> = {
  '1': '= 8h dziennie',
  '7/8': '= 7h dziennie',
  '3/4': '= 6h dziennie',
  '5/8': '= 5h dziennie',
  '1/2': '= 4h dziennie',
  '3/8': '= 3h dziennie',
  '1/4': '= 2h dziennie',
  '1/8': '= 1h dziennie',
}
