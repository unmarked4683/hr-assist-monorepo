export interface LoginInput {
  email: string
  password: string
}

export interface LoginResult {
  success: boolean
}

export const login = async ({ email, password }: LoginInput): Promise<LoginResult> => ({
  success: Boolean(email) && password.length >= 4,
})

export const logout = async (): Promise<void> => {
  // Placeholder for future API session invalidation.
}
