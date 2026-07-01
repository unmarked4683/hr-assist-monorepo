import { mockApiDelay } from '@/lib/api/mock/delay'
import { mockFetchPositionSuggestions } from '@/lib/api/mock/positions'

export const fetchPositionSuggestions = async (): Promise<string[]> => {
  await mockApiDelay()
  // const response = await apiGet<ResponseWrapper<string[]>>('/positions/suggestions')
  // return unwrapResponse(response)
  return mockFetchPositionSuggestions()
}
