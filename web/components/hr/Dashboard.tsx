"use client";

import { useState } from "react";
import { Search, Plus, MapPin } from "lucide-react";
import { useApp } from "./AppContext";
import { Employee } from "@/lib/hr-data";
import { Sidebar } from "./Sidebar";

function StatusIndicator({ employee }: { employee: Employee }) {
  // Determine worst status from day records
  const hasUnexcused = employee.dayRecords.some(
    (d) => d.status === "Nieobecność nieusprawiedliwiona",
  );
  if (hasUnexcused) {
    return (
      <span className="flex items-center gap-1.5 text-sm">
        <span className="w-2 h-2 rounded-full bg-[oklch(0.53_0.22_25)] shrink-0" />
        <span className="text-[oklch(0.53_0.22_25)] dark:text-[oklch(0.62_0.22_25)] font-medium">
          Wymaga działania
        </span>
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1.5 text-sm">
      <span className="w-2 h-2 rounded-full bg-[oklch(0.52_0.17_145)] shrink-0" />
      <span className="text-[oklch(0.52_0.17_145)] dark:text-[oklch(0.6_0.17_145)] font-medium">
        Okej
      </span>
    </span>
  );
}

function LocationBadge({ location }: { location: string }) {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground border border-border">
      <MapPin size={10} />
      {location}
    </span>
  );
}

export function Dashboard() {
  const { employees, openCreateModal, openEmployeeDetail } = useApp();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredEmployees = employees.filter((emp) => {
    const q = searchQuery.toLowerCase();
    return (
      emp.firstName.toLowerCase().includes(q) ||
      emp.lastName.toLowerCase().includes(q) ||
      emp.position.toLowerCase().includes(q) ||
      emp.location.toLowerCase().includes(q)
    );
  });

  const hasUnexcused = (emp: Employee) =>
    emp.dayRecords.some((d) => d.status === "Nieobecność nieusprawiedliwiona");

  return (
    <div className="flex h-screen bg-background overflow-hidden w-screen">
      <Sidebar />

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center gap-3 px-6 py-4 border-b border-border bg-card shrink-0 max-w-full">
          <div className="relative flex-1 grow">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
            <input
              type="text"
              placeholder="Szukaj pracowników..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-4 rounded-lg border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
            />
          </div>
          <button
            onClick={openCreateModal}
            className="h-9 w-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 active:scale-95 transition-all shadow-sm"
            aria-label="Dodaj pracownika"
          >
            <Plus size={18} />
          </button>
        </header>

        {/* Table */}
        <div className="flex-1 overflow-auto px-6 py-5">
          <div className="rounded-xl border border-border overflow-hidden bg-card shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide">
                    Imię
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide">
                    Nazwisko
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide">
                    Stanowisko
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide">
                    Lokalizacja
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center py-12 text-muted-foreground text-sm"
                    >
                      Brak pracowników spełniających kryteria wyszukiwania.
                    </td>
                  </tr>
                )}
                {filteredEmployees.map((emp, i) => {
                  const pulsing = hasUnexcused(emp);
                  return (
                    <tr
                      key={emp.id}
                      onClick={() => openEmployeeDetail(emp.id)}
                      className={`
                        cursor-pointer transition-colors border-b border-border last:border-0
                        ${pulsing ? "animate-pulse-red-row" : i % 2 === 0 ? "bg-card" : "bg-muted/30"}
                        hover:bg-primary/5
                      `}
                    >
                      <td className="px-4 py-3 font-medium text-foreground">
                        {emp.firstName}
                      </td>
                      <td className="px-4 py-3 text-foreground">
                        {emp.lastName}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {emp.position}
                      </td>
                      <td className="px-4 py-3">
                        <LocationBadge location={emp.location} />
                      </td>
                      <td className="px-4 py-3">
                        <StatusIndicator employee={emp} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
