"use client";

import { Pencil, FileText } from "lucide-react";
import { Employee } from "@/lib/hr-data";
import { useApp } from "../AppContext";
import { MonthYearPicker } from "../shared/MonthYearPicker";

interface EmployeeProfileCardProps {
  employee: Employee;
  month: number;
  year: number;
  onPeriodChange: (month: number, year: number) => void;
}

export function EmployeeProfileCard({
  employee,
  month,
  year,
  onPeriodChange,
}: EmployeeProfileCardProps) {
  const { openEditEmployeeForm, openReportModal } = useApp();

  return (
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
                employee.location === "Biuro"
                  ? "bg-primary/10 text-primary border-primary/25"
                  : "bg-[oklch(0.72_0.17_70)]/10 text-[oklch(0.58_0.16_70)] dark:text-[oklch(0.78_0.17_70)] border-[oklch(0.72_0.17_70)]/25"
              }`}
            >
              {employee.location}
            </span>
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-0.5">Wymiar pracy</p>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground border border-border">
              {/* {employee.workDimension} */}
              {employee.workDimension === "1"
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
            <p className="text-sm text-foreground">{employee.company}</p>
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
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <MonthYearPicker
          month={month}
          year={year}
          onChange={onPeriodChange}
          compact
        />
      </div>
    </div>
  );
}
