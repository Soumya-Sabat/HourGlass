"use client";

import { Search, Menu, LogOut, UserCheck, UserRoundCog } from "lucide-react";
import { handleSignOut } from "@/actions/auth-actions"; // Adjust the path to your auth-actions file

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="h-16 bg-[#eae3cb] border-b-2 border-[#1a1a14] px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30 shrink-0 font-mono">
      
      {/* Mobile Trigger and Search Deck */}
      <div className="flex items-center gap-3">
        <button 
          onClick={onMenuClick} 
          className="lg:hidden p-1.5 border-2 border-black bg-[#f4ebd0] active:bg-[#e28774] flex items-center justify-center"
        >
          <Menu className="h-5 w-5 stroke-[2.5]" />
        </button>

        <div className="w-full max-w-xs relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#1a1a14] stroke-[2.5]" />
          <input
            type="text"
            placeholder="SEARCH COMMANDS..."
            className="w-full pl-9 pr-4 py-1.5 bg-[#f4ebd0] border border-[#1a1a14] text-xs font-black text-[#1a1a14] uppercase outline-none placeholder:text-[#1a1a14]/40 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Alternative Operational Badges & Actions */}
      <div className="flex items-center gap-3 ml-auto">
        
        {/* Replacement: Real-time System Connectivity Status Indicator */}
        <div className="hidden xs:flex items-center gap-1.5 px-2 py-1 border border-[#1a1a14] bg-[#f4ebd0] text-[10px] font-black uppercase tracking-tight">
          <UserCheck className="h-3.5 w-3.5 text-green-700 stroke-[2.5]" />
          <span>SESSION SECURE</span>
        </div>

        {/* Replacement: Dedicated Help Documentation Utility Link */}
        <button className="p-2 border border-[#1a1a14] bg-[#f4ebd0] hover:bg-[#eae3cb] transition-colors title='System Documentation'">
          <UserRoundCog className="h-4 w-4 text-[#1a1a14] stroke-[2.5]" />
        </button>

        {/* Functional Logout Action Form Wrapper */}
        <form action={handleSignOut}>
          <button 
            type="submit" 
            className="flex items-center gap-2 px-3 py-1.5 bg-[#e28774] text-[#1a1a14] border-2 border-[#1a1a14] text-xs font-black uppercase tracking-tight shadow-[2px_2px_0px_0px_#1a1a14] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#1a1a14] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
          >
            <LogOut className="h-3.5 w-3.5 shrink-0 stroke-[2.5]" />
            <span className="hidden sm:inline">SIGN OUT</span>
          </button>
        </form>
      </div>
    </header>
  );
}