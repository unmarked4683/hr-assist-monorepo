// ─────────────────────────────────────────────────────────────────────────────
// HR Assist — Isolated data layer
// All mutations go through these functions — swap internals for async fetch/axios
// when connecting a real backend.
// ─────────────────────────────────────────────────────────────────────────────

export enum ContractType {
  EmploymentContract = 'employment_contract',
}

export const CONTRACT_TYPE_LABELS: Record<ContractType, string> = {
  [ContractType.EmploymentContract]: 'Umowa o pracę',
}

export type WorkDimension = '1' | '7/8' | '3/4' | '5/8' | '1/2' | '3/8' | '1/4' | '1/8'
export type Location = 'Biuro' | 'Hala'
export type Company = 'Spółka Produkcja' | 'Spółka Serwis' | 'Spółka Marka Własna'

export enum DayStatusCategory {
  Present = 'present',
  Unexcused = 'unexcused',
  Excused = 'excused',
}

export enum DayStatus {
  Present = 'present',
  UnexcusedAbsence = 'unexcused_absence',
  ExcusedPaidAbsence = 'excused_paid_absence',
  ExcusedUnpaidAbsence = 'excused_unpaid_absence',
  UnpaidLeave = 'unpaid_leave',
  AnnualLeave = 'annual_leave',
  OnDemandLeave = 'on_demand_leave',
  OccasionalLeave = 'occasional_leave',
  MaternityLeave = 'maternity_leave',
  ParentalLeave = 'parental_leave',
  PaternityLeave = 'paternity_leave',
  ChildcareLeave = 'childcare_leave',
  CareLeave = 'care_leave',
  SickLeave = 'sick_leave',
  RehabilitationBenefit = 'rehabilitation_benefit',
  HolidayCompDay = 'holiday_comp_day',
}

export const DAY_STATUS_LABELS: Record<DayStatus, string> = {
  [DayStatus.Present]: 'Obecność',
  [DayStatus.UnexcusedAbsence]: 'Nieobecność nieusprawiedliwiona',
  [DayStatus.ExcusedPaidAbsence]: 'Nieobecność usprawiedliwiona płatna',
  [DayStatus.ExcusedUnpaidAbsence]: 'Nieobecność usprawiedliwiona niepłatna',
  [DayStatus.UnpaidLeave]: 'Urlop bezpłatny',
  [DayStatus.AnnualLeave]: 'Urlop wypoczynkowy',
  [DayStatus.OnDemandLeave]: 'Urlop na żądanie',
  [DayStatus.OccasionalLeave]: 'Urlop okolicznościowy',
  [DayStatus.MaternityLeave]: 'Urlop macierzyński',
  [DayStatus.ParentalLeave]: 'Urlop rodzicielski',
  [DayStatus.PaternityLeave]: 'Urlop ojcowski',
  [DayStatus.ChildcareLeave]: 'Urlop wychowawczy',
  [DayStatus.CareLeave]: 'Opieka',
  [DayStatus.SickLeave]: 'Chorobowe',
  [DayStatus.RehabilitationBenefit]: 'Świadczenie rehabilitacyjne',
  [DayStatus.HolidayCompDay]: 'Dzień wolny za święto',
}

export const DAY_STATUS_TO_CATEGORY: Record<DayStatus, DayStatusCategory> = {
  [DayStatus.Present]: DayStatusCategory.Present,
  [DayStatus.UnexcusedAbsence]: DayStatusCategory.Unexcused,
  [DayStatus.ExcusedPaidAbsence]: DayStatusCategory.Excused,
  [DayStatus.ExcusedUnpaidAbsence]: DayStatusCategory.Excused,
  [DayStatus.UnpaidLeave]: DayStatusCategory.Excused,
  [DayStatus.AnnualLeave]: DayStatusCategory.Excused,
  [DayStatus.OnDemandLeave]: DayStatusCategory.Excused,
  [DayStatus.OccasionalLeave]: DayStatusCategory.Excused,
  [DayStatus.MaternityLeave]: DayStatusCategory.Excused,
  [DayStatus.ParentalLeave]: DayStatusCategory.Excused,
  [DayStatus.PaternityLeave]: DayStatusCategory.Excused,
  [DayStatus.ChildcareLeave]: DayStatusCategory.Excused,
  [DayStatus.CareLeave]: DayStatusCategory.Excused,
  [DayStatus.SickLeave]: DayStatusCategory.Excused,
  [DayStatus.RehabilitationBenefit]: DayStatusCategory.Excused,
  [DayStatus.HolidayCompDay]: DayStatusCategory.Excused,
}

export const DAY_STATUS_GROUP_LABELS = {
  present: 'Obecność',
  unexcused: 'Nieusprawiedliwiona',
  excusedAbsences: 'Nieobecności usprawiedliwione',
  leave: 'Urlopy',
  other: 'Inne',
} as const

export type DayStatusGroupKey = keyof typeof DAY_STATUS_GROUP_LABELS

export const DAY_STATUS_GROUPS: { groupKey: DayStatusGroupKey; statuses: DayStatus[] }[] = [
  { groupKey: 'present', statuses: [DayStatus.Present] },
  { groupKey: 'unexcused', statuses: [DayStatus.UnexcusedAbsence] },
  {
    groupKey: 'excusedAbsences',
    statuses: [DayStatus.ExcusedPaidAbsence, DayStatus.ExcusedUnpaidAbsence],
  },
  {
    groupKey: 'leave',
    statuses: [
      DayStatus.UnpaidLeave,
      DayStatus.AnnualLeave,
      DayStatus.OnDemandLeave,
      DayStatus.OccasionalLeave,
      DayStatus.MaternityLeave,
      DayStatus.ParentalLeave,
      DayStatus.PaternityLeave,
      DayStatus.ChildcareLeave,
    ],
  },
  {
    groupKey: 'other',
    statuses: [
      DayStatus.CareLeave,
      DayStatus.SickLeave,
      DayStatus.RehabilitationBenefit,
      DayStatus.HolidayCompDay,
    ],
  },
]

export function getDayStatusCategory(status: DayStatus): DayStatusCategory {
  return DAY_STATUS_TO_CATEGORY[status]
}

export function getDayStatusLabel(status: DayStatus): string {
  return DAY_STATUS_LABELS[status]
}

export function isPresent(status: DayStatus | null | undefined): boolean {
  return status == null || status === DayStatus.Present
}

export function isUnexcused(status: DayStatus): boolean {
  return getDayStatusCategory(status) === DayStatusCategory.Unexcused
}

export function isExcused(status: DayStatus): boolean {
  return getDayStatusCategory(status) === DayStatusCategory.Excused
}

export interface DayRecord {
  date: string // ISO 'YYYY-MM-DD'
  status: DayStatus | null
}

export interface Employee {
  id: string
  firstName: string
  lastName: string
  pesel: string
  contractType: ContractType
  workDimension: WorkDimension
  startHour: string  // e.g. '08:00'
  endHour: string    // e.g. '16:00'
  location: Location
  position: string
  company: Company
  dayRecords: DayRecord[]
}

export function employeeHasUnexcusedAbsence(employee: Employee): boolean {
  return employee.dayRecords.some(
    (record) => record.status != null && isUnexcused(record.status),
  )
}

// ── Work dimension → daily hours map ─────────────────────────────────────────
// Base = 8h (1 etat). Each fraction × 8, minimum 1h (1/8 etat).
export const DIMENSION_HOURS: Record<WorkDimension, number> = {
  '1':   8,
  '7/8': 7,
  '3/4': 6,
  '5/8': 5,
  '1/2': 4,
  '3/8': 3,
  '1/4': 2,
  '1/8': 1,
}

export const DIMENSION_LABEL: Record<WorkDimension, string> = {
  '1':   '= 8h dziennie',
  '7/8': '= 7h dziennie',
  '3/4': '= 6h dziennie',
  '5/8': '= 5h dziennie',
  '1/2': '= 4h dziennie',
  '3/8': '= 3h dziennie',
  '1/4': '= 2h dziennie',
  '1/8': '= 1h dziennie',
}

// ── Mock data ─────────────────────────────────────────────────────────────────
let _employees: Employee[] = [
  {
    id: '1',
    firstName: 'Andrzej',
    lastName: 'Kowalski',
    pesel: '85042312345',
    contractType: ContractType.EmploymentContract,
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
    contractType: ContractType.EmploymentContract,
    workDimension: '1/2',
    startHour: '08:00',
    endHour: '12:00',
    location: 'Biuro',
    position: 'Specjalista',
    company: 'Spółka Serwis',
    dayRecords: [
      { date: '2026-06-02', status: DayStatus.UnexcusedAbsence },
    ],
  },
]

// ── CRUD helpers ──────────────────────────────────────────────────────────────

export function getEmployees(): Employee[] {
  return _employees
}

export function getEmployeeById(id: string): Employee | undefined {
  return _employees.find((e) => e.id === id)
}

export function createEmployee(data: Omit<Employee, 'id' | 'dayRecords'>): Employee {
  const newEmployee: Employee = {
    ...data,
    id: String(Date.now()),
    dayRecords: [],
  }
  _employees = [..._employees, newEmployee]
  return newEmployee
}

export function updateEmployeeData(id: string, data: Partial<Omit<Employee, 'id' | 'dayRecords'>>): Employee | null {
  const idx = _employees.findIndex((e) => e.id === id)
  if (idx === -1) return null
  _employees = _employees.map((e) => (e.id === id ? { ...e, ...data } : e))
  return _employees[idx]
}

export function upsertDayRecord(employeeId: string, date: string, status: DayStatus): void {
  _employees = _employees.map((e) => {
    if (e.id !== employeeId) return e
    const existing = e.dayRecords.find((d) => d.date === date)
    if (existing) {
      return {
        ...e,
        dayRecords: e.dayRecords.map((d) => (d.date === date ? { ...d, status } : d)),
      }
    }
    return { ...e, dayRecords: [...e.dayRecords, { date, status }] }
  })
}

// ── Utility: parse PESEL → birthdate string ───────────────────────────────────
export function parsePeselBirthdate(pesel: string): string {
  if (pesel.length < 6) return '—'
  const y2 = parseInt(pesel.slice(0, 2), 10)
  let month = parseInt(pesel.slice(2, 4), 10)
  const day = parseInt(pesel.slice(4, 6), 10)

  let year: number
  if (month >= 1 && month <= 12) {
    year = 1900 + y2
  } else if (month >= 21 && month <= 32) {
    month -= 20
    year = 2000 + y2
  } else if (month >= 41 && month <= 52) {
    month -= 40
    year = 2100 + y2
  } else if (month >= 61 && month <= 72) {
    month -= 60
    year = 2200 + y2
  } else if (month >= 81 && month <= 92) {
    month -= 80
    year = 1800 + y2
  } else {
    return 'Nieprawidłowy PESEL'
  }
  if (month < 1 || month > 12 || day < 1 || day > 31) return 'Nieprawidłowy PESEL'
  return `${String(day).padStart(2, '0')}.${String(month).padStart(2, '0')}.${year}`
}

// ── Shift duration — overnight-safe ──────────────────────────────────────────
// Formula: if End <= Start, the end falls on the next calendar day.
//   Duration = (24 - Start) + End
// Example: 20:00 → 01:00  =  (24 - 20) + 1  =  5h  ✓
//          08:00 → 16:00  =  16 - 8          =  8h  ✓
export function calcShiftHours(startHour: string, endHour: string): number {
  const s = parseInt(startHour.split(':')[0], 10)
  const e = parseInt(endHour.split(':')[0], 10)
  return e <= s ? (24 - s) + e : e - s
}

// ── Polish locale helpers ─────────────────────────────────────────────────────
export const MONTH_NAMES_NOM = [
  'Styczeń','Luty','Marzec','Kwiecień','Maj','Czerwiec',
  'Lipiec','Sierpień','Wrzesień','Październik','Listopad','Grudzień',
]

export const MONTH_NAMES_GEN = [
  'stycznia','lutego','marca','kwietnia','maja','czerwca',
  'lipca','sierpnia','września','października','listopada','grudnia',
]

export const DAY_ABBR = ['nd.','pon.','wt.','śr.','czw.','pt.','sob.']

export function formatPolishDate(day: number, month: number, year: number): string {
  return `${day} ${MONTH_NAMES_GEN[month - 1]} ${year}`
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate()
}

export function getDayOfWeek(year: number, month: number, day: number): string {
  return DAY_ABBR[new Date(year, month - 1, day).getDay()]
}

export function isWeekend(year: number, month: number, day: number): boolean {
  const dow = new Date(year, month - 1, day).getDay()
  return dow === 0 || dow === 6
}
