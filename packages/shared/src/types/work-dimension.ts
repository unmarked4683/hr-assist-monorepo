export const WORK_DIMENSION = {
  FULL: { fraction: '1' },
  SEVEN_EIGHTHS: { fraction: '7/8' },
  THREE_QUARTERS: { fraction: '3/4' },
  FIVE_EIGHTHS: { fraction: '5/8' },
  HALF: { fraction: '1/2' },
  THREE_EIGHTHS: { fraction: '3/8' },
  QUARTER: { fraction: '1/4' },
  ONE_EIGHTH: { fraction: '1/8' },
} as const

export type WorkDimension = (typeof WORK_DIMENSION)[keyof typeof WORK_DIMENSION]['fraction']

export const WORK_DIMENSIONS: readonly WorkDimension[] = Object.values(WORK_DIMENSION).map(
  (entry) => entry.fraction,
)
