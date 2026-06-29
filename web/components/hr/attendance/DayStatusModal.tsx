'use client'

import { useState, useEffect } from 'react'
import { useApp } from '../AppContext'
import { Modal, ModalHeader, ModalFooter } from '../shared/Modal'
import { DAY_STATUS_OPTIONS, PRESENT_STATUS } from '@/lib/constants/attendance'
import { formatPolishDate } from '@/lib/domain/dates'
import { calcShiftHours } from '@/lib/domain/shift'
import type { DayStatus, Employee, IsoDate } from '@/lib/types'

const resolveStatus = (employee: Employee, date: IsoDate | null): DayStatus => {
  if (!date) return PRESENT_STATUS
  const record = employee.dayRecords.find(({ date: recordDate }) => recordDate === date)
  return record?.status ?? PRESENT_STATUS
}

export const DayStatusModal = ({ employee }: { employee: Employee }) => {
  const { isDayStatusModalOpen, editingDate, closeDayStatusModal, saveDayRecord } = useApp()
  const [status, setStatus] = useState<DayStatus>(() => resolveStatus(employee, editingDate))

  useEffect(() => {
    if (!isDayStatusModalOpen || !editingDate) return
    setStatus(resolveStatus(employee, editingDate))
  }, [employee.dayRecords, editingDate, isDayStatusModalOpen])

  if (!isDayStatusModalOpen || !editingDate) return null

  const [yearStr, monthStr, dayStr] = editingDate.split('-')
  const dateDisplay = formatPolishDate(
    parseInt(dayStr, 10),
    parseInt(monthStr, 10),
    parseInt(yearStr, 10),
  )

  const isPresent = status === PRESENT_STATUS
  const hoursDisplay = isPresent
    ? `Godziny pracy: ${employee.startHour} - ${employee.endHour} (Realny czas: ${calcShiftHours(employee.startHour, employee.endHour)}h)`
    : 'Godziny pracy: Brak (Realny czas: 0h)'

  const handleSave = () => {
    void saveDayRecord(employee.id, editingDate, status)
  }

  return (
    <Modal open={isDayStatusModalOpen} maxWidth="max-w-md">
      <ModalHeader onClose={closeDayStatusModal} />

      <div className="px-6 pb-2 flex flex-col gap-5">
        <h2 className="text-xl font-bold text-foreground text-center">{dateDisplay}</h2>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-muted-foreground">Status</label>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as DayStatus)}
            className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition appearance-none cursor-pointer"
          >
            {DAY_STATUS_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="px-3 py-2.5 rounded-lg bg-muted/50 border border-border">
          <p className="text-sm text-muted-foreground">{hoursDisplay}</p>
        </div>
      </div>

      <ModalFooter className="px-6 pb-6 pt-4">
        <button
          onClick={handleSave}
          className="w-full h-11 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 active:scale-[0.99] transition-all shadow-sm"
        >
          Aktualizuj
        </button>
      </ModalFooter>
    </Modal>
  )
}
