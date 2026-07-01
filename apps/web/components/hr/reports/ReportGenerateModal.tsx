'use client'

import { useState } from 'react'
import { useApp } from '../AppContext'
import { Modal, ModalHeader, ModalFooter } from '../shared/Modal'
import { MonthYearPicker } from '../shared/MonthYearPicker'
import { MONTH_NAMES_NOM } from '@/lib/constants/dates'
import { getInitialTimesheetPeriod } from '@/lib/domain/dates'

const MIN_YEAR = 2026
const MIN_MONTH = 1

export const ReportGenerateModal = () => {
  const { isReportModalOpen, closeReportModal } = useApp()
  const initial = getInitialTimesheetPeriod()
  const [month, setMonth] = useState(initial.month)
  const [year, setYear] = useState(initial.year)

  const handlePeriodChange = (nextMonth: number, nextYear: number) => {
    setMonth(nextMonth)
    setYear(nextYear)
  }

  const handleGenerate = () => {
    alert(`Raport za ${MONTH_NAMES_NOM[month - 1]} ${year} — funkcja w przygotowaniu.`)
    closeReportModal()
  }

  return (
    <Modal open={isReportModalOpen} onClose={closeReportModal} maxWidth="max-w-sm">
      <ModalHeader title="Generuj raport" onClose={closeReportModal} />

      <div className="px-6 py-5 flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">Wybierz okres raportu:</p>
        <MonthYearPicker
          month={month}
          year={year}
          onChange={handlePeriodChange}
          minYear={MIN_YEAR}
          minMonth={MIN_MONTH}
        />
      </div>

      <ModalFooter className="px-6 pb-5">
        <button
          onClick={handleGenerate}
          className="w-full h-11 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 active:scale-[0.99] transition-all shadow-sm"
        >
          Generuj
        </button>
      </ModalFooter>
    </Modal>
  )
}
