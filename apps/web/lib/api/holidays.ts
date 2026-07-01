import type { DayOff, HolidaySyncResult } from '@hr-assist/shared'

const AUTH_TOKEN_KEY = 'hr-auth-token'

const buildAuthHeaders = (): HeadersInit => {
  if (typeof window === 'undefined') return {}

  const token =
    localStorage.getItem(AUTH_TOKEN_KEY) ?? sessionStorage.getItem(AUTH_TOKEN_KEY)

  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function parseJsonResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as
      | { message?: string }
      | null
    throw new Error(payload?.message ?? response.statusText)
  }

  return response.json() as Promise<T>
}

export async function fetchHolidays(): Promise<DayOff[]> {
  const response = await fetch('/api/holidays', {
    method: 'GET',
    headers: buildAuthHeaders(),
  })

  return parseJsonResponse<DayOff[]>(response)
}

export async function syncHolidays(): Promise<HolidaySyncResult> {
  const response = await fetch('/api/holidays/sync', {
    method: 'POST',
    headers: buildAuthHeaders(),
  })

  return parseJsonResponse<HolidaySyncResult>(response)
}
