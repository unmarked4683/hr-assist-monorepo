export const parsePeselBirthdate = (pesel: string): string => {
  if (pesel.length < 6) return '—'

  const yearPart = parseInt(pesel.slice(0, 2), 10)
  let month = parseInt(pesel.slice(2, 4), 10)
  const day = parseInt(pesel.slice(4, 6), 10)

  let year: number
  if (month >= 1 && month <= 12) {
    year = 1900 + yearPart
  } else if (month >= 21 && month <= 32) {
    month -= 20
    year = 2000 + yearPart
  } else if (month >= 41 && month <= 52) {
    month -= 40
    year = 2100 + yearPart
  } else if (month >= 61 && month <= 72) {
    month -= 60
    year = 2200 + yearPart
  } else if (month >= 81 && month <= 92) {
    month -= 80
    year = 1800 + yearPart
  } else {
    return 'Nieprawidłowy PESEL'
  }

  if (month < 1 || month > 12 || day < 1 || day > 31) return 'Nieprawidłowy PESEL'
  return `${String(day).padStart(2, '0')}.${String(month).padStart(2, '0')}.${year}`
}
