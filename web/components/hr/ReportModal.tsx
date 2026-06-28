'use client'

import { useState } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { useApp } from './AppContext'
import { MONTH_NAMES_NOM } from '@/lib/hr-data'

const MIN_YEAR = 2026
const MIN_MONTH = 1 // January 2026

export function ReportModal() {
  const { isReportModalOpen, closeReportModal } = useApp()

  const now = new Date()
  const initYear = Math.max(now.getFullYear(), 2026)
  const initMonth = now.getFullYear() < 2026 ? 1 : now.getMonth() + 1

  const [month, setMonth] = useState(initMonth)
  const [year, setYear] = useState(initYear)

  if (!isReportModalOpen) return null

  const canGoBack = !(year === MIN_YEAR && month === MIN_MONTH)

  function prev() {
    if (!canGoBack) return
    if (month === 1) { setMonth(12); setYear((y) => y - 1) }
    else setMonth((m) => m - 1)
  }

  function next() {
    if (month === 12) { setMonth(1); setYear((y) => y + 1) }
    else setMonth((m) => m + 1)
  }

  function handleGenerate() {
    // Placeholder — replace with real report generation API call
    alert(`Generowanie raportu za ${MONTH_NAMES_NOM[month - 1]} ${year}…`)
    closeReportModal()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backdropFilter: 'blur(6px)', backgroundColor: 'oklch(0 0 0 / 40%)' }}
    >
      <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-sm flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-border shrink-0">
          <h2 className="text-base font-semibold text-foreground">Generuj raport</h2>
          <button
            onClick={closeReportModal}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Zamknij"
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-5 py-5 flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            Wybierz okres rozliczeniowy dla raportu. Najwcześniejszy dostępny okres to{' '}
            <span className="font-medium text-foreground">1 stycznia 2026 r.</span>
          </p>

          {/* Period selector */}
          <div className="flex items-center gap-2">
            <button
              onClick={prev}
              disabled={!canGoBack}
              className={`w-8 h-8 flex items-center justify-center rounded-lg border border-border transition-colors ${
                canGoBack
                  ? 'hover:bg-accent text-foreground'
                  : 'text-muted-foreground/30 cursor-not-allowed'
              }`}
              aria-label="Poprzedni miesiąc"
            >
              <ChevronLeft size={15} />
            </button>

            <div className="flex-1 flex gap-2">
              <select
                value={month}
                onChange={(e) => {
                  const m = parseInt(e.target.value, 10)
                  if (year === MIN_YEAR && m < MIN_MONTH) return
                  setMonth(m)
                }}
                className="flex-1 h-9 px-2 rounded-lg border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition appearance-none cursor-pointer"
              >
                {MONTH_NAMES_NOM.map((name, idx) => {
                  const m = idx + 1
                  const disabled = year === MIN_YEAR && m < MIN_MONTH
                  return <option key={m} value={m} disabled={disabled}>{name}</option>
                })}
              </select>

              <select
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value, 10))}
                className="w-24 h-9 px-2 rounded-lg border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition appearance-none cursor-pointer"
              >
                {Array.from({ length: 10 }, (_, i) => MIN_YEAR + i).map((y) => (
                  <option key={y}>{y}</option>
                ))}
              </select>
            </div>

            <button
              onClick={next}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-border hover:bg-accent text-foreground transition-colors"
              aria-label="Następny miesiąc"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>

        {/* Generate button */}
        <div className="px-5 pb-5 pt-1 shrink-0">
          <button
            onClick={handleGenerate}
            className="w-full h-11 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 active:scale-[0.99] transition-all shadow-sm"
          >
            Generuj raport
          </button>
        </div>
      </div>
    </div>
  )
}
