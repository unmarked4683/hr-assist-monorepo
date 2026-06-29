"use client";

import {
  getDaysInMonth,
  getDayOfWeek,
  getTodayIsoDate,
  isWeekend,
  toIsoDate,
} from "@/lib/domain/dates";
import { calcShiftHours } from "@/lib/domain/shift";
import {
  getRealHours,
  getRowStatus,
  isDayAbsent,
} from "@/lib/domain/attendance";
import type { Employee, IsoDate } from "@/lib/types";
import { AttendanceStatusBadge } from "../shared/AttendanceStatusBadge";
import { TodayDayCell } from "../shared/TodayDayCell";

interface TimesheetTableProps {
  employee: Employee;
  month: number;
  year: number;
  onDayClick: (date: IsoDate) => void;
}

export const TimesheetTable = ({
  employee,
  month,
  year,
  onDayClick,
}: TimesheetTableProps) => {
  const daysCount = getDaysInMonth(year, month);
  const todayStr = getTodayIsoDate();
  const nomHours = `${calcShiftHours(employee.startHour, employee.endHour)}h`;

  const days = Array.from({ length: daysCount }, (_, index) => {
    const day = index + 1;
    const dateStr = toIsoDate(year, month, day);
    const weekend = isWeekend(year, month, day);
    const isToday = dateStr === todayStr;
    const isFuture = dateStr > todayStr;
    const rowStatus = weekend
      ? null
      : getRowStatus(dateStr, employee, todayStr);
    return { day, dateStr, weekend, rowStatus, isToday, isFuture };
  });

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden flex-1 min-h-0 flex flex-col">
      <table className="w-full text-sm table-fixed shrink-0">
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
            {["Dz.", "Tyg.", "Godziny pracy", "Nom.", "Real.", "Status"].map(
              (label) => (
                <th
                  key={label}
                  className="text-center px-3 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide"
                >
                  {label}
                </th>
              ),
            )}
          </tr>
        </thead>
      </table>

      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent">
        <table className="w-full text-sm table-fixed">
          <colgroup>
            <col className="w-12" />
            <col className="w-12" />
            <col className="w-32" />
            <col className="w-24" />
            <col className="w-24" />
            <col className="w-24" />
          </colgroup>
          <tbody className="hr-table-zebra">
            {days.map(
              ({ day, dateStr, weekend, rowStatus, isToday, isFuture }) => {
                const isAbsent = !weekend && isDayAbsent(dateStr, employee);

                return (
                  <tr
                    key={dateStr}
                    onClick={() => !weekend && onDayClick(dateStr)}
                    className={[
                      "hr-table-row",
                      weekend
                        ? "text-muted-foreground cursor-default"
                        : "hr-table-row-clickable",
                      isFuture && !weekend && "text-muted-foreground/60",
                      isAbsent && "animate-pulse-red-row",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    {isToday ? (
                      <TodayDayCell day={day} />
                    ) : (
                      <td className="px-3 py-2.5 text-center font-medium tabular-nums">
                        {day}
                      </td>
                    )}
                    <td className="px-3 py-2.5 text-center">
                      {getDayOfWeek(year, month, day)}
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
                      {weekend ? "—" : getRealHours(dateStr, employee)}
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      {weekend ? (
                        <span className="text-xs text-muted-foreground/60 italic">
                          —
                        </span>
                      ) : (
                        rowStatus && (
                          <AttendanceStatusBadge
                            variant="table"
                            status={rowStatus}
                          />
                        )
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
  );
};
