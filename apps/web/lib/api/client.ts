export class ApiError extends Error {
  readonly statusCode: number

  constructor(message: string, statusCode: number) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
  }
}

const AUTH_TOKEN_KEY = 'hr-auth-token'

const getBaseUrl = (): string => process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'

const buildAuthHeaders = (): HeadersInit => {
  if (typeof window === 'undefined') return {}

  const token =
    localStorage.getItem(AUTH_TOKEN_KEY) ?? sessionStorage.getItem(AUTH_TOKEN_KEY)

  return token ? { Authorization: `Bearer ${token}` } : {}
}

const buildHeaders = (body?: unknown): HeadersInit => ({
  ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
  ...buildAuthHeaders(),
})

async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as
      | { message?: string }
      | null
    throw new ApiError(payload?.message ?? response.statusText, response.status)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}

export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${getBaseUrl()}${path}`, {
    method: 'GET',
    headers: buildHeaders(),
  })

  return parseResponse<T>(response)
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${getBaseUrl()}${path}`, {
    method: 'POST',
    headers: buildHeaders(body),
    body: JSON.stringify(body),
  })

  return parseResponse<T>(response)
}

export async function apiPut<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${getBaseUrl()}${path}`, {
    method: 'PUT',
    headers: buildHeaders(body),
    body: JSON.stringify(body),
  })

  return parseResponse<T>(response)
}

export async function apiPatch<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${getBaseUrl()}${path}`, {
    method: 'PATCH',
    headers: buildHeaders(body),
    body: JSON.stringify(body),
  })

  return parseResponse<T>(response)
}

export async function apiDelete<T = void>(path: string): Promise<T> {
  const response = await fetch(`${getBaseUrl()}${path}`, {
    method: 'DELETE',
    headers: buildHeaders(),
  })

  return parseResponse<T>(response)
}
