'use client'

import { useState, useEffect } from 'react'
import { Building2, Settings2 } from 'lucide-react'
import { useApp } from '../AppContext'
import { Modal, ModalHeader, ModalFooter } from '../shared/Modal'
import { fetchPositionSuggestions } from '@/lib/api'
import { LOCAL_POSITION_SUGGESTION_SEED } from '@/lib/constants/form-seeds'
import { mergePositionSuggestions } from '@/lib/utils/position-suggestions'
import {
  ContractType,
  CONTRACT_TYPE_OPTIONS,
  getContractTypeLabel,
  Location,
  LOCATION_OPTIONS,
  getLocationLabel,
  WORK_DIMENSION,
  getWorkDimensionMinutes,
  parsePeselBirthdate,
  isOvernight,
  shiftTimeByMinutes,
  type Employee,
  type EmployeeInput,
  type WorkDimension,
} from '@hr-assist/shared'
import { FormSelect, HourPicker, AutocompleteInput, DimensionSelect } from './employee-form-controls'
import { EmployeeUpdateConfirmModal } from './EmployeeUpdateConfirmModal'

type EmployeeFormState = EmployeeInput

const buildInitial = (
  employee: Employee | null | undefined,
  defaultCompanyId: string,
): EmployeeFormState => ({
  firstName: employee?.firstName ?? '',
  lastName: employee?.lastName ?? '',
  pesel: employee?.pesel ?? '',
  contractType: employee?.contractType ?? ContractType.EMPLOYMENT,
  workDimension: employee?.workDimension ?? WORK_DIMENSION.FULL.fraction,
  startHour: employee?.startHour ?? '08:00',
  endHour: employee?.endHour ?? '16:00',
  location: employee?.location ?? Location.OFFICE,
  position: employee?.position ?? '',
  companyId: employee?.companyId ?? defaultCompanyId,
})

export const EmployeeFormModal = () => {
  const { isEmployeeFormOpen, editingEmployee, closeEmployeeForm, saveEmployee, companies } =
    useApp()
  const isEdit = Boolean(editingEmployee)
  const defaultCompanyId = companies[0]?.id ?? ''

  const [form, setForm] = useState<EmployeeFormState>(() =>
    buildInitial(editingEmployee, defaultCompanyId),
  )
  const [initialSnapshot, setInitialSnapshot] = useState<EmployeeFormState>(() =>
    buildInitial(editingEmployee, defaultCompanyId),
  )
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [positionSuggestions, setPositionSuggestions] = useState<string[]>([])

  useEffect(() => {
    if (!isEmployeeFormOpen) {
      setIsConfirmOpen(false)
      return
    }
    const initial = buildInitial(editingEmployee, defaultCompanyId)
    setForm(initial)
    setInitialSnapshot(initial)
  }, [defaultCompanyId, isEmployeeFormOpen, editingEmployee])

  useEffect(() => {
    if (!isEmployeeFormOpen) return

    const seed = mergePositionSuggestions(
      LOCAL_POSITION_SUGGESTION_SEED,
      editingEmployee?.position ? [editingEmployee.position] : [],
    )
    setPositionSuggestions(seed)

    void fetchPositionSuggestions().then((fresh) => {
      setPositionSuggestions((current) => mergePositionSuggestions(current, fresh))
    })
  }, [isEmployeeFormOpen, editingEmployee?.position])

  const isDirty = JSON.stringify(form) !== JSON.stringify(initialSnapshot)

  const setField = <K extends keyof EmployeeFormState>(key: K, value: EmployeeFormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }))
  }

  const handleStartChange = (hour: string) => {
    const minutes = getWorkDimensionMinutes(form.workDimension)
    setForm((current) => ({
      ...current,
      startHour: hour,
      endHour: shiftTimeByMinutes(hour, minutes),
    }))
  }

  const handleEndChange = (hour: string) => {
    const minutes = getWorkDimensionMinutes(form.workDimension)
    setForm((current) => ({
      ...current,
      endHour: hour,
      startHour: shiftTimeByMinutes(hour, -minutes),
    }))
  }

  const handleDimensionChange = (dimension: WorkDimension) => {
    const minutes = getWorkDimensionMinutes(dimension)
    setForm((current) => ({
      ...current,
      workDimension: dimension,
      endHour: shiftTimeByMinutes(current.startHour, minutes),
    }))
  }

  const birthdate = parsePeselBirthdate(form.pesel)
  const overnight = isOvernight(form.startHour, form.endHour)

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (isEdit && !isDirty) return
    if (isEdit) {
      setIsConfirmOpen(true)
      return
    }
    void saveEmployee({ ...form, contractType: ContractType.EMPLOYMENT }, editingEmployee?.id)
  }

  const handleConfirmSave = () => {
    const payload = { ...form, contractType: ContractType.EMPLOYMENT }
    const employeeId = editingEmployee?.id
    setIsConfirmOpen(false)
    closeEmployeeForm()
    void saveEmployee(payload, employeeId)
  }

  return (
    <>
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
              options={CONTRACT_TYPE_OPTIONS.map((option) => ({
                value: option,
                label: getContractTypeLabel(option),
              }))}
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
                {LOCATION_OPTIONS.map((location) => (
                  <button
                    key={location}
                    type="button"
                    onClick={() => setField('location', location)}
                    className={`flex-1 flex items-center justify-center gap-1.5 rounded-md text-xs font-medium transition-all select-none ${
                      form.location === location
                        ? 'bg-card shadow-sm text-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                    aria-pressed={form.location === location}
                  >
                    {location === Location.OFFICE ? <Building2 size={13} /> : <Settings2 size={13} />}
                    {getLocationLabel(location)}
                  </button>
                ))}
              </div>
            </div>

            <AutocompleteInput
              label="Stanowisko"
              value={form.position}
              onChange={(value) => setField('position', value)}
              suggestions={positionSuggestions}
              placeholder="np. Brygadzista"
            />

            <FormSelect
              label="Firma / Byt prawny"
              value={form.companyId}
              options={companies.map((company) => ({
                value: company.id,
                label: company.name,
              }))}
              onChange={(value) => setField('companyId', value)}
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

    <EmployeeUpdateConfirmModal
      open={isConfirmOpen}
      onCancel={() => setIsConfirmOpen(false)}
      onConfirm={handleConfirmSave}
    />
    </>
  )
}
