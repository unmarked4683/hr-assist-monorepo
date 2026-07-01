"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, FileText, Trash2 } from "lucide-react";
import {
  type Employee,
  Location,
  getLocationLabel,
  isFullWorkDimension,
} from '@hr-assist/shared'
import { useApp, useEmployees } from "../AppContext";
import { MonthYearPicker } from "../shared/MonthYearPicker";
import { EmployeeDeleteConfirmModal } from "./EmployeeDeleteConfirmModal";
import { UnexcusedAbsenceBell } from "./UnexcusedAbsenceBell";
import type { IsoDate } from "@hr-assist/shared";

interface EmployeeProfileCardProps {
  employee: Employee;
  month: number;
  year: number;
  onPeriodChange: (month: number, year: number) => void;
  onGoToToday: () => void;
  onUnexcusedAbsenceSelect: (date: IsoDate) => void;
  absenceRefreshToken: string;
}

export function EmployeeProfileCard({
  employee,
  month,
  year,
  onPeriodChange,
  onGoToToday,
  onUnexcusedAbsenceSelect,
  absenceRefreshToken,
}: EmployeeProfileCardProps) {
  const router = useRouter();
  const { openEditEmployeeForm, openReportModal, deleteEmployee } = useApp();
  const { getCompanyName } = useEmployees();
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const employeeName = `${employee.firstName} ${employee.lastName}`;

  const handleConfirmDelete = () => {
    const employeeId = employee.id
    setIsDeleteConfirmOpen(false)
    router.replace("/employees")
    void deleteEmployee(employeeId)
  }

  return (
    <>
      <div className="bg-card border border-border rounded-xl p-5 shadow-sm shrink-0">
        <div className="flex items-start justify-between gap-4">
          <div className="grid grid-cols-2 gap-x-10 gap-y-3.5 flex-1">
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">
                Imię i Nazwisko
              </p>
              <p className="text-sm font-semibold text-foreground">
                {employee.firstName} {employee.lastName}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">PESEL</p>
              <p className="text-sm font-mono text-foreground tracking-wider">
                {employee.pesel || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Stanowisko</p>
              <p className="text-sm text-foreground">{employee.position}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Lokalizacja</p>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                  employee.location === Location.OFFICE
                    ? "bg-primary/10 text-primary border-primary/25"
                    : "bg-[oklch(0.72_0.17_70)]/10 text-[oklch(0.58_0.16_70)] dark:text-[oklch(0.78_0.17_70)] border-[oklch(0.72_0.17_70)]/25"
                }`}
              >
                {getLocationLabel(employee.location)}
              </span>
            </div>

            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Wymiar pracy</p>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground border border-border">
                {isFullWorkDimension(employee.workDimension)
                  ? "Pełny etat"
                  : employee.workDimension + " etatu"}
              </span>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">
                Godziny pracy
              </p>
              <p className="text-sm font-medium text-foreground tabular-nums">
                {employee.startHour}&thinsp;–&thinsp;{employee.endHour}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground mb-0.5">
                Firma / Byt prawny
              </p>
              <p className="text-sm text-foreground">{getCompanyName(employee.companyId)}</p>
            </div>
            <div />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => openReportModal()}
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-border hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Generuj raport"
              title="Generuj raport"
            >
              <FileText size={16} />
            </button>
            <button
              onClick={() => openEditEmployeeForm(employee)}
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-border hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Edytuj pracownika"
              title="Edytuj pracownika"
            >
              <Pencil size={16} />
            </button>
            <button
              onClick={() => setIsDeleteConfirmOpen(true)}
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-destructive hover:border-destructive hover:text-white"
              aria-label="Usuń pracownika"
              title="Usuń pracownika"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-border flex items-center justify-between gap-3">
          <MonthYearPicker
            month={month}
            year={year}
            onChange={onPeriodChange}
            onGoToToday={onGoToToday}
            compact
          />
          <UnexcusedAbsenceBell
            employeeId={employee.id}
            refreshToken={absenceRefreshToken}
            onSelectAbsence={onUnexcusedAbsenceSelect}
          />
        </div>
      </div>

      <EmployeeDeleteConfirmModal
        open={isDeleteConfirmOpen}
        employeeName={employeeName}
        onCancel={() => setIsDeleteConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
