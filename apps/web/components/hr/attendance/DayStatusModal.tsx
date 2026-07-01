'use client'

import { useState, useEffect } from 'react'
import { useApp } from '../AppContext'
import { Modal, ModalHeader, ModalFooter } from '../shared/Modal'
import {
  DAY_STATUS_OPTIONS,
  PRESENT_STATUS,
  REMOVE_FUTURE_ATTENDANCE,
  REMOVE_FUTURE_ATTENDANCE_LABEL,
} from '@/lib/constants/attendance'
import { formatPolishDate, getTodayIsoDate } from '@/lib/domain/dates'
import { calcShiftHours } from '@/lib/domain/shift'
import type { DayStatus, Employee, IsoDate } from '@/lib/types'

type DayStatusFormValue = DayStatus | typeof REMOVE_FUTURE_ATTENDANCE

const resolveStatus = (employee: Employee, date: IsoDate | null): DayStatusFormValue => {
  if (!date) return PRESENT_STATUS
  const record = employee.dayRecords.find(({ date: recordDate }) => recordDate === date)
  return record?.status ?? PRESENT_STATUS
}

export const DayStatusModal = ({ employee }: { employee: Employee }) => {
  const { isDayStatusModalOpen, editingDate, closeDayStatusModal, saveDayRecord, removeDayRecord } =
    useApp()
  const [status, setStatus] = useState<DayStatusFormValue>(() =>
    resolveStatus(employee, editingDate),
  )

  useEffect(() => {
    if (!isDayStatusModalOpen || !editingDate) return
    setStatus(resolveStatus(employee, editingDate))
  }, [employee.dayRecords, editingDate, isDayStatusModalOpen])

  if (!isDayStatusModalOpen || !editingDate) return null

  const today = getTodayIsoDate()
  const isFutureDay = editingDate > today

  const [yearStr, monthStr, dayStr] = editingDate.split('-')
  const dateDisplay = formatPolishDate(
    parseInt(dayStr, 10),
    parseInt(monthStr, 10),
    parseInt(yearStr, 10),
  )

  const isRemoving = status === REMOVE_FUTURE_ATTENDANCE
  const isPresent = !isRemoving && status === PRESENT_STATUS
  const hoursDisplay = isRemoving
    ? 'Frekwencja nieustawiona — dzień wróci do stanu domyślnego (—).'
    : isPresent
      ? `Godziny pracy: ${employee.startHour} - ${employee.endHour} (Realny czas: ${calcShiftHours(employee.startHour, employee.endHour)}h)`
      : 'Godziny pracy: Brak (Realny czas: 0h)'

  const handleSave = () => {
    if (status === REMOVE_FUTURE_ATTENDANCE) {
      void removeDayRecord(employee.id, editingDate)
      return
    }
    void saveDayRecord(employee.id, editingDate, status)
  }

  const saveLabel =
    status === REMOVE_FUTURE_ATTENDANCE ? 'Usuń frekwencję' : 'Aktualizuj'

  return (
    <Modal open={isDayStatusModalOpen} onClose={closeDayStatusModal} maxWidth="max-w-md">
      <ModalHeader onClose={closeDayStatusModal} />

      <div className="px-6 pb-2 flex flex-col gap-5">
        <h2 className="text-xl font-bold text-foreground text-center">{dateDisplay}</h2>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-muted-foreground">Status</label>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as DayStatusFormValue)}
            className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition appearance-none cursor-pointer"
          >
            {isFutureDay ? (
              <option value={REMOVE_FUTURE_ATTENDANCE}>{REMOVE_FUTURE_ATTENDANCE_LABEL}</option>
            ) : null}
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
          className={`w-full h-11 rounded-lg text-sm font-semibold hover:opacity-90 active:scale-[0.99] transition-all shadow-sm ${
            isRemoving
              ? 'bg-destructive text-destructive-foreground'
              : 'bg-primary text-primary-foreground'
          }`}
        >
          {saveLabel}
        </button>
      </ModalFooter>
    </Modal>
  )
}
