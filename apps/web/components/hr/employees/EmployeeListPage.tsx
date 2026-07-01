'use client'

import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Plus } from 'lucide-react'
import { useApp, useEmployees } from '../AppContext'
import { AppLayout } from '../layout/AppLayout'
import { EmployeeListRow } from './EmployeeListRow'
import { EmployeeListSkeleton } from './EmployeeListSkeleton'

const COLUMNS = ['Imię', 'Nazwisko', 'Stanowisko', 'Lokalizacja', 'Status'] as const

const ColumnGroup = memo(function ColumnGroup() {
  return (
    <colgroup>
      <col className="w-[16%]" />
      <col className="w-[16%]" />
      <col className="w-[28%]" />
      <col className="w-[20%]" />
      <col className="w-[20%]" />
    </colgroup>
  )
})

export function EmployeeListPage() {
  const router = useRouter()
  const { employees, isEmployeesReady } = useEmployees()
  const { openCreateEmployeeForm, pendingToast, consumePendingToast } = useApp()
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (pendingToast) consumePendingToast()
  }, [pendingToast, consumePendingToast])

  const filteredEmployees = useMemo(() => {
    const query = searchQuery.toLowerCase()

    return employees.filter(
      (employee) =>
        employee.firstName.toLowerCase().includes(query) ||
        employee.lastName.toLowerCase().includes(query) ||
        employee.position.toLowerCase().includes(query) ||
        employee.location.toLowerCase().includes(query),
    )
  }, [employees, searchQuery])

  const handleSelectEmployee = useCallback(
    (employeeId: string) => {
      router.push(`/employees/${employeeId}`)
    },
    [router],
  )

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
            onChange={(event) => setSearchQuery(event.target.value)}
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
                {filteredEmployees.map((employee) => (
                  <EmployeeListRow
                    key={employee.id}
                    employee={employee}
                    onSelect={handleSelectEmployee}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
