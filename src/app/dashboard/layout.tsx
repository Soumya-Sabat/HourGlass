import { redirect } from "next/navigation";
import { getCurrentUser } from "@/auth"; 
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Use your actual custom verification utility
  const user = await getCurrentUser();

  // If the cookie token is missing, corrupted, or expired, redirect instantly
  if (!user) {
    redirect("/login");
  }

  // Fallback cleanly to 'student' if no role is securely present
  const userRole = user.role || "student";

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar gets the custom verified payload */}
      <Sidebar role={userRole} user={user} />

      <div className="flex-1 flex flex-col min-w-0 min-h-screen lg:pl-64">
        <Header user={user} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-300">
          {children}
        </main>
      </div>
    </div>
  );
}