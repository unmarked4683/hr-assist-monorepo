'use client'

import { useState, useEffect } from 'react'
import { useApp } from '../AppContext'
import { Modal, ModalHeader, ModalFooter } from '../shared/Modal'
import { DayStatus, formatPolishDate, Employee } from '@/lib/hr-data'

const STATUS_OPTIONS: DayStatus[] = [
  'Obecność',
  'Nieobecność nieusprawiedliwiona',
  'Urlop wypoczynkowy',
  'Urlop na żądanie',
  'Urlop macierzyński',
  'Urlop wychowawczy',
  'Urlop bezpłatny',
  'Choroba',
  'Opieka',
  'Zwolnienie płatne',
  'Zwolnienie niepłatne',
  'Służba wojskowa',
]

export function DayStatusModal({ employee }: { employee: Employee }) {
  const { isDayStatusModalOpen, editingDate, closeDayStatusModal, saveDayRecord } = useApp()

  const existing = editingDate
    ? (employee.dayRecords.find((d) => d.date === editingDate)?.status ?? 'Obecność')
    : 'Obecność'

  const [status, setStatus] = useState<DayStatus>(existing as DayStatus)

  useEffect(() => {
    if (isDayStatusModalOpen && editingDate) {
      const s = employee.dayRecords.find((d) => d.date === editingDate)?.status
      setStatus((s ?? 'Obecność') as DayStatus)
    }
  }, [isDayStatusModalOpen, editingDate, employee.dayRecords])

  if (!isDayStatusModalOpen || !editingDate) return null

  const [yearStr, monthStr, dayStr] = editingDate.split('-')
  const dateDisplay = formatPolishDate(
    parseInt(dayStr, 10),
    parseInt(monthStr, 10),
    parseInt(yearStr, 10),
  )

  const isPresent = status === 'Obecność'
  const hoursDisplay = isPresent
    ? `Godziny pracy: ${employee.startHour} - ${employee.endHour} (Realny czas: ${
        parseInt(employee.endHour) - parseInt(employee.startHour)
      }h)`
    : 'Godziny pracy: Brak (Realny czas: 0h)'

  return (
    <Modal open={isDayStatusModalOpen} maxWidth="max-w-md">
      <ModalHeader onClose={closeDayStatusModal} />

      <div className="px-6 pb-2 flex flex-col gap-5">
        <h2 className="text-xl font-bold text-foreground text-center">{dateDisplay}</h2>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-muted-foreground">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as DayStatus)}
            className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition appearance-none cursor-pointer"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="px-3 py-2.5 rounded-lg bg-muted/50 border border-border">
          <p className="text-sm text-muted-foreground">{hoursDisplay}</p>
        </div>
      </div>

      <ModalFooter className="px-6 pb-6 pt-4">
        <button
          onClick={() => saveDayRecord(employee.id, editingDate, status)}
          className="w-full h-11 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 active:scale-[0.99] transition-all shadow-sm"
        >
          Aktualizuj
        </button>
      </ModalFooter>
    </Modal>
  )
}
