export { ApiError, apiDelete, apiGet, apiPatch, apiPost, apiPut } from '@/lib/api/client'

export type { LoginInput, LoginResult } from '@/lib/api/auth'
export { hasAuthSession, login, logout } from '@/lib/api/auth'

export {
  createEmployee,
  deleteDayRecord,
  deleteEmployee,
  fetchEmployeeById,
  fetchEmployeeUnexcusedAbsences,
  fetchEmployees,
  updateEmployee,
  upsertDayRecord,
} from '@/lib/api/employees'

export { fetchCompanies } from '@/lib/api/companies'

export { fetchPositionSuggestions } from '@/lib/api/positions'
