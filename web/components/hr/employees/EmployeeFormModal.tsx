'use client'

import { useState, useEffect } from 'react'
import { Building2, Settings2 } from 'lucide-react'
import { useApp } from '../AppContext'
import { Modal, ModalHeader, ModalFooter } from '../shared/Modal'
import {
  COMPANY_OPTIONS,
  DIMENSION_HOURS,
  EMPLOYMENT_CONTRACT,
  CONTRACT_TYPE_OPTIONS,
  LOCATIONS,
  POSITION_SUGGESTIONS,
} from '@/lib/constants/employee'
import { parsePeselBirthdate } from '@/lib/domain/pesel'
import { isOvernight, shiftHour } from '@/lib/domain/shift'
import type { Company, Employee, EmployeeInput, Location, WorkDimension } from '@/lib/types'
import { FormSelect, HourPicker, AutocompleteInput, DimensionSelect } from './employee-form-controls'

type EmployeeFormState = EmployeeInput

const buildInitial = (employee?: Employee | null): EmployeeFormState => ({
  firstName: employee?.firstName ?? '',
  lastName: employee?.lastName ?? '',
  pesel: employee?.pesel ?? '',
  contractType: EMPLOYMENT_CONTRACT,
  workDimension: employee?.workDimension ?? '1',
  startHour: employee?.startHour ?? '08:00',
  endHour: employee?.endHour ?? '16:00',
  location: employee?.location ?? 'Biuro',
  position: employee?.position ?? '',
  company: employee?.company ?? 'Spółka Produkcja',
})

export const EmployeeFormModal = () => {
  const { isEmployeeFormOpen, editingEmployee, closeEmployeeForm, saveEmployee } = useApp()
  const isEdit = Boolean(editingEmployee)

  const [form, setForm] = useState<EmployeeFormState>(() => buildInitial(editingEmployee))
  const [initialSnapshot, setInitialSnapshot] = useState<EmployeeFormState>(() =>
    buildInitial(editingEmployee),
  )

  useEffect(() => {
    if (!isEmployeeFormOpen) return
    const initial = buildInitial(editingEmployee)
    setForm(initial)
    setInitialSnapshot(initial)
  }, [isEmployeeFormOpen, editingEmployee])

  const isDirty = JSON.stringify(form) !== JSON.stringify(initialSnapshot)

  const setField = <K extends keyof EmployeeFormState>(key: K, value: EmployeeFormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }))
  }

  const handleStartChange = (hour: string) => {
    const hours = DIMENSION_HOURS[form.workDimension] ?? 8
    setForm((current) => ({ ...current, startHour: hour, endHour: shiftHour(hour, hours) }))
  }

  const handleEndChange = (hour: string) => {
    const hours = DIMENSION_HOURS[form.workDimension] ?? 8
    setForm((current) => ({ ...current, endHour: hour, startHour: shiftHour(hour, -hours) }))
  }

  const handleDimensionChange = (dimension: WorkDimension) => {
    const hours = DIMENSION_HOURS[dimension] ?? 8
    setForm((current) => ({
      ...current,
      workDimension: dimension,
      endHour: shiftHour(current.startHour, hours),
    }))
  }

  const birthdate = parsePeselBirthdate(form.pesel)
  const overnight = isOvernight(form.startHour, form.endHour)

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (isEdit && !isDirty) return
    void saveEmployee({ ...form, contractType: EMPLOYMENT_CONTRACT }, editingEmployee?.id)
  }

  return (
    <Modal open={isEmployeeFormOpen} onClose={closeEmployeeForm} maxWidth="max-w-2xl" zIndex="z-[60]">
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
                onChange={(event) => setField('firstName', event.target.value)}
                required
                className="h-9 px-3 rounded-lg border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Nazwisko</label>
              <input
                type="text"
                value={form.lastName}
                onChange={(event) => setField('lastName', event.target.value)}
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
                onChange={(event) => setField('pesel', event.target.value.replace(/\D/g, ''))}
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
              onChange={(value) => setField('contractType', value)}
              locked
            />
            <DimensionSelect value={form.workDimension} onChange={handleDimensionChange} />
            <HourPicker
              value={form.startHour}
              onChange={handleStartChange}
              label="Godzina rozpoczęcia"
              hint={overnight ? 'Zmiana nocna' : undefined}
            />
            <HourPicker value={form.endHour} onChange={handleEndChange} label="Godzina zakończenia" />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Lokalizacja</label>
              <div className="flex h-9 rounded-lg border border-input bg-muted/30 p-0.5">
                {LOCATIONS.map((location) => (
                  <button
                    key={location}
                    type="button"
                    onClick={() => setField('location', location as Location)}
                    className={`flex-1 flex items-center justify-center gap-1.5 rounded-md text-xs font-medium transition-all select-none ${
                      form.location === location
                        ? 'bg-card shadow-sm text-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                    aria-pressed={form.location === location}
                  >
                    {location === 'Biuro' ? <Building2 size={13} /> : <Settings2 size={13} />}
                    {location}
                  </button>
                ))}
              </div>
            </div>

            <AutocompleteInput
              label="Stanowisko"
              value={form.position}
              onChange={(value) => setField('position', value)}
              suggestions={POSITION_SUGGESTIONS}
              placeholder="np. Brygadzista"
            />

            <FormSelect<Company>
              label="Firma / Byt prawny"
              value={form.company}
              options={COMPANY_OPTIONS}
              onChange={(value) => setField('company', value)}
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
