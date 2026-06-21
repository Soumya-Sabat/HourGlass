"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { 
  LayoutDashboard, Building2, Layers, CheckSquare, 
  UserSquare2, GraduationCap, Users, ShieldAlert 
} from "lucide-react";

interface SidebarProps {
  role: string;
  user: {
    name?: string;
    email?: string;
  };
}

export default function Sidebar({ role, user }: SidebarProps) {
  const pathname = usePathname();

  // Your verified explicit path mapping keys
  const rolePaths: Record<string, string> = {
    institution_admin: "/dashboard/institution",
    department_admin: "/dashboard/department",
    department_head: "/dashboard/approvals",
    faculty: "/dashboard/faculty",
    reviewer: "/dashboard/review",
    student: "/dashboard/student",
    admin: "/dashboard/admin",
    super_admin: "/dashboard/super-admin",
  };

  const userDashboardRoot = rolePaths[role] || "/dashboard/student";

  // Navigation schema configured cleanly with custom visibility matrix rules
  const navItems = [
    { name: "Overview", href: userDashboardRoot, icon: LayoutDashboard, roles: Object.keys(rolePaths) },
    { name: "Institution Setup", href: "/dashboard/institution", icon: Building2, roles: ["super_admin", "admin", "institution_admin"] },
    { name: "Departments Setup", href: "/dashboard/department", icon: Layers, roles: ["institution_admin", "department_admin"] },
    { name: "Approvals Desk", href: "/dashboard/approvals", icon: CheckSquare, roles: ["department_head"] },
    { name: "Review Terminal", href: "/dashboard/review", icon: ShieldAlert, roles: ["reviewer", "super_admin"] },
    { name: "Faculty Roster", href: "/dashboard/faculty", icon: UserSquare2, roles: ["department_admin", "department_head", "faculty"] },
    { name: "My Timetable", href: "/dashboard/student", icon: GraduationCap, roles: ["student"] },
    { name: "Admin Control", href: "/dashboard/admin", icon: Users, roles: ["super_admin", "admin"] },
  ];

  const visibleNavItems = navItems.filter((item) => item.roles.includes(role));

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 bg-white border-r border-slate-200/80 lg:flex flex-col justify-between">
      <div className="flex flex-col flex-1">
        
        {/* Brand Header */}
        <div className="h-16 flex items-center px-6 border-b border-slate-100 shrink-0">
          <Link href="/" className="flex items-center">
            <Image
              src="/images/logo.png"
              alt="HourGlass Logo"
              width={140}
              height={44}
              className="h-9 w-auto"
              priority
            /> 
          </Link>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {visibleNavItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-indigo-50 text-indigo-600 shadow-sm border border-indigo-100/40"
                    : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600"
                }`}
              >
                <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-indigo-600" : "text-slate-400"}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Profile Footer Panel */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3 px-2 py-1.5 rounded-xl">
          <div className="h-9 w-9 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-black shrink-0 shadow-md shadow-indigo-600/10">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-bold text-slate-900 truncate">{user?.name || "User Workspace"}</div>
            <div className="text-[10px] font-extrabold text-indigo-600 tracking-wider uppercase mt-0.5 truncate">
              {role.replace("_", " ")}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}