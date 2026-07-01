import type { LoginInput, LoginResult } from '@/lib/api/mock/auth'
import { mockLogin, mockLogout } from '@/lib/api/mock/auth'
import { mockApiDelay } from '@/lib/api/mock/delay'

export type { LoginInput, LoginResult } from '@/lib/api/mock/auth'
export { hasAuthSession } from '@/lib/api/mock/auth'

export const login = async (input: LoginInput): Promise<LoginResult> => {
  await mockApiDelay()
  // const response = await apiPost<ResponseWrapper<{ accessToken: string }>>('/auth/login', input)
  // const { accessToken } = unwrapResponse(response)
  // persistAuthSession(accessToken)
  // return { success: true }
  return mockLogin(input)
}

export const logout = async (): Promise<void> => {
  await mockApiDelay()
  // await apiPost('/auth/logout', {})
  return mockLogout()
}
