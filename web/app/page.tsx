'use client'

import { AppProvider, useApp } from '@/components/hr/AppContext'
import { LoginScreen } from '@/components/hr/LoginScreen'
import { Dashboard } from '@/components/hr/Dashboard'
import { EmployeeDetail } from '@/components/hr/EmployeeDetail'
import { AddEditModal } from '@/components/hr/AddEditModal'

function AppShell() {
  const { screen, selectedEmployeeId, employees, isAddEditModalOpen } = useApp()

  const selectedEmployee = selectedEmployeeId
    ? employees.find((e) => e.id === selectedEmployeeId) ?? null
    : null

  return (
    <>
      {screen === 'login' && <LoginScreen />}
      {screen === 'dashboard' && <Dashboard />}
      {screen === 'employee-detail' && selectedEmployee && (
        <EmployeeDetail employee={selectedEmployee} />
      )}
      {isAddEditModalOpen && <AddEditModal />}
    </>
  )
}

export default function Page() {
  return (
    <AppProvider>
      <div className="h-screen max-h-screen min-h-screen overflow-hidden flex">
        <AppShell />
      </div>
    </AppProvider>
  )
}
