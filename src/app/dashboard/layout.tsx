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
  const name = decodeURIComponent(headerList.get("x-user-name") || "Undefined");
  const email = decodeURIComponent(headerList.get("x-user-email") || "Undefined")
  const userId = headerList.get("x-user-id") || undefined;
  const isEmailVerified = headerList.get("x-user-email-verified") === "true";
  const issuedAt = Number(headerList.get("x-user-iat") || 0) || undefined;
  const expiresAt = Number(headerList.get("x-user-exp") || 0) || undefined;

  const userSession = { name, email, role, id: userId, isEmailVerified, issuedAt, expiresAt };

  return (
    <DashboardShell userSession={userSession}>
      {children}
    </DashboardShell>
  );
}