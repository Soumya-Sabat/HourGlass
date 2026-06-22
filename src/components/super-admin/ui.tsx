"use client";

import Link from "next/link";

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: React.ReactNode }) {
  return (
    <div className="border-2 border-black bg-[#eae3cb] shadow-[4px_4px_0px_0px_#1a1a1a] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h1 className="text-lg sm:text-xl font-black uppercase tracking-tight">{title}</h1>
        {description && <p className="text-[11px] mt-1 font-bold tracking-tight text-[#1a1a14]/70">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
    </div>
  );
}

export function StatCard({ label, value, icon: Icon, trend }: { label: string; value: string | number; icon?: React.ComponentType<{ className?: string }>; trend?: { value: string; positive: boolean } }) {
  return (
    <div className="border-2 border-black bg-white shadow-[3px_3px_0px_0px_#1a1a14] p-4">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-black tracking-wider uppercase opacity-70">{label}</span>
        {Icon && <Icon className="h-4 w-4 stroke-[2.5]" />}
      </div>
      <div className="text-2xl font-black">{value}</div>
      {trend && (
        <div className={`text-[10px] font-black mt-1 ${trend.positive ? "text-green-700" : "text-red-700"}`}>
          {trend.positive ? "↑" : "↓"} {trend.value}
        </div>
      )}
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    Pending: "bg-yellow-200 text-yellow-900",
    Approved: "bg-green-200 text-green-900",
    Rejected: "bg-red-200 text-red-900",
    Suspended: "bg-orange-200 text-orange-900",
    Active: "bg-green-200 text-green-900",
    Expired: "bg-gray-200 text-gray-700",
    Cancelled: "bg-red-200 text-red-900",
    "In Progress": "bg-blue-200 text-blue-900",
    Open: "bg-yellow-200 text-yellow-900",
    Resolved: "bg-green-200 text-green-900",
    Closed: "bg-gray-200 text-gray-700",
    Paid: "bg-green-200 text-green-900",
    Failed: "bg-red-200 text-red-900",
    Refunded: "bg-purple-200 text-purple-900",
    Draft: "bg-gray-200 text-gray-700",
    Published: "bg-green-200 text-green-900",
    Low: "bg-green-200 text-green-900",
    Medium: "bg-yellow-200 text-yellow-900",
    High: "bg-red-200 text-red-900",
    Enabled: "bg-green-200 text-green-900",
    Disabled: "bg-gray-200 text-gray-700",
    Trial: "bg-blue-200 text-blue-900",
    New: "bg-blue-200 text-blue-900",
    Reviewed: "bg-yellow-200 text-yellow-900",
    Implemented: "bg-green-200 text-green-900",
  };
  const colorClass = colors[status] || "bg-gray-100 text-gray-800";
  return (
    <span className={`inline-block text-[9px] font-black px-2 py-0.5 border border-black ${colorClass}`}>
      {status.toUpperCase()}
    </span>
  );
}

export function ActionButton({ label, href, onClick, variant = "default", icon: Icon }: {
  label: string; href?: string; onClick?: () => void; variant?: "default" | "primary" | "danger" | "ghost"; icon?: React.ComponentType<{ className?: string }>;
}) {
  const baseClass = "inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black uppercase border-2 border-black transition-all";
  const variants: Record<string, string> = {
    default: "bg-white hover:bg-[#eae3cb] shadow-[2px_2px_0px_0px_#1a1a14] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]",
    primary: "bg-[#e28774] text-white hover:bg-[#d97766] shadow-[2px_2px_0px_0px_#1a1a14] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]",
    danger: "bg-red-500 text-white hover:bg-red-600 shadow-[2px_2px_0px_0px_#1a1a14] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]",
    ghost: "bg-transparent hover:bg-[#eae3cb] border-transparent hover:border-black",
  };

  const className = `${baseClass} ${variants[variant]}`;

  if (href) {
    return <Link href={href} className={className}>{Icon && <Icon className="h-3.5 w-3.5" />}{label}</Link>;
  }
  return <button onClick={onClick} className={className}>{Icon && <Icon className="h-3.5 w-3.5" />}{label}</button>;
}

export function Table({ headers, rows }: { headers: string[]; rows: React.ReactNode[][] }) {
  return (
    <div className="border-2 border-black bg-white overflow-x-auto">
      <table className="w-full text-left text-[11px] font-mono">
        <thead>
          <tr className="border-b-2 border-black bg-[#1a1a14] text-[#f4ebd0]">
            {headers.map((h, i) => (
              <th key={i} className="px-3 py-2.5 text-[10px] font-black uppercase tracking-wider whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} className="border-b border-black/10 hover:bg-[#f4ebd0]/50 transition-colors">
              {row.map((cell, ci) => (
                <td key={ci} className="px-3 py-2.5 whitespace-nowrap font-bold">{cell}</td>
              ))}
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={headers.length} className="px-3 py-8 text-center text-[12px] font-bold text-[#1a1a14]/40">
                No records found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export function Card({ title, children, action, className = "" }: { title?: string; children: React.ReactNode; action?: React.ReactNode; className?: string }) {
  return (
    <div className={`border-2 border-black bg-[#eae3cb] shadow-[4px_4px_0px_0px_#1a1a14] ${className}`}>
      {title && (
        <div className="border-b-2 border-black bg-[#1a1a14] px-4 py-2.5 text-[#f4ebd0] text-xs font-black uppercase flex items-center justify-between">
          <span>{title}</span>
          {action}
        </div>
      )}
      <div className="p-4 bg-white">{children}</div>
    </div>
  );
}

export function Modal({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-[#f4ebd0] border-2 border-black shadow-[8px_8px_0px_0px_#1a1a14] max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="border-b-2 border-black bg-[#1a1a14] px-4 py-3 text-[#f4ebd0] text-sm font-black uppercase flex items-center justify-between">
          <span>{title}</span>
          <button onClick={onClose} className="text-[#f4ebd0] hover:text-[#e28774]">✕</button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}

export function InputField({ label, name, type = "text", defaultValue, placeholder, required, className, value, onChange }: {
  label: string; name: string; type?: string; defaultValue?: string; placeholder?: string; required?: boolean; className?: string; value?: string; onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className={className}>
      <label className="block text-[10px] font-black uppercase tracking-wider mb-1" htmlFor={name}>{label}</label>
      <input
        type={type} id={name} name={name} defaultValue={defaultValue} value={value} onChange={onChange}
        placeholder={placeholder} required={required}
        className="w-full h-9 px-3 text-[12px] font-bold border-2 border-black bg-white focus:outline-none focus:ring-2 focus:ring-[#e28774]"
      />
    </div>
  );
}

export function SelectField({ label, name, options, defaultValue, className, value, onChange }: {
  label: string; name: string; options: { value: string; label: string }[]; defaultValue?: string; className?: string; value?: string; onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) {
  return (
    <div className={className}>
      <label className="block text-[10px] font-black uppercase tracking-wider mb-1" htmlFor={name}>{label}</label>
      <select id={name} name={name} defaultValue={defaultValue} value={value} onChange={onChange} className="w-full h-9 px-3 text-[12px] font-bold border-2 border-black bg-white focus:outline-none focus:ring-2 focus:ring-[#e28774]">
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

export function Tabs({ tabs, activeTab, onTabChange }: { tabs: { id: string; label: string; count?: number }[]; activeTab: string; onTabChange: (id: string) => void }) {
  return (
    <div className="flex flex-wrap border-b-2 border-black">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-4 py-2 text-[10px] font-black uppercase border-t-2 border-l-2 border-r-2 border-black -mb-[2px] transition-all ${
            activeTab === tab.id ? "bg-white text-[#1a1a14]" : "bg-[#eae3cb] text-[#1a1a14]/60 hover:bg-white"
          }`}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span className="ml-1.5 px-1.5 py-0.5 bg-[#e28774] text-[8px] font-black">{tab.count}</span>
          )}
        </button>
      ))}
    </div>
  );
}

export function SearchInput({ value, onChange, placeholder = "Search..." }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="relative">
      <input
        type="text" value={value} onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-9 pl-8 pr-3 text-[11px] font-bold border-2 border-black bg-white focus:outline-none focus:ring-2 focus:ring-[#e28774]"
      />
      <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#1a1a14]/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
      </svg>
    </div>
  );
}

export function FilterBar({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-3 p-3 border-2 border-black bg-[#eae3cb]">
      {children}
    </div>
  );
}

export function SectionHeader({ title, count }: { title: string; count?: number }) {
  return (
    <div className="border-b-2 border-black bg-[#1a1a14] px-4 py-2.5 text-[#f4ebd0] text-xs font-black uppercase flex items-center justify-between">
      <span>{title}</span>
      {count !== undefined && <span className="text-[#e28774]">{count}</span>}
    </div>
  );
}
