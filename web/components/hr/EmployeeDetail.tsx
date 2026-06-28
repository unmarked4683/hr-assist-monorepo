"use client";

import { ChevronLeft, ChevronRight, Pencil, FileText } from "lucide-react";
import { useApp } from "./AppContext";
import { Sidebar } from "./Sidebar";
import { DayEditModal } from "./DayEditModal";
import { ReportModal } from "./ReportModal";
import {
  Employee,
  getDaysInMonth,
  getDayOfWeek,
  isWeekend,
  MONTH_NAMES_NOM,
  DayStatus,
  calcShiftHours,
} from "@/lib/hr-data";

type RowStatus =
  | { type: "ok" }
  | { type: "absent" }
  | { type: "leave"; label: string }
  | { type: "future" };

// dateStr must be 'YYYY-MM-DD'; todayStr is the same format
function getRowStatus(
  dateStr: string,
  employee: Employee,
  todayStr: string,
): RowStatus {
  // Future days have not occurred — never assign a worked status
  if (dateStr > todayStr) return { type: "future" };
  const record = employee.dayRecords.find((d) => d.date === dateStr);
  // Past/today with no record or explicit "Obecność" — nominal working day, OK
  if (!record || !record.status || record.status === "Obecność")
    return { type: "ok" };
  if (record.status === "Nieobecność nieusprawiedliwiona")
    return { type: "absent" };
  return { type: "leave", label: record.status };
}

function StatusCell({ status }: { status: RowStatus }) {
  if (status.type === "future") {
    return (
      <span className="inline-flex items-center justify-center text-muted-foreground/50 text-sm select-none">
        —
      </span>
    );
  }
  if (status.type === "ok") {
    return (
      <span className="inline-flex items-center justify-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-[oklch(0.52_0.17_145)] dark:bg-[oklch(0.6_0.17_145)] shrink-0" />
        <span className="text-[oklch(0.52_0.17_145)] dark:text-[oklch(0.6_0.17_145)] font-bold text-xs tracking-widest">
          OK
        </span>
      </span>
    );
  }
  if (status.type === "absent") {
    return (
      <span className="relative inline-flex items-center justify-center gap-1.5 group">
        <span className="w-2 h-2 rounded-full bg-[oklch(0.53_0.22_25)] shrink-0" />
        <span className="text-[oklch(0.53_0.22_25)] dark:text-[oklch(0.62_0.22_25)] font-bold text-xs tracking-widest">
          NN
        </span>
        {/* Tooltip */}
        <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 whitespace-nowrap rounded-md border border-border bg-popover px-2.5 py-1 text-xs text-popover-foreground shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-50">
          Nieobecność nieusprawiedliwiona
        </span>
      </span>
    );
  }
  if (status.type === "leave") {
    return (
      <span className="relative inline-flex items-center justify-center gap-1.5 group">
        <span className="w-2 h-2 rounded-full bg-[oklch(0.72_0.17_70)] shrink-0" />
        <span className="text-[oklch(0.65_0.14_70)] dark:text-[oklch(0.78_0.17_70)] font-bold text-xs tracking-widest">
          USP
        </span>
        {/* Tooltip */}
        <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 whitespace-nowrap rounded-md border border-border bg-popover px-2.5 py-1 text-xs text-popover-foreground shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-50">
          {status.label}
        </span>
      </span>
    );
  }
}

function getRealTime(dateStr: string, employee: Employee): string {
  const record = employee.dayRecords.find((d) => d.date === dateStr);
  if (!record || !record.status || record.status === "Obecność") {
    return `${calcShiftHours(employee.startHour, employee.endHour)}h`;
  }
  return "0h";
}

export function EmployeeDetail({ employee }: { employee: Employee }) {
  const {
    setScreen,
    openEditModal,
    openReportModal,
    openDayEditModal,
    timesheetMonth,
    timesheetYear,
    setTimesheetPeriod,
    isDayEditModalOpen,
    isReportModalOpen,
  } = useApp();

  function prevMonth() {
    if (timesheetMonth === 1) setTimesheetPeriod(12, timesheetYear - 1);
    else setTimesheetPeriod(timesheetMonth - 1, timesheetYear);
  }

  function nextMonth() {
    if (timesheetMonth === 12) setTimesheetPeriod(1, timesheetYear + 1);
    else setTimesheetPeriod(timesheetMonth + 1, timesheetYear);
  }

  const daysCount = getDaysInMonth(timesheetYear, timesheetMonth);

  // Compute today once — compare as ISO date strings (lexicographic order = chronological order)
  const todayDate = new Date();
  const todayStr = `${todayDate.getFullYear()}-${String(todayDate.getMonth() + 1).padStart(2, "0")}-${String(todayDate.getDate()).padStart(2, "0")}`;

  const days = Array.from({ length: daysCount }, (_, i) => {
    const d = i + 1;
    const dateStr = `${timesheetYear}-${String(timesheetMonth).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const weekend = isWeekend(timesheetYear, timesheetMonth, d);
    const isToday = dateStr === todayStr;
    const isFuture = dateStr > todayStr;
    const rowStatus = weekend
      ? null
      : getRowStatus(dateStr, employee, todayStr);
    return { d, dateStr, weekend, rowStatus, isToday, isFuture };
  });

  const isRowAbsent = (dateStr: string) => {
    const r = employee.dayRecords.find((x) => x.date === dateStr);
    return r?.status === "Nieobecność nieusprawiedliwiona";
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center gap-3 px-6 py-4 border-b border-border bg-card shrink-0">
          <button
            onClick={() => setScreen("dashboard")}
            className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft size={16} />
            Powrót do listy
          </button>
        </header>

        <div className="flex-1 min-h-0 overflow-hidden px-6 py-5 flex flex-col gap-5">
          {/* Profile Card */}
          <div className="bg-card border border-border rounded-xl p-5 shadow-sm shrink-0">
            <div className="flex items-start justify-between gap-4">
              {/* Meta — strict 4-row × 2-col grid */}
              <div className="grid grid-cols-2 gap-x-10 gap-y-3.5 flex-1">
                {/* Row 1: Name | PESEL */}
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

                {/* Row 2: Stanowisko | Lokalizacja badge */}
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">
                    Stanowisko
                  </p>
                  <p className="text-sm text-foreground">{employee.position}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">
                    Lokalizacja
                  </p>
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

                {/* Row 3: Wymiar pracy | Godziny pracy range */}
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">
                    Wymiar pracy
                  </p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground border border-border">
                    {employee.workDimension}
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

                {/* Row 4: Firma (left only) */}
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">
                    Firma / Byt prawny
                  </p>
                  <p className="text-sm text-foreground">{employee.company}</p>
                </div>
                {/* right cell intentionally empty to keep grid symmetric */}
                <div />
              </div>

              {/* Action buttons */}
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
                  onClick={() => openEditModal(employee)}
                  className="w-9 h-9 flex items-center justify-center rounded-lg border border-border hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Edytuj pracownika"
                  title="Edytuj pracownika"
                >
                  <Pencil size={16} />
                </button>
              </div>
            </div>

            {/* Period selector */}
            <div className="mt-4 pt-4 border-t border-border flex items-center gap-2">
              <button
                onClick={prevMonth}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-border hover:bg-accent text-foreground transition-colors"
                aria-label="Poprzedni miesiąc"
              >
                <ChevronLeft size={15} />
              </button>

              <select
                value={timesheetMonth}
                onChange={(e) =>
                  setTimesheetPeriod(
                    parseInt(e.target.value, 10),
                    timesheetYear,
                  )
                }
                className="h-8 px-2 rounded-lg border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition appearance-none cursor-pointer"
              >
                {MONTH_NAMES_NOM.map((name, idx) => (
                  <option key={idx + 1} value={idx + 1}>
                    {name}
                  </option>
                ))}
              </select>

              <select
                value={timesheetYear}
                onChange={(e) =>
                  setTimesheetPeriod(
                    timesheetMonth,
                    parseInt(e.target.value, 10),
                  )
                }
                className="h-8 px-2 rounded-lg border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition appearance-none cursor-pointer"
              >
                {Array.from({ length: 10 }, (_, i) => 2026 + i).map((y) => (
                  <option key={y}>{y}</option>
                ))}
              </select>

              <button
                onClick={nextMonth}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-border hover:bg-accent text-foreground transition-colors"
                aria-label="Następny miesiąc"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>

          {/* Timesheet table */}
          <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
            {/* Static header row — never scrolls */}
            <table className="w-full text-sm table-fixed">
              <colgroup>
                <col className="w-12" />
                <col className="w-12" />
                <col className="w-32" />
                <col className="w-24" />
                <col className="w-24" />
                <col className="w-24" />
              </colgroup>
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-center px-3 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide">
                    Dz.
                  </th>
                  <th className="text-center px-3 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide">
                    Tyg.
                  </th>
                  <th className="text-center px-3 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide">
                    Godziny pracy
                  </th>
                  <th className="text-center px-3 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide">
                    Nom.
                  </th>
                  <th className="text-center px-3 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide">
                    Real.
                  </th>
                  <th className="text-center px-3 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide">
                    Status
                  </th>
                </tr>
              </thead>
            </table>

            {/* Scrollable rows — strictly bounded, only this block scrolls */}
            <div className="h-[calc(100vh-460px)] overflow-y-auto pb-8 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent">
              <table className="w-full text-sm table-fixed">
                <colgroup>
                  <col className="w-12" />
                  <col className="w-12" />
                  <col className="w-32" />
                  <col className="w-24" />
                  <col className="w-24" />
                  <col className="w-24" />
                </colgroup>
                <tbody>
                  {days.map(
                    (
                      { d, dateStr, weekend, rowStatus, isToday, isFuture },
                      i,
                    ) => {
                      const isAbsent = !weekend && isRowAbsent(dateStr);
                      const nomHours = `${calcShiftHours(employee.startHour, employee.endHour)}h`;

                      return (
                        <tr
                          key={dateStr}
                          onClick={() => !weekend && openDayEditModal(dateStr)}
                          className={`
                          border-b border-border last:border-0 transition-colors
                          ${isToday ? "border-l-4 border-l-red-500" : ""}
                          ${
                            weekend
                              ? "bg-muted/20 text-muted-foreground cursor-default"
                              : isAbsent
                                ? "animate-pulse-red-row cursor-pointer hover:bg-primary/5"
                                : isFuture
                                  ? "bg-muted/10 text-muted-foreground/60 cursor-pointer hover:bg-muted/20"
                                  : i % 2 === 0
                                    ? "bg-card cursor-pointer hover:bg-primary/5"
                                    : "bg-muted/20 cursor-pointer hover:bg-primary/5"
                          }
                        `}
                        >
                          <td className="px-3 py-2.5 text-center font-medium tabular-nums">
                            <span className="inline-flex items-center justify-center gap-1">
                              {d}
                              {isToday && (
                                <span className="text-[10px] font-bold leading-none px-1 py-0.5 rounded bg-red-500 text-white tracking-wide">
                                  DZIŚ
                                </span>
                              )}
                            </span>
                          </td>
                          <td className="px-3 py-2.5 text-center">
                            {getDayOfWeek(timesheetYear, timesheetMonth, d)}
                          </td>
                          <td className="px-3 py-2.5 text-center tabular-nums">
                            {weekend ? (
                              <span className="text-xs text-muted-foreground/60 italic">
                                wolne
                              </span>
                            ) : (
                              `${employee.startHour} – ${employee.endHour}`
                            )}
                          </td>
                          <td className="px-3 py-2.5 text-center tabular-nums">
                            {weekend ? "—" : nomHours}
                          </td>
                          <td className="px-3 py-2.5 text-center tabular-nums">
                            {weekend ? "—" : getRealTime(dateStr, employee)}
                          </td>
                          <td className="px-3 py-2.5 text-center">
                            {weekend ? (
                              <span className="text-xs text-muted-foreground/60 italic">
                                —
                              </span>
                            ) : (
                              <StatusCell status={rowStatus!} />
                            )}
                          </td>
                        </tr>
                      );
                    },
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {isDayEditModalOpen && <DayEditModal employee={employee} />}
      {isReportModalOpen && <ReportModal />}
    </div>
  );
}
