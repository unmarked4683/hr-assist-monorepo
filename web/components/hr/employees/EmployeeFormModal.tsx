'use client'

import { useState, useEffect } from 'react'
import { Building2, Settings2 } from 'lucide-react'
import { useApp } from '../AppContext'
import { Modal, ModalHeader, ModalFooter } from '../shared/Modal'
import {
  ContractType,
  WorkDimension,
  Location,
  Company,
  Employee,
  parsePeselBirthdate,
  DIMENSION_HOURS,
} from '@/lib/hr-data'
import {
  FormSelect,
  HourPicker,
  AutocompleteInput,
  DimensionSelect,
  shiftHour,
  isOvernight,
} from './employee-form-controls'

const EMPLOYMENT_CONTRACT: ContractType = 'Umowa o pracę'
const CONTRACT_TYPE_OPTIONS: { value: ContractType; label: string }[] = [
  { value: EMPLOYMENT_CONTRACT, label: EMPLOYMENT_CONTRACT },
]
const COMPANY_OPTIONS: { value: Company; label: string }[] = [
  { value: 'Spółka Produkcja', label: 'Spółka Produkcja' },
  { value: 'Spółka Serwis', label: 'Spółka Serwis' },
  { value: 'Spółka Marka Własna', label: 'Spółka Marka Własna' },
]
const POSITION_SUGGESTIONS = ['Brygadzista', 'Specjalista', 'Kierownik', 'Pracownik', 'Operator', 'Technik', 'Analityk', 'Manager']

function buildInitial(emp?: Employee | null) {
  return {
    firstName: emp?.firstName ?? '',
    lastName: emp?.lastName ?? '',
    pesel: emp?.pesel ?? '',
    contractType: EMPLOYMENT_CONTRACT,
    workDimension: (emp?.workDimension ?? '1') as WorkDimension,
    startHour: emp?.startHour ?? '08:00',
    endHour: emp?.endHour ?? '16:00',
    location: (emp?.location ?? 'Biuro') as Location,
    position: emp?.position ?? '',
    company: (emp?.company ?? 'Spółka Produkcja') as Company,
  }
}

export function EmployeeFormModal() {
  const { isEmployeeFormOpen, editingEmployee, closeEmployeeForm, saveEmployee } = useApp()
  const isEdit = !!editingEmployee

  const [form, setForm] = useState(buildInitial(editingEmployee))
  const [initialSnapshot, setInitialSnapshot] = useState(buildInitial(editingEmployee))

  useEffect(() => {
    if (isEmployeeFormOpen) {
      const init = buildInitial(editingEmployee)
      setForm(init)
      setInitialSnapshot(init)
    }
  }, [isEmployeeFormOpen, editingEmployee])

  const isDirty = JSON.stringify(form) !== JSON.stringify(initialSnapshot)

  function set<K extends keyof typeof form>(key: K, val: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: val }))
  }

  function handleStartChange(h: string) {
    const hours = DIMENSION_HOURS[form.workDimension] ?? 8
    setForm((f) => ({ ...f, startHour: h, endHour: shiftHour(h, hours) }))
  }

  function handleEndChange(h: string) {
    const hours = DIMENSION_HOURS[form.workDimension] ?? 8
    setForm((f) => ({ ...f, endHour: h, startHour: shiftHour(h, -hours) }))
  }

  function handleDimensionChange(d: WorkDimension) {
    const hours = DIMENSION_HOURS[d] ?? 8
    setForm((f) => ({ ...f, workDimension: d, endHour: shiftHour(form.startHour, hours) }))
  }

  const birthdate = parsePeselBirthdate(form.pesel)
  const overnight = isOvernight(form.startHour, form.endHour)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isEdit && !isDirty) return
    saveEmployee({ ...form, contractType: EMPLOYMENT_CONTRACT }, editingEmployee?.id)
  }

  return (
    <Modal open={isEmployeeFormOpen} maxWidth="max-w-2xl" zIndex="z-[60]">
      <ModalHeader
        title={isEdit ? 'Edytuj pracownika' : 'Dodaj pracownika'}
        onClose={closeEmployeeForm}
        className="px-6 pt-5 pb-4"
      />

      <form id="employee-form" onSubmit={handleSubmit} className="px-6 py-5 overflow-visible relative z-0">
        <div className="flex flex-col gap-5">
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

          <div className="grid grid-cols-2 gap-4 items-end">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-muted-foreground">PESEL</label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={11}
                value={form.pesel}
                onChange={(e) => set('pesel', e.target.value.replace(/\D/g, ''))}
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

          <div className="grid grid-cols-[minmax(11.5rem,1.35fr)_1fr_0.9fr_0.9fr] gap-3">
            <FormSelect
              label="Typ umowy"
              value={form.contractType}
              options={CONTRACT_TYPE_OPTIONS}
              onChange={(value) => set('contractType', value)}
              locked
            />

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

          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Lokalizacja</label>
              <div className="flex h-9 rounded-lg border border-input bg-muted/30 p-0.5">
                {(['Biuro', 'Hala'] as Location[]).map((loc) => (
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

            <FormSelect
              label="Firma / Byt prawny"
              value={form.company}
              options={COMPANY_OPTIONS}
              onChange={(value) => set('company', value)}
            />
          </div>
        </div>
      </form>

      <ModalFooter className="px-6 pb-5 pt-3 border-t border-border">
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
      </ModalFooter>
    </Modal>
  )
}
