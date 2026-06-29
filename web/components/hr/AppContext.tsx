'use client'

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import {
  Employee,
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployeeData,
  upsertDayRecord,
  DayStatus,
} from '@/lib/hr-data'

export type Theme = 'light' | 'dark' | 'system'

interface AppContextValue {
  isLoggedIn: boolean
  loginError: boolean
  login: (email: string, password: string) => void
  logout: () => void

  theme: Theme
  setTheme: (t: Theme) => void

  employees: Employee[]
  refreshEmployees: () => void
  getEmployee: (id: string) => Employee | undefined

  isEmployeeFormOpen: boolean
  editingEmployee: Employee | null
  openCreateEmployeeForm: () => void
  openEditEmployeeForm: (emp: Employee) => void
  closeEmployeeForm: () => void
  saveEmployee: (data: Omit<Employee, 'id' | 'dayRecords'>, id?: string) => void

  isDayStatusModalOpen: boolean
  editingDate: string | null
  openDayStatusModal: (date: string) => void
  closeDayStatusModal: () => void
  saveDayRecord: (employeeId: string, date: string, status: DayStatus) => void

  isReportModalOpen: boolean
  openReportModal: () => void
  closeReportModal: () => void
}

const AppCtx = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loginError, setLoginError] = useState(false)
  const [theme, setThemeState] = useState<Theme>('system')
  const [employees, setEmployees] = useState<Employee[]>(getEmployees())
  const [isEmployeeFormOpen, setIsEmployeeFormOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const [isDayStatusModalOpen, setIsDayStatusModalOpen] = useState(false)
  const [editingDate, setEditingDate] = useState<string | null>(null)
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t)
    const html = document.documentElement
    html.classList.remove('light', 'dark')
    if (t === 'light') html.classList.add('light')
    else if (t === 'dark') html.classList.add('dark')
  }, [])

  useEffect(() => {
    const stored = localStorage.getItem('hr-theme') as Theme | null
    if (stored) setTheme(stored)
  }, [setTheme])

  useEffect(() => {
    localStorage.setItem('hr-theme', theme)
  }, [theme])

  const login = useCallback((email: string, password: string) => {
    if (email && password.length >= 4) {
      setIsLoggedIn(true)
      setLoginError(false)
    } else {
      setLoginError(true)
      setTimeout(() => setLoginError(false), 4000)
    }
  }, [])

  const logout = useCallback(() => {
    setIsLoggedIn(false)
  }, [])

  const refreshEmployees = useCallback(() => {
    setEmployees([...getEmployees()])
  }, [])

  const getEmployee = useCallback((id: string) => getEmployeeById(id), [])

  const openCreateEmployeeForm = useCallback(() => {
    setEditingEmployee(null)
    setIsEmployeeFormOpen(true)
  }, [])

  const openEditEmployeeForm = useCallback((emp: Employee) => {
    setEditingEmployee(emp)
    setIsEmployeeFormOpen(true)
  }, [])

  const closeEmployeeForm = useCallback(() => {
    setIsEmployeeFormOpen(false)
    setEditingEmployee(null)
  }, [])

  const saveEmployee = useCallback(
    (data: Omit<Employee, 'id' | 'dayRecords'>, id?: string) => {
      if (id) {
        updateEmployeeData(id, data)
      } else {
        createEmployee(data)
      }
      refreshEmployees()
      closeEmployeeForm()
    },
    [refreshEmployees, closeEmployeeForm],
  )

  const openDayStatusModal = useCallback((date: string) => {
    setEditingDate(date)
    setIsDayStatusModalOpen(true)
  }, [])

  const closeDayStatusModal = useCallback(() => {
    setIsDayStatusModalOpen(false)
    setEditingDate(null)
  }, [])

  const saveDayRecord = useCallback(
    (employeeId: string, date: string, status: DayStatus) => {
      upsertDayRecord(employeeId, date, status)
      refreshEmployees()
      closeDayStatusModal()
    },
    [refreshEmployees, closeDayStatusModal],
  )

  const openReportModal = useCallback(() => setIsReportModalOpen(true), [])
  const closeReportModal = useCallback(() => setIsReportModalOpen(false), [])

  return (
    <AppCtx.Provider
      value={{
        isLoggedIn,
        loginError,
        login,
        logout,
        theme,
        setTheme,
        employees,
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
      }}
    >
      {children}
    </AppCtx.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppCtx)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
