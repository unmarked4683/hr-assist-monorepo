"use client";

import {
  useState,
  useRef,
  useCallback,
} from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Users, CalendarDays, ChevronRight, LogOut } from "lucide-react";
import { useApp } from "../AppContext";
import { AnchoredFlyout } from "../shared/AnchoredFlyout";
import { getThemeOption, ThemePickerMenu } from "../shared/theme-picker";

const tileClassName =
  "w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-sidebar-accent";

const navLinkClassName = (isActive: boolean) =>
  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
    isActive
      ? "bg-sidebar-accent text-sidebar-primary cursor-default select-none"
      : "text-sidebar-foreground hover:bg-sidebar-accent/70"
  }`;

export const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme, logout } = useApp();
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const themeTriggerRef = useRef<HTMLButtonElement>(null);
  const themeFlyoutRef = useRef<HTMLDivElement>(null);
  const userTriggerRef = useRef<HTMLButtonElement>(null);
  const userFlyoutRef = useRef<HTMLDivElement>(null);

  const closeThemeMenu = useCallback(() => setThemeMenuOpen(false), []);
  const closeUserMenu = useCallback(() => setUserMenuOpen(false), []);

  const { label: themeLabel, Icon: ThemeIcon } = getThemeOption(theme);

  const handleThemeTriggerClick = () => {
    setUserMenuOpen(false);
    setThemeMenuOpen((current) => !current);
  };

  const handleUserTriggerClick = () => {
    setThemeMenuOpen(false);
    setUserMenuOpen((current) => !current);
  };

  const handleLogout = async () => {
    closeUserMenu();
    await logout();
    router.replace("/login");
  };

  return (
    <aside className="w-60 shrink-0 h-screen flex flex-col bg-sidebar border-r border-sidebar-border overflow-visible">
      <div className="px-5 pt-6 pb-4">
        <span className="text-lg font-bold text-sidebar-foreground tracking-tight">
          HR Assist
        </span>
      </div>

      <nav className="flex-1 px-3 py-2 space-y-1">
        <Link href="/employees" className={navLinkClassName(pathname.startsWith("/employees"))}>
          <Users size={17} />
          <span>Pracownicy</span>
        </Link>
        <Link href="/holidays" className={navLinkClassName(pathname.startsWith("/holidays"))}>
          <CalendarDays size={17} />
          <span>Dni wolne</span>
        </Link>
      </nav>

      <div className="px-3 pb-4 overflow-visible">
        <div className="rounded-xl border border-sidebar-border">
          <button
            ref={themeTriggerRef}
            type="button"
            onClick={handleThemeTriggerClick}
            className={`${tileClassName} rounded-t-xl border-b border-sidebar-border`}
            aria-label="Wybierz motyw"
            aria-expanded={themeMenuOpen}
          >
            <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center shrink-0">
              <ThemeIcon size={16} className="text-sidebar-foreground" />
            </div>
            <span className="text-sm font-medium text-sidebar-foreground">
              {themeLabel}
            </span>
            <ChevronRight
              size={14}
              className={`ml-auto text-muted-foreground transition-opacity duration-200 ${
                themeMenuOpen ? "opacity-100" : "opacity-60"
              }`}
            />
          </button>

          <button
            ref={userTriggerRef}
            type="button"
            onClick={handleUserTriggerClick}
            className={`${tileClassName} rounded-b-xl`}
            aria-label="Opcje użytkownika"
            aria-expanded={userMenuOpen}
          >
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-primary-foreground">
                BK
              </span>
            </div>
            <div className="leading-tight min-w-0">
              <div className="text-sm font-semibold text-sidebar-foreground">
                Basia
              </div>
              <div className="text-sm font-semibold text-sidebar-foreground">
                Kowalska
              </div>
            </div>
            <ChevronRight
              size={14}
              className={`ml-auto text-muted-foreground transition-opacity duration-200 ${
                userMenuOpen ? "opacity-100" : "opacity-60"
              }`}
            />
          </button>
        </div>

        <AnchoredFlyout
          open={themeMenuOpen}
          onClose={closeThemeMenu}
          triggerRef={themeTriggerRef}
          flyoutRef={themeFlyoutRef}
          title="Motyw"
          placement="right"
        >
          <ThemePickerMenu theme={theme} onSelect={setTheme} />
        </AnchoredFlyout>

        <AnchoredFlyout
          open={userMenuOpen}
          onClose={closeUserMenu}
          triggerRef={userTriggerRef}
          flyoutRef={userFlyoutRef}
          title="Konto"
          placement="right"
        >
          <button
            type="button"
            onClick={() => void handleLogout()}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors w-full text-left hover:bg-accent text-foreground"
          >
            <LogOut size={15} />
            Wyloguj
          </button>
        </AnchoredFlyout>
      </div>
    </aside>
  );
};
