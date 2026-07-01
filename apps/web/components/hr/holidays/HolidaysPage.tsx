'use client'

import { RefreshCw } from 'lucide-react'
import { getDayOffTypeLabel } from '@hr-assist/shared'
import { AppLayout } from '@/components/hr/layout/AppLayout'
import { Button } from '@/components/ui/button'
import { useHolidays } from '@/lib/hooks/useHolidays'

export function HolidaysPage() {
  const { holidays, isLoading, isError, error, isSyncing, synchronize } = useHolidays()

  return (
    <AppLayout>
      <div className="flex flex-col h-full overflow-hidden">
        <header className="shrink-0 px-8 pt-8 pb-4 border-b border-border flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Dni wolne</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Zarządzanie świętami ustawowymi i dniami wolnymi firmy
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => void synchronize()}
            disabled={isSyncing}
            aria-label="Synchronizuj święta ustawowe"
          >
            <RefreshCw size={16} className={isSyncing ? 'animate-spin' : undefined} />
            Synchronizuj
          </Button>
        </header>

        <div className="flex-1 overflow-auto px-8 py-6">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Ładowanie dni wolnych…</p>
          ) : isError ? (
            <p className="text-sm text-destructive">
              {error instanceof Error ? error.message : 'Nie udało się pobrać dni wolnych.'}
            </p>
          ) : holidays.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Brak dni wolnych. Kliknij „Synchronizuj”, aby pobrać święta ustawowe.
            </p>
          ) : (
            <div className="rounded-xl border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">Data</th>
                    <th className="px-4 py-3 text-left font-medium">Nazwa</th>
                    <th className="px-4 py-3 text-left font-medium">Typ</th>
                  </tr>
                </thead>
                <tbody>
                  {holidays.map((holiday) => (
                    <tr key={holiday.id} className="border-t border-border">
                      <td className="px-4 py-3 font-mono text-foreground">{holiday.date}</td>
                      <td className="px-4 py-3 text-foreground">{holiday.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {getDayOffTypeLabel(holiday.typeCode)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  )
}
