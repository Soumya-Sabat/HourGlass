"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { useTheme } from "@/components/ThemeProvider";
import {
  Building2, Users, CreditCard, BarChart3, AlertTriangle,
  Settings, ShieldCheck, Megaphone, X, ChevronDown, ChevronRight,
  Hourglass, Search, Star, BookOpen, UserCheck, GraduationCap,
  UserRound, UserPlus, Activity, DollarSign, Receipt, Wallet,
  Tag, RotateCcw, TrendingUp, LayoutDashboard, Clock, Cpu,
  MapPin, GitBranch, FileText, CalendarClock, Ticket, MessageCircle,
  Lightbulb, Terminal, Mail, Bell, Key, Lock, Database,
  Wrench, Flag, FileSearch, FileCheck, Globe, Send,
  Newspaper, BarChart, PieChart, Link2, ListTodo, Shield,
  Download, Upload, Eye, EyeOff, Moon, SunMedium,
} from "lucide-react";

interface SidebarItem { name: string; href: string; icon: React.ComponentType<{ className?: string }>; badge?: string }
interface SidebarSection { title: string; icon: React.ComponentType<{ className?: string }>; defaultExpanded: boolean; items: SidebarItem[] }

const SIDEBAR_SECTIONS: SidebarSection[] = [
  {
    title: "INSTITUTIONS MANAGEMENT",
    icon: Building2,
    defaultExpanded: true,
    items: [
      { name: "All Institutions", href: "/dashboard/super-admin/institutions", icon: Building2 },
      { name: "Pending Approvals", href: "/dashboard/super-admin/institutions/pending", icon: Clock },
      { name: "Approved Institutions", href: "/dashboard/super-admin/institutions/approved", icon: UserCheck, badge: "APPROVED" },
      { name: "Rejected Institutions", href: "/dashboard/super-admin/institutions/rejected", icon: X },
      { name: "Suspended Institutions", href: "/dashboard/super-admin/institutions/suspended", icon: Shield },
    ],
  },
  {
    title: "USER & ADMIN MANAGEMENT",
    icon: Users,
    defaultExpanded: false,
    items: [
      { name: "All Users", href: "/dashboard/super-admin/users", icon: Users },
      { name: "Super Admins", href: "/dashboard/super-admin/users/super-admins", icon: ShieldCheck },
      { name: "Department Admins", href: "/dashboard/super-admin/users/department-admins", icon: UserRound },
      { name: "Faculty", href: "/dashboard/super-admin/users/faculty", icon: GraduationCap },
      { name: "Students", href: "/dashboard/super-admin/users/students", icon: BookOpen },
      { name: "Invite New Admin", href: "/dashboard/super-admin/users/invite", icon: UserPlus },
      { name: "User Activity Logs", href: "/dashboard/super-admin/users/activity-logs", icon: Activity },
    ],
  },
  {
    title: "PRICING & SUBSCRIPTIONS",
    icon: CreditCard,
    defaultExpanded: false,
    items: [
      { name: "Pricing Plans", href: "/dashboard/super-admin/pricing", icon: DollarSign },
      { name: "Create New Plan", href: "/dashboard/super-admin/pricing/create", icon: Receipt },
      { name: "Subscriptions", href: "/dashboard/super-admin/pricing/subscriptions", icon: CreditCard },
      { name: "Billing History", href: "/dashboard/super-admin/pricing/billing", icon: FileText },
      { name: "Payment Methods", href: "/dashboard/super-admin/pricing/payment-methods", icon: Wallet },
      { name: "Discounts & Coupons", href: "/dashboard/super-admin/pricing/discounts", icon: Tag },
      { name: "Refunds", href: "/dashboard/super-admin/pricing/refunds", icon: RotateCcw },
      { name: "Revenue Analytics", href: "/dashboard/super-admin/pricing/revenue", icon: TrendingUp },
    ],
  },
  {
    title: "ANALYTICS & REPORTS",
    icon: BarChart3,
    defaultExpanded: false,
    items: [
      { name: "Dashboard Overview", href: "/dashboard/super-admin/analytics", icon: LayoutDashboard },
      { name: "Institution Analytics", href: "/dashboard/super-admin/analytics/institution", icon: Building2 },
      { name: "User Activity", href: "/dashboard/super-admin/analytics/user-activity", icon: Activity },
      { name: "AI Performance", href: "/dashboard/super-admin/analytics/ai-performance", icon: Cpu },
      { name: "Resource Utilization", href: "/dashboard/super-admin/analytics/resource-utilization", icon: MapPin },
      { name: "Conflict Reports", href: "/dashboard/super-admin/analytics/conflicts", icon: GitBranch },
      { name: "Custom Reports", href: "/dashboard/super-admin/analytics/custom-reports", icon: FileText },
      { name: "Scheduled Reports", href: "/dashboard/super-admin/analytics/scheduled-reports", icon: CalendarClock },
    ],
  },
  {
    title: "COMPLAINTS & SUPPORT",
    icon: AlertTriangle,
    defaultExpanded: false,
    items: [
      { name: "All Tickets", href: "/dashboard/super-admin/support", icon: Ticket },
      { name: "Open Tickets", href: "/dashboard/super-admin/support/open", icon: Ticket },
      { name: "In Progress", href: "/dashboard/super-admin/support/in-progress", icon: Activity },
      { name: "Resolved Tickets", href: "/dashboard/super-admin/support/resolved", icon: CheckCircle },
      { name: "Create Ticket", href: "/dashboard/super-admin/support/create", icon: FileText },
      { name: "FAQ Management", href: "/dashboard/super-admin/support/faq", icon: MessageCircle },
      { name: "Feedback", href: "/dashboard/super-admin/support/feedback", icon: Lightbulb },
      { name: "System Logs", href: "/dashboard/super-admin/support/system-logs", icon: Terminal },
    ],
  },
  {
    title: "SYSTEM SETTINGS",
    icon: Settings,
    defaultExpanded: false,
    items: [
      { name: "General Settings", href: "/dashboard/super-admin/settings", icon: Settings },
      { name: "Email Settings", href: "/dashboard/super-admin/settings/email", icon: Mail },
      { name: "Email Templates", href: "/dashboard/super-admin/settings/email-templates", icon: FileText },
      { name: "Notifications", href: "/dashboard/super-admin/settings/notifications", icon: Bell },
      { name: "API Keys", href: "/dashboard/super-admin/settings/api-keys", icon: Key },
      { name: "Security Settings", href: "/dashboard/super-admin/settings/security", icon: Lock },
      { name: "Backup & Recovery", href: "/dashboard/super-admin/settings/backup", icon: Database },
      { name: "Maintenance Mode", href: "/dashboard/super-admin/settings/maintenance", icon: Wrench },
      { name: "Feature Flags", href: "/dashboard/super-admin/settings/feature-flags", icon: Flag },
    ],
  },
  {
    title: "AUDIT & COMPLIANCE",
    icon: ShieldCheck,
    defaultExpanded: false,
    items: [
      { name: "Audit Logs", href: "/dashboard/super-admin/audit", icon: FileSearch },
      { name: "Data Privacy", href: "/dashboard/super-admin/audit/data-privacy", icon: FileCheck },
      { name: "GDPR Requests", href: "/dashboard/super-admin/audit/gdpr", icon: Globe },
      { name: "Compliance Reports", href: "/dashboard/super-admin/audit/compliance", icon: FileText },
    ],
  },
  {
    title: "ANNOUNCEMENTS & COMMS",
    icon: Megaphone,
    defaultExpanded: false,
    items: [
      { name: "All Announcements", href: "/dashboard/super-admin/announcements", icon: Newspaper },
      { name: "Create Announcement", href: "/dashboard/super-admin/announcements/create", icon: Send },
      { name: "Email Campaigns", href: "/dashboard/super-admin/announcements/email-campaigns", icon: Mail },
      { name: "In-App Notifications", href: "/dashboard/super-admin/announcements/in-app-notifications", icon: Bell },
      { name: "Feedback Surveys", href: "/dashboard/super-admin/announcements/surveys", icon: BarChart },
    ],
  },
];

function CheckCircle({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

export interface SuperAdminSidebarProps {
  role: string;
  user: { name?: string; email?: string };
  isOpen: boolean;
  onClose: () => void;
}

export default function SuperAdminSidebar({ role, user, isOpen, onClose }: SuperAdminSidebarProps) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(() => {
    const initialState: Record<string, boolean> = {};
    SIDEBAR_SECTIONS.forEach((section) => {
      initialState[section.title] = section.defaultExpanded || false;
    });
    return initialState;
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [pinnedSections, setPinnedSections] = useState<string[]>(["INSTITUTIONS MANAGEMENT"]);

  function toggleSection(title: string) {
    setExpandedSections((prev) => ({ ...prev, [title]: !prev[title] }));
  }

  function isActive(href: string) {
    if (href === "/dashboard/super-admin" && pathname === "/dashboard/super-admin") return true;
    if (href !== "/dashboard/super-admin" && pathname.startsWith(href)) return true;
    return false;
  }

  function isSectionActive(items: { href: string }[]) {
    return items.some((item) => isActive(item.href));
  }

  const filteredSections = SIDEBAR_SECTIONS.map((section) => ({
    ...section,
    items: section.items.filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        section.title.toLowerCase().includes(searchQuery.toLowerCase()),
    ),
  })).filter((section) => section.title.toLowerCase().includes(searchQuery.toLowerCase()) || section.items.length > 0);

  const pinnedItems = pinnedSections
    .map((title) => SIDEBAR_SECTIONS.find((s) => s.title === title))
    .filter(Boolean)
    .flatMap((s) => s?.items || [])
    .slice(0, 5);

  return (
    <>
      {isOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={onClose} />}

      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-[var(--bg-primary)] border-r-2 border-[var(--border-primary)] flex flex-col transition-transform duration-200 lg:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } font-mono text-[var(--text-primary)]`}>

        <div className="flex flex-col flex-1 min-h-0">
          <div className="h-14 flex items-center justify-between px-3 border-b-2 border-[var(--border-primary)] bg-[var(--bg-secondary)] shrink-0">
            <Link href="/dashboard/super-admin" className="flex items-center gap-2">
              <div className="h-8 w-8 bg-[var(--dark-bg)] text-[var(--light-text)] flex items-center justify-center rounded-sm border border-[var(--border-primary)]">
                <Hourglass className="h-4 w-4" />
              </div>
              <span className="text-sm font-black tracking-tight uppercase">HOURGLASS</span>
            </Link>
            <button onClick={onClose} className="lg:hidden p-1 border border-[var(--border-primary)] bg-[var(--bg-primary)]">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="px-3 py-2 border-b border-[var(--border-primary-20)]">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--text-primary-50)]" />
              <input
                type="text"
                placeholder="Search sections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-8 pl-8 pr-2 text-[11px] font-bold bg-[var(--surface-white)] border-2 border-[var(--border-primary)] outline-none focus:bg-[var(--bg-primary)] placeholder:text-[var(--text-primary-30)]"
              />
            </div>
          </div>

          {pinnedItems.length > 0 && !searchQuery && (
            <div className="px-3 py-2 border-b border-[var(--border-primary-20)]">
              <div className="text-[9px] font-black uppercase tracking-wider text-[var(--text-primary-50)] mb-1.5 flex items-center gap-1">
                <Star className="h-3 w-3" /> PINNED
              </div>
              <div className="flex flex-wrap gap-1">
                {pinnedItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`inline-flex items-center gap-1 px-2 py-1 text-[9px] font-black uppercase border ${
                      isActive(item.href)
                        ? "bg-[var(--accent)] border-[var(--border-primary)]"
                        : "bg-[var(--surface-white)] border-[var(--border-primary-30)] hover:border-[var(--border-primary)]"
                    }`}
                  >
                    <item.icon className="h-3 w-3" />
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <nav className="flex-1 overflow-y-auto min-h-0 py-2">
            {filteredSections.map((section) => (
              <div key={section.title} className="px-1">
                <div
                  onClick={() => toggleSection(section.title)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-[10px] font-black uppercase tracking-wider border-l-2 cursor-pointer ${
                    isSectionActive(section.items)
                      ? "bg-[var(--accent-20)] border-[var(--accent)] text-[var(--text-primary)]"
                      : "border-transparent hover:bg-[var(--bg-secondary)] text-[var(--text-primary-70)]"
                  } transition-colors`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <section.icon className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{section.title}</span>
                    {section.title === "COMPLAINTS & SUPPORT" && (
                      <span className="h-4 w-4 rounded-full bg-[var(--accent)] text-[8px] font-black flex items-center justify-center shrink-0">3</span>
                    )}
                    {section.title === "INSTITUTIONS MANAGEMENT" && (
                      <span className="h-4 w-4 rounded-full bg-[var(--accent)] text-[8px] font-black flex items-center justify-center shrink-0">5</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(e) => {
                        e.stopPropagation();
                        setPinnedSections((prev) =>
                          prev.includes(section.title)
                            ? prev.filter((t) => t !== section.title)
                            : [...prev, section.title],
                        );
                      }}
                      onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.click(); }}
                      className="p-0.5 hover:text-[var(--accent)] cursor-pointer"
                      title={pinnedSections.includes(section.title) ? "Unpin" : "Pin"}
                    >
                      <Star className={`h-3 w-3 ${pinnedSections.includes(section.title) ? "fill-[var(--accent)] text-[var(--accent)]" : ""}`} />
                    </span>
                    {expandedSections[section.title] ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                  </div>
                </div>

                {expandedSections[section.title] && (
                  <div className="ml-2 space-y-0.5 mt-0.5 mb-1">
                    {section.items.map((item) => {
                      const active = isActive(item.href);
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={onClose}
                          className={`flex items-center gap-2 px-3 py-1.5 text-[11px] font-bold border-l-2 transition-all ${
                            active
                              ? "bg-[var(--surface-white)] border-[var(--accent)] text-[var(--text-primary)] shadow-[2px_2px_0px_0px_var(--border-primary)] -translate-y-[1px]"
                              : "border-transparent hover:bg-[var(--bg-secondary)] hover:border-[var(--border-primary-30)] text-[var(--text-primary-80)]"
                          }`}
                        >
                          <item.icon className="h-3 w-3 shrink-0" />
                          <span className="truncate">{item.name}</span>
                          {item.badge && (
                            <span className="ml-auto text-[8px] font-black px-1 bg-[var(--dark-bg)] text-[var(--light-text)]">{item.badge}</span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>

        <div className="border-t-2 border-[var(--border-primary)] bg-[var(--bg-secondary)] shrink-0">
          <div className="flex items-center justify-between px-3 py-1.5 border-b border-[var(--border-primary-20)]">
            <button
              onClick={toggleTheme}
              className="flex items-center gap-1.5 px-2 py-1 text-[9px] font-black uppercase border border-[var(--border-primary-30)] hover:border-[var(--border-primary)] bg-[var(--surface-white)]"
            >
              {theme === "dark" ? <SunMedium className="h-3 w-3" /> : <Moon className="h-3 w-3" />}
              {theme === "dark" ? "LIGHT" : "DARK"}
            </button>
            <Link href="/dashboard/super-admin/settings" className="flex items-center gap-1 px-2 py-1 text-[9px] font-black uppercase border border-[var(--border-primary-30)] hover:border-[var(--border-primary)] bg-[var(--surface-white)]">
              <Settings className="h-3 w-3" />
              SETTINGS
            </Link>
          </div>
          <div className="flex items-center gap-2 p-2.5">
            <div className="h-8 w-8 bg-[var(--dark-bg)] text-[var(--accent)] flex items-center justify-center text-xs font-black shrink-0 border border-[var(--border-primary)]">
              {user?.name?.charAt(0).toUpperCase() || "S"}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[11px] font-black truncate">{user?.name || "SUPER ADMIN"}</div>
              <div className="text-[8px] font-bold text-[var(--text-primary-60)] truncate">{user?.email || ""}</div>
            </div>
            <Link
              href="/login"
              className="h-6 px-2 text-[8px] font-black uppercase bg-[var(--surface-white)] border border-[var(--border-primary)] hover:bg-[var(--accent)] flex items-center"
            >
              LOGOUT
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
