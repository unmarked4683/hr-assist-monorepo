'use client'

import { use, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { EmployeeTimesheetPage } from '@/components/hr/employees/EmployeeTimesheetPage'
import { EmployeeTimesheetSkeleton } from '@/components/hr/employees/EmployeeTimesheetSkeleton'
import { DayStatusModal } from '@/components/hr/attendance/DayStatusModal'
import { ReportGenerateModal } from '@/components/hr/reports/ReportGenerateModal'
import { useApp } from '@/components/hr/AppContext'
import { useEmployee } from '@/lib/hooks/useEmployee'

export default function EmployeeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const { dismissToast } = useApp()
  const { employee, isLoading } = useEmployee(id)

  useEffect(() => {
    return () => {
      dismissToast()
    }
  }, [dismissToast])

  useEffect(() => {
    if (!isLoading && !employee) router.replace('/employees')
  }, [employee, isLoading, router])

  if (isLoading) return <EmployeeTimesheetSkeleton />

  if (!employee) return null

  return (
    <>
      <EmployeeTimesheetPage employee={employee} />
      <DayStatusModal employee={employee} />
      <ReportGenerateModal />
    </>
  )
}
