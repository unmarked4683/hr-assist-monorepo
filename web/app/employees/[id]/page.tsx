'use client'

import { use, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { EmployeeTimesheetPage } from '@/components/hr/employees/EmployeeTimesheetPage'
import { DayStatusModal } from '@/components/hr/attendance/DayStatusModal'
import { ReportGenerateModal } from '@/components/hr/reports/ReportGenerateModal'
import { useEmployee } from '@/lib/hooks/useEmployee'

export default function EmployeeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const { employee, isLoading } = useEmployee(id)

  useEffect(() => {
    if (!isLoading && !employee) router.replace('/employees')
  }, [employee, isLoading, router])

  if (isLoading || !employee) return null

  return (
    <>
      <EmployeeTimesheetPage employee={employee} />
      <DayStatusModal employee={employee} />
      <ReportGenerateModal />
    </>
  )
}
