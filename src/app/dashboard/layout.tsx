import { headers } from "next/headers";
import { UserRole } from "@/config/rbac";
import DashboardShell from "@/components/dashboard/DashboardShell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Read the secure headers injected by your proxy middleware layer
  const headerList = await headers();
  const role = (headerList.get("x-user-role") as UserRole) || "student";
  const name = decodeURIComponent(headerList.get("x-user-name") || "OPERATIVE");

  const userSession = { name, role };

  return (
    <DashboardShell userSession={userSession}>
      {children}
    </DashboardShell>
  );
}