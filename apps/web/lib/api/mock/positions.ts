const basePositionSuggestions = [
  'Analityk',
  'Brygadzista',
  'Kierownik',
  'Manager',
  'Operator',
  'Pracownik',
  'Specjalista',
  'Technik',
] as const

export const mockFetchPositionSuggestions = async (): Promise<string[]> =>
  [...basePositionSuggestions, 'Koordynator'].sort((a, b) => a.localeCompare(b, 'pl'))
