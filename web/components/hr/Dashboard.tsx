"use client";

import { useState } from "react";
import { Search, Plus } from "lucide-react";
import { useApp } from "./AppContext";
import { employeeHasUnexcusedAbsence } from "@/lib/hr-data";
import { Sidebar } from "./Sidebar";
import { DayStatusBadge, LocationBadge } from "./HrBadges";

function EmployeeStatusSummary({ hasUnexcused }: { hasUnexcused: boolean }) {
  if (hasUnexcused) {
    return <DayStatusBadge variant="unexcused" summary />;
  }
  return <DayStatusBadge variant="ok" summary />;
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

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center gap-3 px-6 py-4 border-b border-border bg-card shrink-0 max-w-full">
          <div className="relative flex-1">
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

        <div className="flex-1 overflow-auto px-6 py-5">
          <div className="rounded-xl border border-border overflow-hidden bg-card shadow-sm">
            <table className="w-full text-sm table-fixed">
              <colgroup>
                <col className="w-[18%]" />
                <col className="w-[18%]" />
                <col className="w-[28%]" />
                <col className="w-[18%]" />
                <col className="w-[18%]" />
              </colgroup>
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
                  <th className="text-center px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide">
                    Lokalizacja
                  </th>
                  <th className="text-center px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide">
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
                  const pulsing = employeeHasUnexcusedAbsence(emp);
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
                      <td className="px-4 py-3 text-center">
                        <div className="flex justify-center">
                          <LocationBadge location={emp.location} />
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex justify-center">
                          <EmployeeStatusSummary hasUnexcused={pulsing} />
                        </div>
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
