'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import {
  createEmployee,
  deleteDayRecord as deleteDayRecordRequest,
  deleteEmployee as deleteEmployeeRequest,
  fetchCompanies,
  fetchEmployees,
  hasAuthSession,
  login as loginRequest,
  logout as logoutRequest,
  updateEmployee,
  upsertDayRecord,
} from '@/lib/api'
import type { Company, DayStatus, Employee, EmployeeInput, IsoDate } from '@hr-assist/shared'
import type { Theme } from '@/lib/types/theme'
import { Toast, type ToastState } from '@/components/hr/shared/Toast'
import { mergeEmployeesPreservingReferences } from '@/lib/utils/employee-merge'

interface EmployeesContextValue {
  employees: Employee[]
  isEmployeesReady: boolean
  companies: Company[]
  getCompanyName: (companyId: string) => string
  refreshEmployees: () => Promise<void>
  getEmployee: (id: string) => Employee | null
}

interface AppContextValue {
  isLoggedIn: boolean
  loginError: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>

  theme: Theme
  setTheme: (theme: Theme) => void

  isEmployeeFormOpen: boolean
  editingEmployee: Employee | null
  openCreateEmployeeForm: () => void
  openEditEmployeeForm: (employee: Employee) => void
  closeEmployeeForm: () => void
  saveEmployee: (input: EmployeeInput, id?: string) => Promise<void>
  deleteEmployee: (id: string) => Promise<void>
  dismissToast: () => void
  pendingToast: string | null
  consumePendingToast: () => void

  isDayStatusModalOpen: boolean
  editingDate: IsoDate | null
  openDayStatusModal: (date: IsoDate) => void
  closeDayStatusModal: () => void
  saveDayRecord: (employeeId: string, date: IsoDate, status: DayStatus) => Promise<void>
  removeDayRecord: (employeeId: string, date: IsoDate) => Promise<void>

  isReportModalOpen: boolean
  openReportModal: () => void
  closeReportModal: () => void
}

const AppCtx = createContext<AppContextValue | null>(null)
const EmployeesCtx = createContext<EmployeesContextValue | null>(null)

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loginError, setLoginError] = useState(false)
  const [theme, setThemeState] = useState<Theme>('system')
  const [employees, setEmployees] = useState<Employee[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [isEmployeesReady, setIsEmployeesReady] = useState(false)
  const [isEmployeeFormOpen, setIsEmployeeFormOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const [isDayStatusModalOpen, setIsDayStatusModalOpen] = useState(false)
  const [editingDate, setEditingDate] = useState<IsoDate | null>(null)
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const [toast, setToast] = useState<ToastState | null>(null)
  const [pendingToast, setPendingToast] = useState<string | null>(null)
  const toastIdRef = useRef(0)
  const isLoggedInRef = useRef(isLoggedIn)
  isLoggedInRef.current = isLoggedIn

  const setTheme = useCallback((nextTheme: Theme) => {
    setThemeState(nextTheme)
    const { documentElement: html } = document
    html.classList.remove('light', 'dark')
    if (nextTheme === 'light') html.classList.add('light')
    else if (nextTheme === 'dark') html.classList.add('dark')
  }, [])

  const refreshEmployees = useCallback(async () => {
    try {
      const [employeeData, companyData] = await Promise.all([fetchEmployees(), fetchCompanies()])
      if (!isLoggedInRef.current) return
      setEmployees((previous) => mergeEmployeesPreservingReferences(previous, employeeData))
      setCompanies(companyData)
    } catch {
      if (!isLoggedInRef.current) return
      setEmployees([])
      setCompanies([])
    } finally {
      if (isLoggedInRef.current) setIsEmployeesReady(true)
    }
  }, [])

  const getCompanyName = useCallback(
    (companyId: string): string =>
      companies.find((company) => company.id === companyId)?.name ?? '—',
    [companies],
  )

  useEffect(() => {
    if (!isLoggedIn) return
    void refreshEmployees()
  }, [isLoggedIn, refreshEmployees])

  useEffect(() => {
    if (hasAuthSession()) setIsLoggedIn(true)
  }, [])

  useEffect(() => {
    const stored = localStorage.getItem('hr-theme') as Theme | null
    if (stored) setTheme(stored)
  }, [setTheme])

  useEffect(() => {
    localStorage.setItem('hr-theme', theme)
  }, [theme])

  const login = useCallback(async (email: string, password: string) => {
    const { success } = await loginRequest({ email, password })
    if (success) {
      setIsLoggedIn(true)
      setLoginError(false)
      return
    }

    setLoginError(true)
    window.setTimeout(() => setLoginError(false), 4000)
  }, [])

  const getEmployee = useCallback(
    (id: string): Employee | null => employees.find((employee) => employee.id === id) ?? null,
    [employees],
  )

  const openCreateEmployeeForm = useCallback(() => {
    setEditingEmployee(null)
    setIsEmployeeFormOpen(true)
  }, [])

  const openEditEmployeeForm = useCallback((employee: Employee) => {
    setEditingEmployee(employee)
    setIsEmployeeFormOpen(true)
  }, [])

  const closeEmployeeForm = useCallback(() => {
    setIsEmployeeFormOpen(false)
    setEditingEmployee(null)
  }, [])

  const dismissToast = useCallback(() => setToast(null), [])

  const showSuccessToast = useCallback((message: string) => {
    toastIdRef.current += 1
    setToast({ id: toastIdRef.current, message, variant: 'success' })
  }, [])

  const consumePendingToast = useCallback(() => {
    setPendingToast((message) => {
      if (message) showSuccessToast(message)
      return null
    })
  }, [showSuccessToast])

  const saveEmployee = useCallback(
    async (input: EmployeeInput, id?: string) => {
      if (id) {
        await updateEmployee(id, input)
        showSuccessToast('Zaktualizowano dane pracownika')
      } else {
        await createEmployee(input)
        showSuccessToast('Dodano pracownika')
      }
      await refreshEmployees()
      closeEmployeeForm()
    },
    [closeEmployeeForm, refreshEmployees, showSuccessToast],
  )

  const deleteEmployee = useCallback(
    async (id: string) => {
      await deleteEmployeeRequest(id)
      await refreshEmployees()
      closeEmployeeForm()
      setPendingToast('Usunięto pracownika')
    },
    [closeEmployeeForm, refreshEmployees],
  )

  const openDayStatusModal = useCallback((date: IsoDate) => {
    setEditingDate(date)
    setIsDayStatusModalOpen(true)
  }, [])

  const closeDayStatusModal = useCallback(() => {
    setIsDayStatusModalOpen(false)
    setEditingDate(null)
  }, [])

  const saveDayRecord = useCallback(
    async (employeeId: string, date: IsoDate, status: DayStatus) => {
      await upsertDayRecord(employeeId, date, status)
      await refreshEmployees()
      closeDayStatusModal()
      showSuccessToast('Zaktualizowano frekwencję')
    },
    [closeDayStatusModal, refreshEmployees, showSuccessToast],
  )

  const removeDayRecord = useCallback(
    async (employeeId: string, date: IsoDate) => {
      await deleteDayRecordRequest(employeeId, date)
      await refreshEmployees()
      closeDayStatusModal()
      showSuccessToast('Usunięto frekwencję')
    },
    [closeDayStatusModal, refreshEmployees, showSuccessToast],
  )

  const openReportModal = useCallback(() => setIsReportModalOpen(true), [])
  const closeReportModal = useCallback(() => setIsReportModalOpen(false), [])

  const logout = useCallback(async () => {
    await logoutRequest()
    setIsLoggedIn(false)
    setEmployees([])
    setCompanies([])
    setIsEmployeesReady(false)
    setIsEmployeeFormOpen(false)
    setEditingEmployee(null)
    setIsDayStatusModalOpen(false)
    setEditingDate(null)
    setIsReportModalOpen(false)
    setToast(null)
    setPendingToast(null)
  }, [])

  const employeesValue = useMemo<EmployeesContextValue>(
    () => ({
      employees,
      isEmployeesReady,
      companies,
      getCompanyName,
      refreshEmployees,
      getEmployee,
    }),
    [companies, employees, getCompanyName, getEmployee, isEmployeesReady, refreshEmployees],
  )

  const value = useMemo<AppContextValue>(
    () => ({
      isLoggedIn,
      loginError,
      login,
      logout,
      theme,
      setTheme,
      isEmployeeFormOpen,
      editingEmployee,
      openCreateEmployeeForm,
      openEditEmployeeForm,
      closeEmployeeForm,
      saveEmployee,
      deleteEmployee,
      dismissToast,
      pendingToast,
      consumePendingToast,
      isDayStatusModalOpen,
      editingDate,
      openDayStatusModal,
      closeDayStatusModal,
      saveDayRecord,
      removeDayRecord,
      isReportModalOpen,
      openReportModal,
      closeReportModal,
    }),
    [
      closeDayStatusModal,
      closeEmployeeForm,
      closeReportModal,
      editingDate,
      editingEmployee,
      isDayStatusModalOpen,
      isEmployeeFormOpen,
      isLoggedIn,
      isReportModalOpen,
      login,
      loginError,
      logout,
      openCreateEmployeeForm,
      openDayStatusModal,
      openEditEmployeeForm,
      openReportModal,
      saveDayRecord,
      removeDayRecord,
      saveEmployee,
      deleteEmployee,
      dismissToast,
      consumePendingToast,
      pendingToast,
      setTheme,
      theme,
    ],
  )

  return (
    <EmployeesCtx.Provider value={employeesValue}>
      <AppCtx.Provider value={value}>
        {children}
        <Toast toast={toast} onDismiss={dismissToast} />
      </AppCtx.Provider>
    </EmployeesCtx.Provider>
  )
}

export const useEmployees = (): EmployeesContextValue => {
  const context = useContext(EmployeesCtx)
  if (!context) throw new Error('useEmployees must be used within AppProvider')
  return context
}

export const useApp = (): AppContextValue => {
  const context = useContext(AppCtx)
  if (!context) throw new Error('useApp must be used within AppProvider')
  return context
}
