"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useApp } from "./AppContext";
import {
  DayStatus,
  DAY_STATUS_GROUPS,
  DAY_STATUS_GROUP_LABELS,
  formatPolishDate,
  getDayStatusLabel,
  isPresent,
  calcShiftHours,
  Employee,
} from "@/lib/hr-data";

export function DayEditModal({ employee }: { employee: Employee }) {
  const { isDayEditModalOpen, editingDate, closeDayEditModal, saveDayRecord } =
    useApp();

  const existing = editingDate
    ? (employee.dayRecords.find((d) => d.date === editingDate)?.status ??
      DayStatus.Present)
    : DayStatus.Present;

  const [status, setStatus] = useState<DayStatus>(existing);

  useEffect(() => {
    if (isDayEditModalOpen && editingDate) {
      const s = employee.dayRecords.find((d) => d.date === editingDate)?.status;
      setStatus(s ?? DayStatus.Present);
    }
  }, [isDayEditModalOpen, editingDate, employee.dayRecords]);

  if (!isDayEditModalOpen || !editingDate) return null;

  const [yearStr, monthStr, dayStr] = editingDate.split("-");
  const day = parseInt(dayStr, 10);
  const month = parseInt(monthStr, 10);
  const year = parseInt(yearStr, 10);
  const dateDisplay = formatPolishDate(day, month, year);

  const hoursDisplay = isPresent(status)
    ? `Godziny pracy: ${employee.startHour} - ${employee.endHour} (Realny czas: ${calcShiftHours(employee.startHour, employee.endHour)}h)`
    : "Godziny pracy: Brak (Realny czas: 0h)";

  const handleSave = () => {
    saveDayRecord(employee.id, editingDate, status);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backdropFilter: "blur(6px)",
        backgroundColor: "oklch(0 0 0 / 40%)",
      }}
    >
      <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden">
        <div className="flex items-center justify-end px-5 pt-4 pb-2 shrink-0">
          <button
            onClick={closeDayEditModal}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Zamknij"
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-6 pb-2 flex flex-col gap-5">
          <h2 className="text-xl font-bold text-foreground text-center">
            {dateDisplay}
          </h2>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-muted-foreground">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as DayStatus)}
              className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition appearance-none cursor-pointer"
            >
              {DAY_STATUS_GROUPS.map(({ groupKey, statuses }) => (
                <optgroup
                  key={groupKey}
                  label={DAY_STATUS_GROUP_LABELS[groupKey]}
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {getDayStatusLabel(s)}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          <div className="px-3 py-2.5 rounded-lg bg-muted/50 border border-border">
            <p className="text-sm text-muted-foreground">{hoursDisplay}</p>
          </div>
        </div>

        <div className="px-6 pb-6 pt-4 shrink-0">
          <button
            onClick={handleSave}
            className="w-full h-11 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 active:scale-[0.99] transition-all shadow-sm"
          >
            Aktualizuj
          </button>
        </div>
      </div>
    </div>
  );
}
