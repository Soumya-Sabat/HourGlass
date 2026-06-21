"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import { Menu } from "lucide-react";

export default function SidebarWrapper({ role, user }: { role: string; user: any }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Sticky Hamburger Trigger Box */}
      <div className="lg:hidden fixed bottom-4 right-4 z-50">
        <button 
          onClick={() => setIsOpen(true)} 
          className="p-3 border-2 border-black bg-[#e28774] text-[#1a1a14] shadow-[2px_2px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_#000]"
        >
          <Menu className="h-6 w-6 stroke-[2.5]" />
        </button>
      </div>

      <Sidebar role={role} user={user} isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}