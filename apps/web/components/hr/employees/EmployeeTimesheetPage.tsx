'use client'

import { useMemo, useState } from 'react'
import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { getInitialTimesheetPeriod, getTodayIsoDate, parseIsoDate, type Employee, type IsoDate } from '@hr-assist/shared'
import { useApp } from '../AppContext'
import { AppLayout } from '../layout/AppLayout'
import { EmployeeProfileCard } from './EmployeeProfileCard'
import { TimesheetTable } from './TimesheetTable'

interface EmployeeTimesheetPageProps {
  employee: Employee
}

export const EmployeeTimesheetPage = ({ employee }: EmployeeTimesheetPageProps) => {
  const router = useRouter()
  const { openDayStatusModal } = useApp()
  const [period, setPeriod] = useState(getInitialTimesheetPeriod)
  const [scrollRequest, setScrollRequest] = useState<{ date: IsoDate; key: number } | null>(
    null,
  )

  const absenceRefreshToken = useMemo(
    () =>
      employee.dayRecords
        .map((record) => `${record.date}:${record.status ?? ''}`)
        .join('|'),
    [employee.dayRecords],
  )

  const handlePeriodChange = (month: number, year: number) => {
    setPeriod({ month, year })
  }

  const handleGoToToday = () => {
    const today = getTodayIsoDate()
    const { month, year } = parseIsoDate(today)
    setPeriod({ month, year })
    setScrollRequest({ date: today, key: Date.now() })
  }

  const handleUnexcusedAbsenceSelect = (date: IsoDate) => {
    const { month, year } = parseIsoDate(date)
    setPeriod({ month, year })
    setScrollRequest({ date, key: Date.now() })
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
          onGoToToday={handleGoToToday}
          onUnexcusedAbsenceSelect={handleUnexcusedAbsenceSelect}
          absenceRefreshToken={absenceRefreshToken}
        />
        <TimesheetTable
          employee={employee}
          month={period.month}
          year={period.year}
          scrollToDate={scrollRequest?.date ?? null}
          scrollRequestKey={scrollRequest?.key ?? 0}
          onScrollToDateComplete={() => setScrollRequest(null)}
          onDayClick={openDayStatusModal}
        />
      </div>
    </AppLayout>
  )
}
