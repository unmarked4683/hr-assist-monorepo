'use client'

import { useState } from 'react'
import { useApp } from '../AppContext'
import { Modal, ModalHeader, ModalFooter } from '../shared/Modal'
import { MonthYearPicker, getInitialPeriod } from '../shared/MonthYearPicker'
import { MONTH_NAMES_NOM } from '@/lib/hr-data'

const MIN_YEAR = 2026
const MIN_MONTH = 1

export function ReportGenerateModal() {
  const { isReportModalOpen, closeReportModal } = useApp()
  const initial = getInitialPeriod()
  const [month, setMonth] = useState(initial.month)
  const [year, setYear] = useState(initial.year)

  function handlePeriodChange(m: number, y: number) {
    setMonth(m)
    setYear(y)
  }

  function handleGenerate() {
    alert(`Generowanie raportu za ${MONTH_NAMES_NOM[month - 1]} ${year}…`)
    closeReportModal()
  }

  return (
    <Modal open={isReportModalOpen} maxWidth="max-w-sm">
      <ModalHeader title="Generuj raport" onClose={closeReportModal} />

      <div className="px-5 py-5 flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">
          Wybierz okres rozliczeniowy dla raportu. Najwcześniejszy dostępny okres to{' '}
          <span className="font-medium text-foreground">1 stycznia 2026 r.</span>
        </p>

        <MonthYearPicker
          month={month}
          year={year}
          onChange={handlePeriodChange}
          minYear={MIN_YEAR}
          minMonth={MIN_MONTH}
          className="w-full"
        />
      </div>

      <ModalFooter>
        <button
          onClick={handleGenerate}
          className="w-full h-11 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 active:scale-[0.99] transition-all shadow-sm"
        >
          Generuj raport
        </button>
      </ModalFooter>
    </Modal>
  )
}
