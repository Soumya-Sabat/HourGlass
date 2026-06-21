"use client";

import { Bell, Search, LogOut } from "lucide-react";
import { handleSignOut } from "@/app/auth-actions"; // Import the Server Action here

interface HeaderProps {
  user: {
    name?: string;
  };
}

export default function Header({ user }: HeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30 shrink-0">
      
      {/* Context Omnibox / Search Tracker */}
      <div className="w-full max-w-xs relative hidden sm:block">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search timetables, rooms, faculties..."
          className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 outline-none placeholder:text-slate-400 focus:bg-white focus:border-indigo-500 transition-all"
        />
      </div>

      {/* Action Tray */}
      <div className="flex items-center gap-2 sm:gap-4 ml-auto">
        
        {/* System Alert Notification Trigger */}
        <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-xl transition-colors relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2 w-2 bg-rose-500 rounded-full ring-2 ring-white" />
        </button>

        {/* Simple structural vertical pipe divider */}
        <div className="h-5 w-px bg-slate-200 my-auto mx-1" />

        {/* Server Action Execution via Form Submission */}
        <form action={async () => {
          await handleSignOut();
          window.location.href = "/login"; // Safely redirects on the client-side post-wipe
        }}>
          <button 
            type="submit"
            className="flex items-center gap-2 p-2 sm:px-3 sm:py-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50/50 rounded-xl text-xs font-bold transition-all border border-transparent hover:border-rose-100"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </form>

      </div>
    </header>
  );
}