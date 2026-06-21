"use client";

import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import { UserRole } from "@/config/rbac";

// this is the main controller for the session data
// the flow -> login api -> jwt -> proxy headers -> layout.tsx -> dashboard shell -> header and sidebar
interface DashboardShellProps {
  children: React.ReactNode;
  userSession: {
    name: string;
    email:string;
    role: UserRole;
    id?: string;
    isEmailVerified?: boolean;
    issuedAt?: number;
    expiresAt?: number;
  };
}

export default function DashboardShell({ children, userSession }: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f4ebd0] text-[#1a1a14] antialiased font-mono flex overflow-x-hidden">
      
      {/* Dynamic Role-Namespaced Navigation Column */}
      <Sidebar 
        role={userSession.role} 
        user={userSession} 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      {/* Main Content Workspace Viewport Box */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen lg:pl-64 transition-all duration-200">
        
        {/* Global Toolbar Control Unit */}
        <Header onMenuClick={() => setSidebarOpen(true)} userSession={userSession} />

        {/* Content View Routing Section */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full mx-auto max-w-[1600px] transition-transform duration-150">
          {children}
        </main>
      </div>
    </div>
  );
}