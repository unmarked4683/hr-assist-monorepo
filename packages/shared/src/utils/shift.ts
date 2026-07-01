export const parseHour = (time: string): number => parseInt(time.split(':')[0], 10)

export const formatHour = (hour: number): string => {
  const normalised = ((hour % 24) + 24) % 24
  return `${String(normalised).padStart(2, '0')}:00`
}

export const shiftHour = (time: string, delta: number): string =>
  formatHour(parseHour(time) + delta)

export const shiftTimeByMinutes = (time: string, deltaMinutes: number): string => {
  const [hourPart, minutePart = '0'] = time.split(':')
  const totalMinutes =
    parseInt(hourPart, 10) * 60 + parseInt(minutePart, 10) + deltaMinutes
  const normalised = ((totalMinutes % (24 * 60)) + 24 * 60) % (24 * 60)
  const hours = Math.floor(normalised / 60)
  const minutes = normalised % 60
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

export const isOvernight = (startHour: string, endHour: string): boolean =>
  parseHour(endHour) <= parseHour(startHour)

export const calcShiftHours = (startHour: string, endHour: string): number => {
  const start = parseHour(startHour)
  const end = parseHour(endHour)
  return end <= start ? 24 - start + end : end - start
}
