'use client'

import { use, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '@/components/hr/AppContext'
import { EmployeeTimesheetPage } from '@/components/hr/employees/EmployeeTimesheetPage'
import { DayStatusModal } from '@/components/hr/attendance/DayStatusModal'
import { ReportGenerateModal } from '@/components/hr/reports/ReportGenerateModal'

export default function EmployeeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const { getEmployee } = useApp()
  const employee = getEmployee(id)

  useEffect(() => {
    if (!employee) router.replace('/employees')
  }, [employee, router])

  if (!employee) return null

  return (
    <>
      <EmployeeTimesheetPage employee={employee} />
      <DayStatusModal employee={employee} />
      <ReportGenerateModal />
    </>
  )
}
