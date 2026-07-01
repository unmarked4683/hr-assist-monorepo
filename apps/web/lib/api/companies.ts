import type { Company } from '@hr-assist/shared'
import { mockApiDelay } from '@/lib/api/mock/delay'
import { mockFetchCompanies } from '@/lib/api/mock/companies'

export const fetchCompanies = async (): Promise<Company[]> => {
  await mockApiDelay()
  // const response = await apiGet<ResponseWrapper<Company[]>>('/companies')
  // return unwrapResponse(response)
  return mockFetchCompanies()
}
