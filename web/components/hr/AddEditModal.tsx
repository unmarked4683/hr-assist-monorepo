'use client'

import { useState, useEffect, useRef } from 'react'
import { X, Building2, Settings2, ChevronDown } from 'lucide-react'
import { useApp } from './AppContext'
import {
  ContractType,
  CONTRACT_TYPE_LABELS,
  WorkDimension,
  Location,
  Company,
  Employee,
  parsePeselBirthdate,
  DIMENSION_HOURS,
  DIMENSION_LABEL,
} from '@/lib/hr-data'

const WORK_DIMENSIONS: WorkDimension[] = ['1', '7/8', '3/4', '5/8', '1/2', '3/8', '1/4', '1/8']
const COMPANIES: Company[] = ['Spółka Produkcja', 'Spółka Serwis', 'Spółka Marka Własna']
const POSITION_SUGGESTIONS = ['Brygadzista', 'Specjalista', 'Kierownik', 'Pracownik', 'Operator', 'Technik', 'Analityk', 'Manager']

// ── Time helpers — full modular 24h arithmetic (supports overnight wrapping) ──

function parseHour(time: string): number {
  return parseInt(time.split(':')[0], 10)
}

function formatHour(h: number): string {
  // Wrap via modulo so negative and >23 values resolve correctly
  const normalised = ((h % 24) + 24) % 24
  return `${String(normalised).padStart(2, '0')}:00`
}

function shiftHour(time: string, delta: number): string {
  return formatHour(parseHour(time) + delta)
}

// All valid hours 00–23
const ALL_HOURS: string[] = Array.from({ length: 24 }, (_, i) => formatHour(i))

// ── HourPicker ────────────────────────────────────────────────────────────────

function HourPicker({
  value,
  onChange,
  label,
  hint,
}: {
  value: string
  onChange: (v: string) => void
  label: string
  hint?: string
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function h(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  return (
    <div className="flex flex-col gap-1.5 relative" ref={ref}>
      <label className="text-xs font-semibold text-muted-foreground">{label}</label>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="h-9 px-3 rounded-lg border border-input bg-background text-sm text-foreground text-left focus:outline-none focus:ring-2 focus:ring-primary/30 hover:border-primary/40 transition"
      >
        {value}
      </button>
      {hint && <span className="text-xs text-amber-500 dark:text-amber-400 font-medium">{hint}</span>}
      {open && (
        <div className="absolute top-full left-0 w-full bg-popover border border-border rounded-lg shadow-xl z-[50] max-h-48 overflow-y-auto">
          {ALL_HOURS.map((h) => (
            <button
              key={h}
              type="button"
              onClick={() => { onChange(h); setOpen(false) }}
              className={`w-full text-left px-3 py-2 text-sm transition-colors hover:bg-accent ${value === h ? 'bg-primary/10 text-primary font-medium' : 'text-foreground'}`}
            >
              {h}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ── AutocompleteInput ─────────────────────────────────────────────────────────

function AutocompleteInput({
  value,
  onChange,
  suggestions,
  placeholder,
  label,
}: {
  value: string
  onChange: (v: string) => void
  suggestions: string[]
  placeholder?: string
  label: string
}) {
  const [open, setOpen] = useState(false)
  const [filtered, setFiltered] = useState<string[]>([])
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setFiltered(suggestions.filter((s) => s.toLowerCase().includes(value.toLowerCase())))
  }, [value, suggestions])

  useEffect(() => {
    function h(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  return (
    <div className="flex flex-col gap-1.5 relative" ref={ref}>
      <label className="text-xs font-semibold text-muted-foreground">{label}</label>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => { onChange(e.target.value); setOpen(true) }}
        onFocus={() => setOpen(true)}
        className="h-9 px-3 rounded-lg border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
      />
      {open && filtered.length > 0 && (
        <div className="absolute top-full left-0 w-full bg-popover border border-border rounded-lg shadow-xl z-[50] max-h-40 overflow-y-auto">
          {filtered.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => { onChange(s); setOpen(false) }}
              className="w-full text-left px-3 py-2 text-sm hover:bg-accent text-foreground transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ── DimensionSelect (strict fraction picker with guardrails) ──────────────────

function DimensionSelect({
  value,
  onChange,
}: {
  value: WorkDimension
  onChange: (v: WorkDimension) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function h(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  return (
    <div className="flex flex-col gap-1.5 relative" ref={ref}>
      <label className="text-xs font-semibold text-muted-foreground">Wymiar pracy</label>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="h-9 px-3 pr-8 rounded-lg border border-input bg-background text-sm text-foreground text-left focus:outline-none focus:ring-2 focus:ring-primary/30 hover:border-primary/40 transition relative"
      >
        {value === '1' ? '1 (pełny etat)' : value}
        <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
      </button>
      <span className="text-xs text-primary font-medium leading-none">{DIMENSION_LABEL[value]}</span>
      {open && (
        <div className="absolute top-full left-0 w-full bg-popover border border-border rounded-lg shadow-xl z-[50] overflow-hidden">
          {WORK_DIMENSIONS.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => { onChange(d); setOpen(false) }}
              className={`w-full text-left px-3 py-2.5 text-sm transition-colors hover:bg-accent flex items-center justify-between ${
                value === d ? 'bg-primary/10 text-primary font-medium' : 'text-foreground'
              }`}
            >
              <span>{d === '1' ? '1 (pełny etat)' : d}</span>
              <span className="text-xs text-muted-foreground">{DIMENSION_LABEL[d]}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Detect overnight shift ────────────────────────────────────────────────────

function isOvernight(startHour: string, endHour: string): boolean {
  return parseHour(endHour) <= parseHour(startHour)
}

// ── Build initial form state ──────────────────────────────────────────────────

function buildInitial(emp?: Employee | null) {
  return {
    firstName: emp?.firstName ?? '',
    lastName: emp?.lastName ?? '',
    pesel: emp?.pesel ?? '',
    contractType: emp?.contractType ?? ContractType.EmploymentContract,
    workDimension: (emp?.workDimension ?? '1') as WorkDimension,
    startHour: emp?.startHour ?? '08:00',
    endHour: emp?.endHour ?? '16:00',
    location: (emp?.location ?? 'Biuro') as Location,
    position: emp?.position ?? '',
    company: (emp?.company ?? 'Spółka Produkcja') as Company,
  }
}

// ── Main modal ────────────────────────────────────────────────────────────────

export function AddEditModal() {
  const { isAddEditModalOpen, editingEmployee, closeAddEditModal, saveEmployee } = useApp()
  const isEdit = !!editingEmployee

  const [form, setForm] = useState(buildInitial(editingEmployee))
  const [initial] = useState(buildInitial(editingEmployee))

  useEffect(() => {
    if (isAddEditModalOpen) {
      setForm(buildInitial(editingEmployee))
    }
  }, [isAddEditModalOpen, editingEmployee])

  const isDirty = JSON.stringify(form) !== JSON.stringify(initial)

  function set<K extends keyof typeof form>(key: K, val: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: val }))
  }

  // Start changed → derive end using modular arithmetic
  function handleStartChange(h: string) {
    const hours = DIMENSION_HOURS[form.workDimension] ?? 8
    const newEnd = shiftHour(h, hours)
    setForm((f) => ({ ...f, startHour: h, endHour: newEnd }))
  }

  // End changed → derive start backwards using modular arithmetic
  function handleEndChange(h: string) {
    const hours = DIMENSION_HOURS[form.workDimension] ?? 8
    const newStart = shiftHour(h, -hours)
    setForm((f) => ({ ...f, endHour: h, startHour: newStart }))
  }

  // Dimension changed → keep start, recalculate end
  function handleDimensionChange(d: WorkDimension) {
    const hours = DIMENSION_HOURS[d] ?? 8
    const newEnd = shiftHour(form.startHour, hours)
    setForm((f) => ({ ...f, workDimension: d, endHour: newEnd }))
  }

  const birthdate = parsePeselBirthdate(form.pesel)
  const overnight = isOvernight(form.startHour, form.endHour)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isEdit && !isDirty) return
    saveEmployee({ ...form, contractType: ContractType.EmploymentContract }, editingEmployee?.id)
  }

  if (!isAddEditModalOpen) return null

  return (
    // z-[60] so inner z-[50] dropdowns float above the footer but below any higher-priority overlay
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      style={{ backdropFilter: 'blur(6px)', backgroundColor: 'oklch(0 0 0 / 40%)' }}
    >
      <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-border shrink-0">
          <h2 className="text-base font-semibold text-foreground">
            {isEdit ? 'Edytuj pracownika' : 'Dodaj pracownika'}
          </h2>
          <button
            onClick={closeAddEditModal}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Zamknij"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form body — no scroll, all rows visible at once */}
        <form id="employee-form" onSubmit={handleSubmit} className="px-6 py-5">
          <div className="flex flex-col gap-5">

            {/* Row 1: Imię + Nazwisko */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Imię</label>
                <input
                  type="text"
                  value={form.firstName}
                  onChange={(e) => set('firstName', e.target.value)}
                  required
                  className="h-9 px-3 rounded-lg border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Nazwisko</label>
                <input
                  type="text"
                  value={form.lastName}
                  onChange={(e) => set('lastName', e.target.value)}
                  required
                  className="h-9 px-3 rounded-lg border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
                />
              </div>
            </div>

            {/* Row 2: PESEL + Birthdate */}
            <div className="grid grid-cols-2 gap-4 items-end">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted-foreground">PESEL</label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={11}
                  value={form.pesel}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, '')
                    set('pesel', v)
                  }}
                  className="h-9 px-3 rounded-lg border border-input bg-background text-sm text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Data urodzenia</label>
                <div className="h-9 px-3 flex items-center rounded-lg border border-border bg-muted/30 text-sm text-muted-foreground select-none">
                  {form.pesel.length >= 6 ? birthdate : '—'}
                </div>
              </div>
            </div>

            {/* Row 3: Typ umowy + Wymiar pracy + Godzina rozpoczęcia + Godzina zakończenia */}
            <div className="grid grid-cols-4 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Typ umowy</label>
                <div className="h-9 px-3 flex items-center rounded-lg border border-border bg-muted/30 text-sm text-muted-foreground select-none">
                  {CONTRACT_TYPE_LABELS[ContractType.EmploymentContract]}
                </div>
              </div>

              <DimensionSelect value={form.workDimension} onChange={handleDimensionChange} />

              <HourPicker
                value={form.startHour}
                onChange={handleStartChange}
                label="Godzina rozpoczęcia"
                hint={overnight ? 'Zmiana nocna' : undefined}
              />
              <HourPicker
                value={form.endHour}
                onChange={handleEndChange}
                label="Godzina zakończenia"
              />
            </div>

            {/* Row 4: Lokalizacja + Stanowisko + Firma */}
            <div className="grid grid-cols-3 gap-4">
              {/* Lokalizacja segmented control — full bounding-box clickable */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Lokalizacja</label>
                <div className="flex h-9 rounded-lg border border-input bg-muted/30 p-0.5">
                  {(['Biuro', 'Hala'] as Location[]).map((loc) => (
                    // onClick on outer button covers the entire cell area including icon padding
                    <button
                      key={loc}
                      type="button"
                      onClick={() => set('location', loc)}
                      className={`flex-1 flex items-center justify-center gap-1.5 rounded-md text-xs font-medium transition-all select-none ${
                        form.location === loc
                          ? 'bg-card shadow-sm text-foreground'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                      aria-pressed={form.location === loc}
                    >
                      {loc === 'Biuro' ? <Building2 size={13} /> : <Settings2 size={13} />}
                      {loc}
                    </button>
                  ))}
                </div>
              </div>

              <AutocompleteInput
                label="Stanowisko"
                value={form.position}
                onChange={(v) => set('position', v)}
                suggestions={POSITION_SUGGESTIONS}
                placeholder="np. Brygadzista"
              />

              {/* Firma — native select with explicit chevron overlay */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Firma / Byt prawny</label>
                <div className="relative">
                  <select
                    value={form.company}
                    onChange={(e) => set('company', e.target.value as Company)}
                    className="h-9 w-full pl-3 pr-8 rounded-lg border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition appearance-none cursor-pointer"
                  >
                    {COMPANIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                </div>
              </div>
            </div>

          </div>
        </form>

        {/* Footer action — always visible, never hidden behind content */}
        <div className="px-6 pb-5 pt-3 border-t border-border shrink-0">
          <button
            type="submit"
            form="employee-form"
            disabled={isEdit && !isDirty}
            className={`w-full h-11 rounded-lg text-sm font-semibold transition-all ${
              isEdit && !isDirty
                ? 'bg-muted text-muted-foreground cursor-not-allowed'
                : 'bg-primary text-primary-foreground hover:opacity-90 active:scale-[0.99] shadow-sm'
            }`}
          >
            {isEdit ? 'Aktualizuj' : 'Utwórz'}
          </button>
        </div>
      </div>
    </div>
  )
}
