import { NextRequest, NextResponse } from 'next/server'

interface SuccessResponse<T> {
  data: T
  isError: false
  error: null
}

const getApiBaseUrl = (): string =>
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'

function buildForwardHeaders(request: NextRequest): HeadersInit {
  const authorization = request.headers.get('authorization')
  return authorization ? { Authorization: authorization } : {}
}

async function unwrapBackendResponse<T>(response: Response): Promise<T> {
  const payload = (await response.json()) as SuccessResponse<T> | { message?: string }

  if (!response.ok) {
    const message =
      'message' in payload && payload.message
        ? payload.message
        : 'Backend request failed'
    return Promise.reject(new Error(message))
  }

  if ('data' in payload) {
    return payload.data
  }

  return payload as T
}

export async function POST(request: NextRequest) {
  try {
    const response = await fetch(`${getApiBaseUrl()}/holidays/sync`, {
      method: 'POST',
      headers: buildForwardHeaders(request),
      cache: 'no-store',
    })

    const data = await unwrapBackendResponse<unknown>(response)
    return NextResponse.json(data)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to sync holidays'
    return NextResponse.json({ message }, { status: 500 })
  }
}
