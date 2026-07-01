'use client'

import { cn } from '@/lib/utils'
import { AppLayout } from '../layout/AppLayout'
import { Skeleton } from '../shared/Skeleton'

const COLUMNS = 5
const ROWS = 8

const ColumnGroup = () => (
  <colgroup>
    <col className="w-[16%]" />
    <col className="w-[16%]" />
    <col className="w-[28%]" />
    <col className="w-[20%]" />
    <col className="w-[20%]" />
  </colgroup>
)

const SkeletonCell = ({ width = 'w-3/4' }: { width?: string }) => (
  <td className="px-3 py-2.5 text-center">
    <Skeleton className={cn('mx-auto h-4', width)} />
  </td>
)

export const EmployeeListSkeleton = () => (
  <AppLayout>
    <header className="flex items-center gap-3 px-6 py-4 border-b border-border bg-card shrink-0 max-w-full">
      <Skeleton className="h-9 flex-1 rounded-lg" />
      <Skeleton className="h-9 w-9 shrink-0 rounded-lg" />
    </header>

    <div
      className="flex-1 min-h-0 overflow-hidden px-6 py-5"
      aria-busy="true"
      aria-label="Ładowanie listy pracowników"
    >
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden h-full flex flex-col">
        <table className="w-full text-sm table-fixed shrink-0">
          <ColumnGroup />
          <thead>
            <tr className="border-b border-border bg-muted/50">
              {Array.from({ length: COLUMNS }, (_, index) => (
                <th key={index} className="px-3 py-3">
                  <Skeleton className="mx-auto h-3 w-16" />
                </th>
              ))}
            </tr>
          </thead>
        </table>

        <div className="flex-1 min-h-0 overflow-hidden">
          <table className="w-full text-sm table-fixed hr-skeleton-table">
            <ColumnGroup />
            <tbody>
              {Array.from({ length: ROWS }, (_, rowIndex) => (
                <tr key={rowIndex} className="border-b border-border">
                  <SkeletonCell width="w-2/3" />
                  <SkeletonCell width="w-2/3" />
                  <SkeletonCell width="w-4/5" />
                  <td className="px-3 py-2.5 text-center">
                    <Skeleton className="mx-auto h-5 w-20 rounded-full" />
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    <Skeleton className="mx-auto h-4 w-10" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </AppLayout>
)
