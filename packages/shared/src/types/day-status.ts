export enum DayStatus {
  PRESENT = 'Obecność',
  UNEXCUSED_ABSENCE = 'Nieobecność nieusprawiedliwiona',
  ANNUAL_LEAVE = 'Urlop wypoczynkowy',
  ON_DEMAND_LEAVE = 'Urlop na żądanie',
  MATERNITY_LEAVE = 'Urlop macierzyński',
  PARENTAL_LEAVE = 'Urlop wychowawczy',
  UNPAID_LEAVE = 'Urlop bezpłatny',
  ILLNESS = 'Choroba',
  CARE = 'Opieka',
  PAID_RELEASE = 'Zwolnienie płatne',
  UNPAID_RELEASE = 'Zwolnienie niepłatne',
  MILITARY_SERVICE = 'Służba wojskowa',
}

export const DAY_STATUS_OPTIONS: readonly DayStatus[] = Object.values(DayStatus)

export const getDayStatusLabel = (status: DayStatus): string => status
