'use client'

import { AuthGuard } from '@/components/hr/auth/AuthGuard'
import { EmployeeFormModal } from '@/components/hr/employees/EmployeeFormModal'

export default function EmployeesLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      {children}
      <EmployeeFormModal />
    </AuthGuard>
  )
}
