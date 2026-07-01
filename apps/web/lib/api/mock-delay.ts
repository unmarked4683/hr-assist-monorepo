export const MOCK_API_DELAY_MS = 450

export const mockApiDelay = (): Promise<void> =>
  new Promise((resolve) => {
    window.setTimeout(resolve, MOCK_API_DELAY_MS)
  })
