import type { WorkDimension } from '../types/work-dimension'
import { WORK_DIMENSION } from '../types/work-dimension'

const FULL_DAY_MINUTES = 8 * 60

export const parseWorkDimensionFraction = (fraction: string): number => {
  if (fraction.includes('/')) {
    const [numerator, denominator] = fraction.split('/').map(Number)
    if (!denominator || Number.isNaN(numerator) || Number.isNaN(denominator)) return 1
    return numerator / denominator
  }

  const whole = Number(fraction)
  return Number.isNaN(whole) ? 1 : whole
}

export const getWorkDimensionMinutes = (fraction: string): number =>
  Math.round(parseWorkDimensionFraction(fraction) * FULL_DAY_MINUTES)

export const formatWorkDuration = (totalMinutes: number): string => {
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  if (minutes === 0) return `${hours}h`
  return `${hours}h ${minutes}min`
}

export const getWorkDimensionLabel = (fraction: string): string =>
  `= ${formatWorkDuration(getWorkDimensionMinutes(fraction))} dziennie`

export const getWorkDimensionHours = (fraction: string): number =>
  getWorkDimensionMinutes(fraction) / 60

export const isFullWorkDimension = (dimension: WorkDimension): boolean =>
  dimension === WORK_DIMENSION.FULL.fraction
