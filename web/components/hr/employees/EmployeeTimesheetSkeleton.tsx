'use client'

import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { AppLayout } from '../layout/AppLayout'
import { Skeleton } from '../shared/Skeleton'

const TIMESHEET_ROWS = 14

const TimesheetColumnGroup = () => (
  <colgroup>
    <col className="w-[8%]" />
    <col className="w-[11%]" />
    <col className="w-[16%]" />
    <col className="w-[22%]" />
    <col className="w-[22%]" />
    <col className="w-[21%]" />
  </colgroup>
)

const ProfileField = ({ valueWidth = 'w-3/4' }: { valueWidth?: string }) => (
  <div>
    <Skeleton className="mb-1.5 h-3 w-24" />
    <Skeleton className={cn('h-4', valueWidth)} />
  </div>
)

export const EmployeeTimesheetSkeleton = () => {
  const router = useRouter()

  return (
    <AppLayout>
      <header className="flex items-center gap-3 px-6 py-4 border-b border-border bg-card shrink-0">
        <button
          type="button"
          onClick={() => router.push('/employees')}
          className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft size={16} />
          Powrót do listy
        </button>
      </header>

      <div
        className="flex-1 min-h-0 overflow-hidden px-6 py-5 flex flex-col gap-5"
        aria-busy="true"
        aria-label="Ładowanie danych pracownika"
      >
        {/* Tabliczka znamionowa */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="grid grid-cols-2 gap-x-10 gap-y-3.5 flex-1">
              <ProfileField valueWidth="w-4/5" />
              <ProfileField valueWidth="w-full" />
              <ProfileField />
              <ProfileField valueWidth="w-20" />
              <ProfileField valueWidth="w-24" />
              <ProfileField valueWidth="w-28" />
              <ProfileField valueWidth="w-2/3" />
              <div />
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Skeleton className="h-9 w-9 rounded-lg" />
              <Skeleton className="h-9 w-9 rounded-lg" />
              <Skeleton className="h-9 w-9 rounded-lg" />
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-border flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <Skeleton className="h-8 w-32 rounded-lg" />
            <Skeleton className="h-8 w-20 rounded-lg" />
            <Skeleton className="h-8 w-8 rounded-lg" />
          </div>
        </div>

        {/* Tabela godzin */}
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden flex-1 min-h-0 flex flex-col">
          <table className="w-full text-sm table-fixed shrink-0">
            <TimesheetColumnGroup />
            <thead>
              <tr className="border-b border-border bg-muted/50">
                {Array.from({ length: 6 }, (_, index) => (
                  <th key={index} className="px-2 py-3">
                    <Skeleton className="mx-auto h-3 w-14" />
                  </th>
                ))}
              </tr>
            </thead>
          </table>

          <div className="flex-1 min-h-0 overflow-hidden">
            <table className="w-full text-sm table-fixed hr-skeleton-table">
              <TimesheetColumnGroup />
              <tbody>
                {Array.from({ length: TIMESHEET_ROWS }, (_, rowIndex) => (
                  <tr key={rowIndex} className="border-b border-border">
                    {Array.from({ length: 6 }, (_, colIndex) => (
                      <td key={colIndex} className="px-2 py-2.5 text-center">
                        <Skeleton
                          className={cn(
                            'mx-auto h-4',
                            colIndex === 0 ? 'w-5' : colIndex === 5 ? 'w-10' : 'w-3/4',
                          )}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
