"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, GraduationCap, BookOpen, UserSquare2, 
  MessageSquare, BellRing, CheckSquare, Download, Hourglass, X
} from "lucide-react";

interface SidebarProps {
  role: string;
  user: { name?: string };
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ role, user, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { name: "DASHBOARD", href: "/dashboard/student", icon: LayoutDashboard },
    { name: "MY TIMETABLE", href: "/dashboard/timetable", icon: GraduationCap },
    { name: "SUBJECTS", href: "/dashboard/subjects", icon: BookOpen },
    { name: "FACULTY", href: "/dashboard/faculty-roster", icon: UserSquare2 },
    { name: "MESSAGES", href: "/dashboard/messages", icon: MessageSquare, badgeCount: 3 },
    { name: "NOTICES", href: "/dashboard/notices", icon: BellRing, badgeCount: 2 },
    { name: "ATTENDANCE", href: "/dashboard/attendance", icon: CheckSquare },
    { name: "DOWNLOADS", href: "/dashboard/downloads", icon: Download },
  ];

  return (
    <>
      {/* Mobile Dark Backdrop Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden block" 
          onClick={onClose}
        />
      )}
      
      {/* Sidebar Element */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#f4ebd0] border-r-2 border-[#1a1a14] flex flex-col justify-between transition-transform duration-200 lg:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="flex flex-col flex-1">
          {/* Brand Header */}
          <div className="h-16 flex items-center justify-between px-4 border-b-2 border-[#1a1a14] bg-[#eae3cb]">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="h-9 w-9 bg-[#1a1a14] text-[#f4ebd0] flex items-center justify-center rounded-sm border border-[#1a1a14]">
                <Hourglass className="h-4 w-4" />
              </div>
              <span className="text-base font-black tracking-tight uppercase">HOURGLASS</span>
            </Link>
            {/* Mobile Exit Button */}
            <button onClick={onClose} className="lg:hidden p-1.5 border border-black bg-[#f4ebd0] active:bg-[#e28774]">
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-3 py-4 space-y-2.5 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center justify-between px-3 py-2 text-xs font-bold transition-all uppercase ${
                    isActive
                      ? "bg-[#e28774] text-[#1a1a14] border-2 border-[#1a1a14] shadow-[3px_3px_0px_0px_#1a1a14] translate-x-[-2px] translate-y-[-2px]"
                      : "text-[#1a1a14] border border-transparent hover:bg-[#eae3cb] hover:border-[#1a1a14]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4 shrink-0 stroke-[2.5]" />
                    <span>{item.name}</span>
                  </div>
                  {item.badgeCount && (
                    <span className="bg-[#1a1a14] text-[#f4ebd0] text-[9px] px-1.5 py-0.5 font-black border border-black">
                      {item.badgeCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Badge Footer */}
        <div className="p-3 border-t-2 border-[#1a1a14] bg-[#eae3cb]">
          <div className="flex items-center gap-3 p-2 border border-[#1a1a14] bg-[#f4ebd0]">
            <div className="h-8 w-8 bg-[#1a1a14] text-[#e28774] flex items-center justify-center text-xs font-black shrink-0">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-black truncate">{user?.name || "OPERATIVE"}</div>
              <div className="text-[9px] font-black text-[#f4ebd0] bg-[#1a1a14] px-1.5 py-0.5 mt-1 inline-block uppercase tracking-wide">
                {role.replace("_", " ")}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}