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

export type Screen = 'login' | 'dashboard' | 'employee-detail'
export type Theme = 'light' | 'dark' | 'system'

interface AppContextValue {
  // Auth
  isLoggedIn: boolean
  loginError: boolean
  login: (email: string, password: string) => void
  logout: () => void

  // Navigation
  screen: Screen
  setScreen: (s: Screen) => void
  selectedEmployeeId: string | null
  openEmployeeDetail: (id: string) => void

  // Theme
  theme: Theme
  setTheme: (t: Theme) => void

  // Employees
  employees: Employee[]
  refreshEmployees: () => void
  getEmployee: (id: string) => Employee | undefined

  // Modals
  isAddEditModalOpen: boolean
  editingEmployee: Employee | null
  openCreateModal: () => void
  openEditModal: (emp: Employee) => void
  closeAddEditModal: () => void
  saveEmployee: (data: Omit<Employee, 'id' | 'dayRecords'>, id?: string) => void

  // Day Edit Modal
  isDayEditModalOpen: boolean
  editingDate: string | null
  openDayEditModal: (date: string) => void
  closeDayEditModal: () => void
  saveDayRecord: (employeeId: string, date: string, status: DayStatus) => void

  // Report Modal
  isReportModalOpen: boolean
  openReportModal: () => void
  closeReportModal: () => void

  // Timesheet period
  timesheetMonth: number
  timesheetYear: number
  setTimesheetPeriod: (month: number, year: number) => void
}

const AppCtx = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loginError, setLoginError] = useState(false)
  const [screen, setScreen] = useState<Screen>('login')
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null)
  const [theme, setThemeState] = useState<Theme>('system')
  const [employees, setEmployees] = useState<Employee[]>(getEmployees())
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const [isDayEditModalOpen, setIsDayEditModalOpen] = useState(false)
  const [editingDate, setEditingDate] = useState<string | null>(null)
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)

  const now = new Date()
  const [timesheetMonth, setTimesheetMonth] = useState(now.getMonth() + 1)
  const [timesheetYear, setTimesheetYear] = useState(now.getFullYear() < 2026 ? 2026 : now.getFullYear())

  // Apply theme class to html element
  const setTheme = useCallback((t: Theme) => {
    setThemeState(t)
    const html = document.documentElement
    html.classList.remove('light', 'dark')
    if (t === 'light') html.classList.add('light')
    else if (t === 'dark') html.classList.add('dark')
    // 'system' → no class, CSS media query handles it
  }, [])

  // Persist theme preference
  useEffect(() => {
    const stored = localStorage.getItem('hr-theme') as Theme | null
    if (stored) setTheme(stored)
  }, [setTheme])

  useEffect(() => {
    localStorage.setItem('hr-theme', theme)
  }, [theme])

  const login = useCallback((email: string, password: string) => {
    // Mock auth — replace with real API call
    if (email && password.length >= 4) {
      setIsLoggedIn(true)
      setLoginError(false)
      setScreen('dashboard')
    } else {
      setLoginError(true)
      setTimeout(() => setLoginError(false), 4000)
    }
  }, [])

  const logout = useCallback(() => {
    setIsLoggedIn(false)
    setScreen('login')
  }, [])

  const refreshEmployees = useCallback(() => {
    setEmployees([...getEmployees()])
  }, [])

  const getEmployee = useCallback((id: string) => getEmployeeById(id), [])

  const openEmployeeDetail = useCallback((id: string) => {
    setSelectedEmployeeId(id)
    setScreen('employee-detail')
  }, [])

  const openCreateModal = useCallback(() => {
    setEditingEmployee(null)
    setIsAddEditModalOpen(true)
  }, [])

  const openEditModal = useCallback((emp: Employee) => {
    setEditingEmployee(emp)
    setIsAddEditModalOpen(true)
  }, [])

  const closeAddEditModal = useCallback(() => {
    setIsAddEditModalOpen(false)
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
      closeAddEditModal()
    },
    [refreshEmployees, closeAddEditModal]
  )

  const openDayEditModal = useCallback((date: string) => {
    setEditingDate(date)
    setIsDayEditModalOpen(true)
  }, [])

  const closeDayEditModal = useCallback(() => {
    setIsDayEditModalOpen(false)
    setEditingDate(null)
  }, [])

  const saveDayRecord = useCallback(
    (employeeId: string, date: string, status: DayStatus) => {
      upsertDayRecord(employeeId, date, status)
      refreshEmployees()
      closeDayEditModal()
    },
    [refreshEmployees, closeDayEditModal]
  )

  const openReportModal = useCallback(() => setIsReportModalOpen(true), [])
  const closeReportModal = useCallback(() => setIsReportModalOpen(false), [])

  const setTimesheetPeriod = useCallback((month: number, year: number) => {
    setTimesheetMonth(month)
    setTimesheetYear(year)
  }, [])

  return (
    <AppCtx.Provider
      value={{
        isLoggedIn, loginError, login, logout,
        screen, setScreen, selectedEmployeeId, openEmployeeDetail,
        theme, setTheme,
        employees, refreshEmployees, getEmployee,
        isAddEditModalOpen, editingEmployee, openCreateModal, openEditModal, closeAddEditModal, saveEmployee,
        isDayEditModalOpen, editingDate, openDayEditModal, closeDayEditModal, saveDayRecord,
        isReportModalOpen, openReportModal, closeReportModal,
        timesheetMonth, timesheetYear, setTimesheetPeriod,
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
