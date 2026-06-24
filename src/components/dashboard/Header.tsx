"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Menu, LogOut, UserCheck, UserRoundCog, Moon, Sun } from "lucide-react";
import { handleSignOut } from "@/actions/auth-actions";
import { getDashboardSessionSummary, type DashboardSessionSummary } from "@/actions/dashboard-session-actions";
import { useTheme } from "@/components/ThemeProvider";
import type { UserRole } from "@/config/rbac";

interface HeaderUserSession {
  name: string;
  email:string;
  role: UserRole;
  id?: string;
  isEmailVerified?: boolean;
  issuedAt?: number;
  expiresAt?: number;
}

interface HeaderProps {
  onMenuClick: () => void;
  userSession: HeaderUserSession;
}

export default function Header({ onMenuClick, userSession }: HeaderProps) {
  const [sessionPopupOpen, setSessionPopupOpen] = useState(false);
  const [sessionSummary, setSessionSummary] = useState<DashboardSessionSummary | null>(null);
  const [sessionSummaryLoading, setSessionSummaryLoading] = useState(true);
  const [sessionSummaryError, setSessionSummaryError] = useState<string | null>(null);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    let isActive = true;
    setSessionSummaryLoading(true);

    getDashboardSessionSummary()
      .then((data) => {
        if (isActive) setSessionSummary(data);
      })
      .catch(() => {
        if (isActive) setSessionSummaryError("Unable to load session details.");
      })
      .finally(() => {
        if (isActive) setSessionSummaryLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <header className="h-16 bg-[var(--bg-secondary)] border-b-2 border-[var(--border-primary)] px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30 shrink-0 font-mono">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-1.5 border-2 border-[var(--border-primary)] bg-[var(--bg-primary)] active:bg-[var(--accent)] flex items-center justify-center"
        >
          <Menu className="h-5 w-5 stroke-[2.5]" />
        </button>

        <div className="w-full max-w-xs relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-primary)] stroke-[2.5]" />
          <input
            type="text"
            placeholder="SEARCH COMMANDS..."
            className="w-full pl-9 pr-4 py-1.5 bg-[var(--bg-primary)] border border-[var(--border-primary)] text-xs font-black text-[var(--text-primary)] uppercase outline-none placeholder:text-[var(--text-primary-40)] focus:bg-[var(--surface-white)] transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 ml-auto">
        <button
          onClick={toggleTheme}
          className="p-2 border border-[var(--border-primary)] bg-[var(--bg-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
          title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
          {theme === "dark" ? <Sun className="h-4 w-4 text-[var(--text-primary)] stroke-[2.5]" /> : <Moon className="h-4 w-4 text-[var(--text-primary)] stroke-[2.5]" />}
        </button>

        <div className="hidden xs:flex items-center gap-1.5 px-2 py-1 border border-[var(--border-primary)] bg-[var(--bg-primary)] text-[10px] font-black uppercase tracking-tight">
          <UserCheck className="h-3.5 w-3.5 text-green-700 stroke-[2.5]" />
          <span>SESSION SECURE</span>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setSessionPopupOpen((open) => !open)}
            className="p-2 border border-[var(--border-primary)] bg-[var(--bg-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
            title="System Documentation"
          >
            <UserRoundCog className="h-4 w-4 text-[var(--text-primary)] stroke-[2.5]" />
          </button>

          {sessionPopupOpen && (
            <>
              <div className="fixed inset-0 z-40 bg-black/40" onClick={() => setSessionPopupOpen(false)} />
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="w-full max-w-md border-2 border-[var(--border-primary)] bg-[var(--bg-secondary)] shadow-[6px_6px_0px_0px_var(--border-primary)]">
                  <div className="border-b-2 border-[var(--border-primary)] bg-[var(--dark-bg)] p-4 text-[var(--light-text)]">
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest">
                      <UserRoundCog className="h-4 w-4" />
                      PROFILE 
                    </div>
                    <div className="text-base sm:text-xl font-black uppercase mt-1">{userSession.name}</div>
                  </div>

                  <div className="space-y-3 p-4 bg-[var(--surface-white)]">
                    <div className="flex justify-between gap-4 border-b border-[var(--border-primary)] pb-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-[var(--text-primary-70)]">Role</span>
                      <span className="text-xs font-black uppercase">{userSession.role.replace(/_/g, " ")}</span>
                    </div>
                    {sessionSummaryLoading && (
                      <div className="text-xs font-black uppercase">Loading session details...</div>
                    )}
                    {sessionSummaryError && (
                      <div className="text-xs font-black uppercase text-red-600">{sessionSummaryError}</div>
                    )}
                    {sessionSummary && (
                      <>
                        <div className="flex justify-between gap-4 border-b border-[var(--border-primary)] pb-2">
                          <span className="text-[10px] font-black uppercase tracking-wider text-[var(--text-primary-70)]">Institution Name</span>
                          <span className="text-xs font-black uppercase text-right">{sessionSummary.institutionName}</span>
                        </div>
                        <div className="flex justify-between gap-4 border-b border-[var(--border-primary)] pb-2">
                          <span className="text-[10px] font-black uppercase tracking-wider text-[var(--text-primary-70)]">Institution ID</span>
                          <span className="text-xs font-black uppercase">{sessionSummary.institutionId}</span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-[10px] font-black uppercase tracking-wider text-[var(--text-primary-70)]">Phone Number</span>
                          <span className="text-xs font-black uppercase">{sessionSummary.phoneNumber}</span>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3 border-t-2 border-[var(--border-primary)] p-4 bg-[var(--bg-primary)]">
                    <Link
                      href="/dashboard/student/settings"
                      onClick={() => setSessionPopupOpen(false)}
                      className="bg-[var(--accent)] text-[var(--text-primary)] border-2 border-[var(--border-primary)] px-3 py-2 text-xs font-black uppercase shadow-[2px_2px_0px_0px_var(--border-primary)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_var(--border-primary)] text-center"
                    >
                      explore more
                    </Link>
                    <button
                      type="button"
                      onClick={() => setSessionPopupOpen(false)}
                      className="bg-[var(--surface-white)] text-[var(--text-primary)] border-2 border-[var(--border-primary)] px-3 py-2 text-xs font-black uppercase shadow-[2px_2px_0px_0px_var(--border-primary)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_var(--border-primary)]"
                    >
                      exit
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <form action={handleSignOut}>
          <button
            type="submit"
            className="flex items-center gap-2 px-3 py-1.5 bg-[var(--accent)] text-[var(--text-primary)] border-2 border-[var(--border-primary)] text-xs font-black uppercase tracking-tight shadow-[2px_2px_0px_0px_var(--border-primary)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_var(--border-primary)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
          >
            <LogOut className="h-3.5 w-3.5 shrink-0 stroke-[2.5]" />
            <span className="hidden sm:inline">SIGN OUT</span>
          </button>
        </form>
      </div>
    </header>
  );
}
