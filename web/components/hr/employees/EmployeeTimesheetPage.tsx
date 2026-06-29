'use client'

import { useState } from 'react'
import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Employee } from '@/lib/hr-data'
import { useApp } from '../AppContext'
import { AppLayout } from '../layout/AppLayout'
import { getInitialPeriod } from '../shared/MonthYearPicker'
import { EmployeeProfileCard } from './EmployeeProfileCard'
import { TimesheetTable } from './TimesheetTable'

interface EmployeeTimesheetPageProps {
  employee: Employee
}

export function EmployeeTimesheetPage({ employee }: EmployeeTimesheetPageProps) {
  const router = useRouter()
  const { openDayStatusModal } = useApp()
  const [period, setPeriod] = useState(getInitialPeriod)

  function handlePeriodChange(month: number, year: number) {
    setPeriod({ month, year })
  }

  return (
    <AppLayout>
      <header className="flex items-center gap-3 px-6 py-4 border-b border-border bg-card shrink-0">
        <button
          onClick={() => router.push('/employees')}
          className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft size={16} />
          Powrót do listy
        </button>
      </header>

      <div className="flex-1 min-h-0 overflow-hidden px-6 py-5 flex flex-col gap-5">
        <EmployeeProfileCard
          employee={employee}
          month={period.month}
          year={period.year}
          onPeriodChange={handlePeriodChange}
        />
        <TimesheetTable
          employee={employee}
          month={period.month}
          year={period.year}
          onDayClick={openDayStatusModal}
        />
      </div>
    </AppLayout>
  )
}
