"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import {
  getDaysInMonth,
  getDayOfWeek,
  getTodayIsoDate,
  isWeekend,
  toIsoDate,
  calcShiftHours,
  getRealHours,
  getRowStatus,
  hasDayRecord,
  isDayAbsent,
  type Employee,
  type IsoDate,
} from "@hr-assist/shared";
import { AttendanceStatusBadge } from "../shared/AttendanceStatusBadge";
import { TodayDayCell } from "../shared/TodayDayCell";

interface TimesheetTableProps {
  employee: Employee;
  month: number;
  year: number;
  scrollToDate?: IsoDate | null;
  scrollRequestKey?: number;
  onScrollToDateComplete?: () => void;
  onDayClick: (date: IsoDate) => void;
}

function TimesheetColumnGroup() {
  return (
    <colgroup>
      <col className="w-[8%]" />
      <col className="w-[11%]" />
      <col className="w-[16%]" />
      <col className="w-[22%]" />
      <col className="w-[22%]" />
      <col className="w-[21%]" />
    </colgroup>
  );
}

const scrollRowToCenter = (container: HTMLElement, row: HTMLElement): void => {
  const rowRect = row.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();
  const targetTop =
    container.scrollTop +
    (rowRect.top - containerRect.top) -
    container.clientHeight / 2 +
    rowRect.height / 2;

  container.scrollTo({
    top: Math.max(0, targetTop),
    behavior: "auto",
  });
};

export const TimesheetTable = ({
  employee,
  month,
  year,
  scrollToDate = null,
  scrollRequestKey = 0,
  onScrollToDateComplete,
  onDayClick,
}: TimesheetTableProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<Map<string, HTMLTableRowElement>>(new Map());
  const suppressDefaultScrollRef = useRef(false);
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

  const hasTodayInView = days.some(({ isToday }) => isToday);

  const scrollRowIntoView = (date: IsoDate): boolean => {
    const container = scrollRef.current;
    const row = rowRefs.current.get(date);
    if (!container || !row) return false;

    scrollRowToCenter(container, row);
    return true;
  };

  useLayoutEffect(() => {
    if (!scrollToDate || scrollRequestKey === 0) return;

    let cancelled = false;
    let attempts = 0;
    let timeoutId = 0;

    const finish = () => {
      if (cancelled) return;
      suppressDefaultScrollRef.current = true;
      onScrollToDateComplete?.();
    };

    const tryScroll = () => {
      if (cancelled) return;

      if (scrollRowIntoView(scrollToDate)) {
        finish();
        return;
      }

      attempts += 1;
      if (attempts < 30) {
        timeoutId = window.setTimeout(tryScroll, 16);
      } else {
        finish();
      }
    };

    tryScroll();

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [month, onScrollToDateComplete, scrollRequestKey, scrollToDate, year]);

  useEffect(() => {
    if (scrollRequestKey !== 0) return;

    if (suppressDefaultScrollRef.current) {
      suppressDefaultScrollRef.current = false;
      return;
    }

    const frame = requestAnimationFrame(() => {
      const container = scrollRef.current;
      const todayRow = rowRefs.current.get(todayStr);
      if (hasTodayInView && container && todayRow) {
        scrollRowToCenter(container, todayRow);
      } else {
        container?.scrollTo({ top: 0, behavior: "auto" });
      }
    });

    return () => cancelAnimationFrame(frame);
  }, [hasTodayInView, month, scrollRequestKey, todayStr, year]);

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden flex-1 min-h-0 flex flex-col">
      <table className="w-full text-sm table-fixed shrink-0">
        <TimesheetColumnGroup />
        <thead>
          <tr className="border-b border-border bg-muted/50">
            {[
              "Dzień miesiąca",
              "Dzień tygodnia",
              "Przedział pracy",
              "Godziny nominalne",
              "Godziny realne",
              "Status",
            ].map((label) => (
              <th
                key={label}
                className="text-center px-2 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide leading-snug"
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>
      </table>

      <div
        ref={scrollRef}
        className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent"
      >
        <table className="w-full text-sm table-fixed">
          <TimesheetColumnGroup />
          <tbody className="hr-table-zebra">
            {days.map(
              ({ day, dateStr, weekend, rowStatus, isToday, isFuture }) => {
                const isAbsent = !weekend && isDayAbsent(dateStr, employee);
                const isFutureUnset = isFuture && !weekend && !hasDayRecord(dateStr, employee);

                return (
                  <tr
                    key={dateStr}
                    ref={(element) => {
                      if (element) rowRefs.current.set(dateStr, element);
                      else rowRefs.current.delete(dateStr);
                    }}
                    onClick={() => !weekend && onDayClick(dateStr)}
                    className={[
                      "hr-table-row",
                      weekend
                        ? "text-muted-foreground cursor-default"
                        : "hr-table-row-clickable",
                      isFutureUnset && "text-muted-foreground/60",
                      isAbsent && "animate-pulse-red-row",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    {isToday ? (
                      <TodayDayCell day={day} />
                    ) : (
                      <td className="px-2 py-2.5 text-center font-medium tabular-nums">
                        {day}
                      </td>
                    )}
                    <td className="px-2 py-2.5 text-center">
                      {getDayOfWeek(year, month, day)}
                    </td>
                    <td className="px-2 py-2.5 text-center tabular-nums whitespace-nowrap">
                      {weekend ? (
                        <span className="text-xs text-muted-foreground/60 italic">
                          wolne
                        </span>
                      ) : (
                        `${employee.startHour} – ${employee.endHour}`
                      )}
                    </td>
                    <td className="px-2 py-2.5 text-center tabular-nums">
                      {weekend ? "—" : nomHours}
                    </td>
                    <td className="px-2 py-2.5 text-center tabular-nums">
                      {weekend ? "—" : getRealHours(dateStr, employee)}
                    </td>
                    <td className="px-2 py-2.5 text-center">
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
