"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Mail, Eye, EyeOff, User, X } from "lucide-react";
import { useApp } from "../AppContext";
import { LoginThemeControl } from "./LoginThemeControl";

export function LoginPage() {
  const router = useRouter();
  const { login, loginError, isLoggedIn } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (isLoggedIn) router.replace("/employees");
  }, [isLoggedIn, router]);

  useEffect(() => {
    if (loginError) {
      setShowToast(true);
      const t = setTimeout(() => setShowToast(false), 4000);
      return () => clearTimeout(t);
    }
  }, [loginError]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void login(email, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 w-full">
      <div
        className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 transition-all duration-400 ${
          showToast
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-3 pointer-events-none"
        }`}
      >
        <div className="flex items-center gap-3 bg-destructive text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium">
          <span>Błędne dane logowania</span>
          <button
            onClick={() => setShowToast(false)}
            className="ml-1 hover:opacity-70 transition-opacity"
            aria-label="Zamknij powiadomienie"
          >
            <X size={15} />
          </button>
        </div>
      </div>

      <div className="w-full max-w-sm">
        <div className="bg-card border border-border rounded-2xl shadow-xl p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 rounded-full border-2 border-border bg-muted flex items-center justify-center mb-4">
              <User size={36} className="text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-semibold text-foreground tracking-tight">
              HR Assist
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Zaloguj się do swojego konta
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="relative">
              <Mail
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
              />
              <input
                type="email"
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 pl-10 pr-4 rounded-lg border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                autoComplete="email"
              />
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="hasło"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 pl-4 pr-11 rounded-lg border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showPassword ? "Ukryj hasło" : "Pokaż hasło"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <button
              type="submit"
              className="mt-2 h-11 w-full rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-all shadow-sm"
            >
              Zaloguj
            </button>
          </form>
        </div>
      </div>

      <LoginThemeControl />
    </div>
  );
}
