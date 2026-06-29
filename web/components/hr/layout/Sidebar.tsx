"use client";

import {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  useCallback,
  type ElementType,
  type ReactNode,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { Users, Sun, Moon, Monitor, ChevronRight, LogOut } from "lucide-react";
import { useApp } from "../AppContext";
import type { Theme } from "@/lib/types";

const THEME_OPTIONS: ReadonlyArray<{
  value: Theme;
  label: string;
  Icon: ElementType;
}> = [
  { value: "light", label: "Jasny", Icon: Sun },
  { value: "dark", label: "Ciemny", Icon: Moon },
  { value: "system", label: "Systemowy", Icon: Monitor },
];

const VIEWPORT_EDGE_MARGIN = 10;
const FLYOUT_GAP = 8;

const getThemeOption = (theme: Theme) =>
  THEME_OPTIONS.find((option) => option.value === theme) ?? THEME_OPTIONS[2];

const tileClassName =
  "w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-sidebar-accent";

interface FlyoutLayout {
  top: number;
  left: number;
  arrowTop: number;
}

const computeFlyoutLayout = (
  triggerRect: DOMRect,
  flyoutHeight: number,
): FlyoutLayout => {
  const triggerCenterY = triggerRect.top + triggerRect.height / 2;
  const maxTop = window.innerHeight - VIEWPORT_EDGE_MARGIN - flyoutHeight;
  const minTop = VIEWPORT_EDGE_MARGIN;

  const centeredTop = triggerCenterY - flyoutHeight / 2;
  const top = Math.min(maxTop, Math.max(minTop, centeredTop));
  const left = triggerRect.right + FLYOUT_GAP;
  const arrowTop = triggerCenterY - top;

  return { top, left, arrowTop };
};

interface SidebarFlyoutProps {
  open: boolean;
  onClose: () => void;
  triggerRef: RefObject<HTMLElement | null>;
  flyoutRef: RefObject<HTMLDivElement | null>;
  title: string;
  children: ReactNode;
}

const SidebarFlyout = ({
  open,
  onClose,
  triggerRef,
  flyoutRef,
  title,
  children,
}: SidebarFlyoutProps) => {
  const [layout, setLayout] = useState<FlyoutLayout | null>(null);

  const updateLayout = useCallback(() => {
    if (!open || !triggerRef.current || !flyoutRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const flyoutHeight = flyoutRef.current.getBoundingClientRect().height;
    setLayout(computeFlyoutLayout(triggerRect, flyoutHeight));
  }, [flyoutRef, open, triggerRef]);

  useEffect(() => {
    if (!open) setLayout(null);
  }, [open]);

  useLayoutEffect(() => {
    if (!open) return;
    updateLayout();

    const flyoutElement = flyoutRef.current;
    if (!flyoutElement) return;

    const resizeObserver = new ResizeObserver(updateLayout);
    resizeObserver.observe(flyoutElement);

    window.addEventListener("resize", updateLayout);
    window.addEventListener("scroll", updateLayout, true);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateLayout);
      window.removeEventListener("scroll", updateLayout, true);
    };
  }, [flyoutRef, open, updateLayout, children]);

  useEffect(() => {
    if (!open) return;

    const handleMouseDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (flyoutRef.current?.contains(target)) return;
      if (triggerRef.current?.contains(target)) return;
      onClose();
    };

    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [flyoutRef, onClose, open, triggerRef]);

  if (!open) return null;

  const fallbackTop = triggerRef.current
    ? triggerRef.current.getBoundingClientRect().top
    : VIEWPORT_EDGE_MARGIN;
  const fallbackLeft = triggerRef.current
    ? triggerRef.current.getBoundingClientRect().right + FLYOUT_GAP
    : 0;

  return createPortal(
    <div
      className="fixed z-100"
      style={{
        top: layout?.top ?? fallbackTop,
        left: layout?.left ?? fallbackLeft,
        visibility: layout ? "visible" : "hidden",
      }}
      role="dialog"
      aria-label={title}
    >
      {layout && (
        <span
          aria-hidden
          className="pointer-events-none absolute -left-[5px] w-2.5 h-2.5 rotate-45 bg-popover border-l border-b border-border"
          style={{
            top: layout.arrowTop,
            transform: "translateY(-50%) rotate(45deg)",
          }}
        />
      )}

      <div
        ref={flyoutRef}
        className="w-52 bg-popover border border-border rounded-xl shadow-lg p-3"
      >
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 px-1">
          {title}
        </p>
        {children}
      </div>
    </div>,
    document.body,
  );
};

export const Sidebar = () => {
  const router = useRouter();
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

  const handleThemeSelect = (value: Theme) => {
    setTheme(value);
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

      <nav className="flex-1 px-3 py-2">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-sidebar-accent text-sidebar-primary font-medium text-sm cursor-default select-none">
          <Users size={17} />
          <span>Pracownicy</span>
        </div>
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

        <SidebarFlyout
          open={themeMenuOpen}
          onClose={closeThemeMenu}
          triggerRef={themeTriggerRef}
          flyoutRef={themeFlyoutRef}
          title="Motyw"
        >
          <div className="flex flex-col gap-0.5">
            {THEME_OPTIONS.map(({ value, label, Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => handleThemeSelect(value)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors w-full text-left ${
                  theme === value
                    ? "bg-primary/10 text-primary font-medium"
                    : "hover:bg-accent text-foreground"
                }`}
              >
                <Icon size={15} />
                {label}
                {theme === value && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                )}
              </button>
            ))}
          </div>
        </SidebarFlyout>

        <SidebarFlyout
          open={userMenuOpen}
          onClose={closeUserMenu}
          triggerRef={userTriggerRef}
          flyoutRef={userFlyoutRef}
          title="Konto"
        >
          <button
            type="button"
            onClick={() => void handleLogout()}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors w-full text-left hover:bg-accent text-foreground"
          >
            <LogOut size={15} />
            Wyloguj
          </button>
        </SidebarFlyout>
      </div>
    </aside>
  );
};
