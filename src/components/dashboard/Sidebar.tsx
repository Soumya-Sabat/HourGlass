"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { canRoleAccessRoute, UserRole } from "@/config/rbac";
import { 
  LayoutDashboard, GraduationCap, UserSquare2, 
  BellRing, CheckSquare, Download, Hourglass, X, Settings,
  Building2, Layers, ShieldAlert, Users, Package2,UsersRound,BookOpenText,ScrollText, Mails,
  Activity, ClipboardList, BookMarked, Megaphone, AlertTriangle, BarChart3, PenLine, Mail,
  Calendar, MessageSquare
} from "lucide-react";

export interface SidebarProps {
  role: UserRole;
  user: { name?: string };
  isOpen: boolean;
  onClose: () => void;
}


export default function Sidebar({ role, user, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  // Master definitions using the precise namespaced segments
  const masterMenuItems = [
    // Student section 
    { name: "STUDENT CONSOLE", href: "/dashboard/student", icon: LayoutDashboard },
    { name: "MY TIMETABLE", href: "/dashboard/student/timetable", icon: GraduationCap },    
    { name: "SUBJECTS ", href: "/dashboard/student/subjects", icon: BookOpenText },    
    { name: "FACULTIES ", href: "/dashboard/student/faculties", icon: UsersRound },    
    { name: "MESSAGES ", href: "/dashboard/student/messages", icon: Mails },    
    { name: "NOTICES / ALERTS ", href: "/dashboard/student/alerts", icon: BellRing },    
    { name: "ATTENDANCE ", href: "/dashboard/student/attendance", icon: ScrollText },    
    { name: "MY MARKSHEET", href: "/dashboard/student/marksheet", icon: Download },    
    { name: "STUDENT SETTINGS", href: "/dashboard/student/settings", icon: Settings },    
    
    // faculty section
    { name: "FACULTY CORE", href: "/dashboard/faculty", icon: UserSquare2 },
    { name: "TEACHING SCHEDULES", href: "/dashboard/faculty/timetable", icon: GraduationCap },
    { name: "SUBJECTS", href: "/dashboard/faculty/subjects", icon: BookOpenText },
    { name: "NOTICES", href: "/dashboard/faculty/notices", icon: BellRing },
    { name: "ATTENDANCE", href: "/dashboard/faculty/attendance", icon: ScrollText },
    { name: "DOWNLOADS", href: "/dashboard/faculty/downloads", icon: Download },
    { name: "MESSAGES", href: "/dashboard/faculty/messages", icon: Mails },
    { name: "MY CLUSTERS", href: "/dashboard/faculty/clusters", icon: Layers },
    { name: "EXCHANGE DESK", href: "/dashboard/faculty/exchange-desk", icon: ShieldAlert },

    // reviewer section (only reviewer-specific entries; shared faculty routes inherited from faculty section)
    { name: "REVIEWER CORE", href: "/dashboard/review", icon: ShieldAlert },
    { name: "TIMETABLE REVIEW", href: "/dashboard/review/timetable-review", icon: Calendar },
    { name: "CLUSTERS", href: "/dashboard/review/clusters", icon: Layers },
    
    // Head of dept
    { name: "HEAD COMMAND CENTER", href: "/dashboard/head", icon: CheckSquare },
    { name: "FACULTY ROSTER", href: "/dashboard/head/faculty-roster", icon: Users },
    { name: "SUBJECTS", href: "/dashboard/head/subjects", icon: BookOpenText },
    { name: "NOTICES", href: "/dashboard/head/notices", icon: BellRing },
    { name: "MESSAGES", href: "/dashboard/head/messages", icon: Mails },
    { name: "CLUSTER OVERSIGHT", href: "/dashboard/head/clusters", icon: Layers },
    
    //dept admin - dean , supervisor
    { name: "DEPT DASHBOARD", href: "/dashboard/department", icon: LayoutDashboard },
    { name: "FACULTY ROSTER", href: "/dashboard/department/faculty-roster", icon: Users },
    { name: "STUDENTS", href: "/dashboard/department/students", icon: GraduationCap },
    { name: "TIMETABLE", href: "/dashboard/department/timetable", icon: Calendar },
    { name: "EXAMS", href: "/dashboard/department/exams", icon: ClipboardList },
    { name: "EVENTS", href: "/dashboard/department/events", icon: BellRing },
    { name: "ALERTS", href: "/dashboard/department/alerts", icon: AlertTriangle },
    { name: "ANALYTICS", href: "/dashboard/department/analytics", icon: BarChart3 },
    { name: "MESSAGES", href: "/dashboard/department/messages", icon: MessageSquare },
    { name: "NOTICES", href: "/dashboard/department/notices", icon: BellRing },
    { name: "SETTINGS", href: "/dashboard/department/settings", icon: Settings },
    
    //institutuon head
    { name: "INSTITUTION CORE", href: "/dashboard/institution", icon: Building2 },
    { name: "PROFILE", href: "/dashboard/institution/profile", icon: Building2 },
    { name: "ACTIVITY LOG", href: "/dashboard/institution/activity", icon: Activity },
    { name: "ALL USERS", href: "/dashboard/institution/users", icon: Users },
    { name: "DEPARTMENTS", href: "/dashboard/institution/departments", icon: Layers },
    { name: "MARKS & EXAMS", href: "/dashboard/institution/marks", icon: ClipboardList },
    { name: "EXAMS SETUP", href: "/dashboard/institution/marks/exams", icon: BookMarked },
    { name: "GRADE ENTRY", href: "/dashboard/institution/marks/entry", icon: PenLine },
    { name: "GRADEBOOK", href: "/dashboard/institution/marks/grades", icon: BookMarked },
    { name: "REGISTRATION OPTS", href: "/dashboard/institution/registration-settings", icon: Settings },
    { name: "SETTINGS", href: "/dashboard/institution/settings", icon: Settings },
    { name: "ANALYTICS", href: "/dashboard/institution/analytics", icon: BarChart3 },
    { name: "COMPLAINTS", href: "/dashboard/institution/complaints", icon: AlertTriangle },
    { name: "ANNOUNCEMENTS", href: "/dashboard/institution/announcements", icon: Megaphone },
    { name: "CHANGE REQUESTS", href: "/dashboard/institution/change-requests", icon: Mail },
    { name: "MESSAGES", href: "/dashboard/institution/messages", icon: MessageSquare },
    { name: "CAMPUS ESTATE", href: "/dashboard/institution/physical", icon: Package2 },
    
    // for main controller
    // { name: "SUPER CONTROL", href: "/dashboard/super-admin", icon: Users },
    // { name: "MANAGE USERS", href: "/dashboard/super-admin/users", icon: Users },
    // { name: "SYSTEM ANALYTICS", href: "/dashboard/super-admin/analytics", icon: Users },
  ];

    // Filters elements in real time against the exact RBAC prefix logic rules
  const authorizedMenuItems = masterMenuItems.filter(item => canRoleAccessRoute(role, item.href));

  return (
    <>
      {isOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden block" onClick={onClose} />}
      
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[var(--bg-primary)] border-r-2 border-[var(--border-primary)] flex flex-col justify-between transition-transform duration-200 lg:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } font-mono text-[var(--text-primary)]`}>
        
        <div className="flex flex-col flex-1 min-h-0">
          <div className="h-16 flex items-center justify-between px-4 border-b-2 border-[var(--border-primary)] bg-[var(--bg-secondary)] shrink-0">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="h-9 w-9 bg-[var(--dark-bg)] text-[var(--light-text)] flex items-center justify-center rounded-sm border border-[var(--border-primary)]">
                <Hourglass className="h-4 w-4" />
              </div>
              <span className="text-base font-black tracking-tight uppercase">HOURGLASS</span>
            </Link>
            <button onClick={onClose} className="lg:hidden p-1.5 border border-[var(--border-primary)] bg-[var(--bg-primary)]">
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
                  ? "bg-[var(--accent)] border-2 border-[var(--border-primary)] shadow-[3px_3px_0px_0px_var(--border-primary)] translate-x-[-2px] translate-y-[-2px]"
                  : "border-transparent hover:bg-[var(--bg-secondary)] hover:border-[var(--border-primary)]"
              }`}
                >
                  <item.icon className="h-4 w-4 shrink-0 stroke-[2.5]" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-3 border-t-2 border-[var(--border-primary)] bg-[var(--bg-secondary)] shrink-0">
          <div className="flex items-center gap-3 p-2 border border-[var(--border-primary)] bg-[var(--bg-primary)]">
            <div className="h-8 w-8 bg-[var(--dark-bg)] text-[var(--accent)] flex items-center justify-center text-xs font-black shrink-0">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-black truncate">{user?.name || "OPERATIVE"}</div>
              <div className="text-[9px] font-black text-[var(--light-text)] bg-[var(--dark-bg)] px-1.5 py-0.5 mt-1 inline-block uppercase tracking-wide">
                {role.replace("_", " ")}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}