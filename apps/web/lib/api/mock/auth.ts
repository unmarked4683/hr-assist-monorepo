const AUTH_TOKEN_KEY = 'hr-auth-token'

export interface LoginInput {
  email: string
  password: string
}

export interface LoginResult {
  success: boolean
}

const persistAuthSession = (): void => {
  localStorage.setItem(AUTH_TOKEN_KEY, 'mock-session')
  sessionStorage.setItem(AUTH_TOKEN_KEY, 'mock-session')
}

export const mockLogin = async ({ email, password }: LoginInput): Promise<LoginResult> => {
  const success = Boolean(email) && password.length >= 4
  if (success) persistAuthSession()
  return { success }
}

export const mockLogout = async (): Promise<void> => {
  localStorage.removeItem(AUTH_TOKEN_KEY)
  sessionStorage.removeItem(AUTH_TOKEN_KEY)
  document.cookie = `${AUTH_TOKEN_KEY}=; Max-Age=0; path=/; SameSite=Lax`
}

export const hasAuthSession = (): boolean =>
  Boolean(localStorage.getItem(AUTH_TOKEN_KEY) ?? sessionStorage.getItem(AUTH_TOKEN_KEY))
