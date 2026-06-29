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
import { login as loginRequest, logout as logoutRequest, hasAuthSession } from '@/lib/api/auth'
import {
  createEmployee,
  fetchEmployees,
  updateEmployee,
  upsertDayRecord,
} from '@/lib/api/employees'
import type { DayStatus, Employee, EmployeeInput, IsoDate, Theme } from '@/lib/types'

interface AppContextValue {
  isLoggedIn: boolean
  loginError: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>

  theme: Theme
  setTheme: (theme: Theme) => void

  employees: Employee[]
  isEmployeesReady: boolean
  refreshEmployees: () => Promise<void>
  getEmployee: (id: string) => Employee | null

  isEmployeeFormOpen: boolean
  editingEmployee: Employee | null
  openCreateEmployeeForm: () => void
  openEditEmployeeForm: (employee: Employee) => void
  closeEmployeeForm: () => void
  saveEmployee: (input: EmployeeInput, id?: string) => Promise<void>

  isDayStatusModalOpen: boolean
  editingDate: IsoDate | null
  openDayStatusModal: (date: IsoDate) => void
  closeDayStatusModal: () => void
  saveDayRecord: (employeeId: string, date: IsoDate, status: DayStatus) => Promise<void>

  isReportModalOpen: boolean
  openReportModal: () => void
  closeReportModal: () => void
}

const AppCtx = createContext<AppContextValue | null>(null)

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loginError, setLoginError] = useState(false)
  const [theme, setThemeState] = useState<Theme>('system')
  const [employees, setEmployees] = useState<Employee[]>([])
  const [isEmployeesReady, setIsEmployeesReady] = useState(false)
  const [isEmployeeFormOpen, setIsEmployeeFormOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const [isDayStatusModalOpen, setIsDayStatusModalOpen] = useState(false)
  const [editingDate, setEditingDate] = useState<IsoDate | null>(null)
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
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
    setIsEmployeesReady(false)
    try {
      const data = await fetchEmployees()
      if (!isLoggedInRef.current) return
      setEmployees(data)
    } catch {
      if (!isLoggedInRef.current) return
      setEmployees([])
    } finally {
      if (isLoggedInRef.current) setIsEmployeesReady(true)
    }
  }, [])

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

  const saveEmployee = useCallback(
    async (input: EmployeeInput, id?: string) => {
      if (id) await updateEmployee(id, input)
      else await createEmployee(input)
      await refreshEmployees()
      closeEmployeeForm()
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
    },
    [closeDayStatusModal, refreshEmployees],
  )

  const openReportModal = useCallback(() => setIsReportModalOpen(true), [])
  const closeReportModal = useCallback(() => setIsReportModalOpen(false), [])

  const logout = useCallback(async () => {
    await logoutRequest()
    setIsLoggedIn(false)
    setEmployees([])
    setIsEmployeesReady(false)
    setIsEmployeeFormOpen(false)
    setEditingEmployee(null)
    setIsDayStatusModalOpen(false)
    setEditingDate(null)
    setIsReportModalOpen(false)
  }, [])

  const value = useMemo<AppContextValue>(
    () => ({
      isLoggedIn,
      loginError,
      login,
      logout,
      theme,
      setTheme,
      employees,
      isEmployeesReady,
      refreshEmployees,
      getEmployee,
      isEmployeeFormOpen,
      editingEmployee,
      openCreateEmployeeForm,
      openEditEmployeeForm,
      closeEmployeeForm,
      saveEmployee,
      isDayStatusModalOpen,
      editingDate,
      openDayStatusModal,
      closeDayStatusModal,
      saveDayRecord,
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
      employees,
      getEmployee,
      isDayStatusModalOpen,
      isEmployeeFormOpen,
      isEmployeesReady,
      isLoggedIn,
      isReportModalOpen,
      login,
      loginError,
      logout,
      openCreateEmployeeForm,
      openDayStatusModal,
      openEditEmployeeForm,
      openReportModal,
      refreshEmployees,
      saveDayRecord,
      saveEmployee,
      setTheme,
      theme,
    ],
  )

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>
}

export const useApp = (): AppContextValue => {
  const context = useContext(AppCtx)
  if (!context) throw new Error('useApp must be used within AppProvider')
  return context
}
