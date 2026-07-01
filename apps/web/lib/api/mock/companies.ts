import type { Company } from '@hr-assist/shared'

const companies: Company[] = [
  { id: 'prod', name: 'Spółka Produkcja' },
  { id: 'service', name: 'Spółka Serwis' },
  { id: 'brand', name: 'Spółka Marka Własna' },
]

export const mockFetchCompanies = async (): Promise<Company[]> =>
  companies.map((company) => ({ ...company }))
