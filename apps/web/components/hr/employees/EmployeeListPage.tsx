'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Plus, MapPin } from 'lucide-react'
import { useApp } from '../AppContext'
import { employeeNeedsAction, getLocationLabel, toListAttendanceStatus, type Location } from '@hr-assist/shared'
import { AppLayout } from '../layout/AppLayout'
import { AttendanceStatusBadge } from '../shared/AttendanceStatusBadge'
import { EmployeeListSkeleton } from './EmployeeListSkeleton'

const COLUMNS = ['Imię', 'Nazwisko', 'Stanowisko', 'Lokalizacja', 'Status'] as const

function LocationBadge({ location }: { location: Location }) {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground border border-border">
      <MapPin size={10} />
      {getLocationLabel(location)}
    </span>
  )
}

function ColumnGroup() {
  return (
    <colgroup>
      <col className="w-[16%]" />
      <col className="w-[16%]" />
      <col className="w-[28%]" />
      <col className="w-[20%]" />
      <col className="w-[20%]" />
    </colgroup>
  )
}

export function EmployeeListPage() {
  const router = useRouter()
  const { employees, isEmployeesReady, openCreateEmployeeForm, pendingToast, consumePendingToast } =
    useApp()
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (pendingToast) consumePendingToast()
  }, [pendingToast, consumePendingToast])

  const filteredEmployees = employees.filter((emp) => {
    const q = searchQuery.toLowerCase()
    return (
      emp.firstName.toLowerCase().includes(q) ||
      emp.lastName.toLowerCase().includes(q) ||
      emp.position.toLowerCase().includes(q) ||
      emp.location.toLowerCase().includes(q)
    )
  })

  if (!isEmployeesReady) {
    return <EmployeeListSkeleton />
  }

  return (
    <AppLayout>
      <header className="flex items-center gap-3 px-6 py-4 border-b border-border bg-card shrink-0 max-w-full">
        <div className="relative flex-1 grow">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
          <input
            type="text"
            placeholder="Szukaj pracowników..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-4 rounded-lg border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
          />
        </div>
        <button
          onClick={openCreateEmployeeForm}
          className="h-9 w-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 active:scale-95 transition-all shadow-sm"
          aria-label="Dodaj pracownika"
        >
          <Plus size={18} />
        </button>
      </header>

      <div className="flex-1 min-h-0 overflow-hidden px-6 py-5">
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden h-full flex flex-col">
          <table className="w-full text-sm table-fixed shrink-0">
            <ColumnGroup />
            <thead>
              <tr className="border-b border-border bg-muted/50">
                {COLUMNS.map((label) => (
                  <th
                    key={label}
                    className="text-center px-3 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide"
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
          </table>

          <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent">
            <table className="w-full text-sm table-fixed">
              <ColumnGroup />
              <tbody className="hr-table-zebra">
                {filteredEmployees.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-muted-foreground text-sm">
                      Brak pracowników spełniających kryteria wyszukiwania.
                    </td>
                  </tr>
                )}
                {filteredEmployees.map((emp) => {
                  const needsAction = employeeNeedsAction(emp)
                  return (
                    <tr
                      key={emp.id}
                      onClick={() => router.push(`/employees/${emp.id}`)}
                      className={[
                        'hr-table-row hr-table-row-clickable',
                        needsAction && 'animate-pulse-red-row',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                    >
                      <td className="px-3 py-2.5 text-center font-medium text-foreground">
                        {emp.firstName}
                      </td>
                      <td className="px-3 py-2.5 text-center text-foreground">
                        {emp.lastName}
                      </td>
                      <td className="px-3 py-2.5 text-center text-muted-foreground">
                        {emp.position}
                      </td>
                      <td className="px-3 py-2.5 text-center">
                        <LocationBadge location={emp.location} />
                      </td>
                      <td className="px-3 py-2.5 text-center">
                        <AttendanceStatusBadge
                          variant="list"
                          status={toListAttendanceStatus(needsAction)}
                        />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
