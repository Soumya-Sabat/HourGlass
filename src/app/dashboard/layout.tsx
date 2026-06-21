"use client";

import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const mockUser = { name: "Priya Sharma", role: "student" };

  return (
    <div className="min-h-screen bg-[#f4ebd0] text-[#1a1a14] antialiased font-mono flex">
      {/* Sidebar - Mounted cleanly with visibility control toggles */}
      <Sidebar 
        role={mockUser.role} 
        user={mockUser} 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen lg:pl-64">
        {/* Header containing the mobile trigger button */}
        <Header onMenuClick={() => setSidebarOpen(true)} />

        {/* Content Canvas */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full mx-auto max-w-[1600px]">
          {children}
        </main>
      </div>
    </div>
  );
}