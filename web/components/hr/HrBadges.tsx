"use client";

import {
  DayStatus,
  DayStatusCategory,
  getDayStatusCategory,
  getDayStatusLabel,
  Location,
} from "@/lib/hr-data";

type DayStatusBadgeVariant = "ok" | "unexcused" | "excused" | "future";

function getVariantFromStatus(status: DayStatus): DayStatusBadgeVariant {
  const category = getDayStatusCategory(status);
  if (category === DayStatusCategory.Present) return "ok";
  if (category === DayStatusCategory.Unexcused) return "unexcused";
  return "excused";
}

export function LocationBadge({ location }: { location: Location | string }) {
  const isOffice = location === "Biuro";

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
        isOffice
          ? "bg-primary/10 text-primary border-primary/25"
          : "bg-[var(--status-yellow)]/10 text-[oklch(0.58_0.16_70)] dark:text-[oklch(0.78_0.17_70)] border-[var(--status-yellow)]/25"
      }`}
    >
      {location}
    </span>
  );
}

export function DayStatusBadge({
  variant,
  detailLabel,
  summary = false,
}: {
  variant: DayStatusBadgeVariant;
  detailLabel?: string;
  summary?: boolean;
}) {
  if (variant === "future") {
    return (
      <span className="inline-flex items-center justify-center text-muted-foreground/50 text-sm select-none">
        —
      </span>
    );
  }

  if (variant === "ok") {
    return (
      <span className="inline-flex items-center justify-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-[var(--status-green)] shrink-0" />
        <span
          className={`text-[var(--status-green)] font-medium ${
            summary ? "text-sm" : "font-bold text-xs tracking-widest"
          }`}
        >
          OK
        </span>
      </span>
    );
  }

  if (variant === "unexcused") {
    const label = summary ? "Wymaga działania" : "NN";
    const tooltip = getDayStatusLabel(DayStatus.UnexcusedAbsence);

    return (
      <span className="relative inline-flex items-center justify-center gap-1.5 group">
        <span className="w-2 h-2 rounded-full bg-[var(--status-red)] shrink-0" />
        <span
          className={`text-[var(--status-red)] ${
            summary ? "text-sm font-medium" : "font-bold text-xs tracking-widest"
          }`}
        >
          {label}
        </span>
        {!summary && (
          <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 whitespace-nowrap rounded-md border border-border bg-popover px-2.5 py-1 text-xs text-popover-foreground shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-50">
            {tooltip}
          </span>
        )}
      </span>
    );
  }

  return (
    <span className="relative inline-flex items-center justify-center gap-1.5 group">
      <span className="w-2 h-2 rounded-full bg-[var(--status-yellow)] shrink-0" />
      <span className="text-[var(--status-yellow)] font-bold text-xs tracking-widest">
        USP
      </span>
      {detailLabel && (
        <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 whitespace-nowrap rounded-md border border-border bg-popover px-2.5 py-1 text-xs text-popover-foreground shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-50">
          {detailLabel}
        </span>
      )}
    </span>
  );
}

export function DayStatusBadgeFromStatus({
  status,
  summary = false,
}: {
  status: DayStatus;
  summary?: boolean;
}) {
  return (
    <DayStatusBadge
      variant={getVariantFromStatus(status)}
      detailLabel={
        getVariantFromStatus(status) === "excused"
          ? getDayStatusLabel(status)
          : undefined
      }
      summary={summary}
    />
  );
}
