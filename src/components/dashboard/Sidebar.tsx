"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { canRoleAccessRoute, UserRole } from "@/config/rbac";
import { 
  LayoutDashboard, GraduationCap, BookOpen, UserSquare2, 
  MessageSquare, BellRing, CheckSquare, Download, Hourglass, X,
  Building2, Layers, ShieldAlert, Users, Package2
} from "lucide-react";

interface SidebarProps {
  role: UserRole;
  user: { name?: string };
  isOpen: boolean;
  onClose: () => void;
}


export default function Sidebar({ role, user, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  // Master definitions using the precise namespaced segments
  const masterMenuItems = [
    { name: "STUDENT CONSOLE", href: "/dashboard/student", icon: LayoutDashboard },
    { name: "STUDENT TIMETABLE", href: "/dashboard/student/timetable", icon: GraduationCap },    
    { name: "ALERTS", href: "/dashboard/student/alerts", icon: BellRing },    
    { name: "DOWNLOADS", href: "/dashboard/student/download", icon: Download },    
    
    { name: "FACULTY CORE", href: "/dashboard/faculty", icon: UserSquare2 },
    { name: "TEACHING SCHEDULES", href: "/dashboard/faculty/timetable", icon: GraduationCap },
    { name: "ALERTS", href: "/dashboard/faculty/alerts", icon: BellRing },    
    { name: "EXCHANGE DESK", href: "/dashboard/faculty/exchange-desk", icon: ShieldAlert },
    
    { name: "APPROVALS DESK", href: "/dashboard/approvals", icon: CheckSquare },
    
    { name: "DEPT SCHEDULER", href: "/dashboard/department", icon: Layers },
    { name: "DEPT LOGISTICS", href: "/dashboard/department/physical", icon: Package2 },
    
    { name: "INSTITUTION CORE", href: "/dashboard/institution", icon: Building2 },
    { name: "CAMPUS ESTATE", href: "/dashboard/institution/physical", icon: Building2 },
    
    { name: "SUPER CONTROL", href: "/dashboard/super-admin", icon: Users },
  ];

  // Filters elements in real time against the exact RBAC prefix logic rules
  const authorizedMenuItems = masterMenuItems.filter(item => canRoleAccessRoute(role, item.href));

  return (
    <>
      {isOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden block" onClick={onClose} />}
      
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#f4ebd0] border-r-2 border-[#1a1a14] flex flex-col justify-between transition-transform duration-200 lg:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } font-mono text-[#1a1a14]`}>
        
        <div className="flex flex-col flex-1 min-h-0">
          <div className="h-16 flex items-center justify-between px-4 border-b-2 border-[#1a1a14] bg-[#eae3cb] shrink-0">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="h-9 w-9 bg-[#1a1a14] text-[#f4ebd0] flex items-center justify-center rounded-sm border border-[#1a1a14]">
                <Hourglass className="h-4 w-4" />
              </div>
              <span className="text-base font-black tracking-tight uppercase">HOURGLASS</span>
            </Link>
            <button onClick={onClose} className="lg:hidden p-1.5 border border-black bg-[#f4ebd0]">
              <X className="h-4 w-4" />
            </button>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto min-h-0">
            {authorizedMenuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3 py-2 text-xs font-bold uppercase border transition-all ${
                    isActive
                      ? "bg-[#e28774] border-2 border-[#1a1a14] shadow-[3px_3px_0px_0px_#1a1a14] translate-x-[-2px] translate-y-[-2px]"
                      : "border-transparent hover:bg-[#eae3cb] hover:border-[#1a1a14]"
                  }`}
                >
                  <item.icon className="h-4 w-4 shrink-0 stroke-[2.5]" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-3 border-t-2 border-[#1a1a14] bg-[#eae3cb] shrink-0">
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