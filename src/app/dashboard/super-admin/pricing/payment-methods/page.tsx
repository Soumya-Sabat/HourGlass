"use client";

import { useState, useEffect } from "react";
import { PageHeader, Card, StatusBadge, ActionButton } from "@/components/super-admin/ui";
import { CreditCard, Wallet, Building, Banknote } from "lucide-react";

const GATEWAY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Razorpay: Wallet,
  Stripe: CreditCard,
  "Bank Transfer": Building,
  Manual: Banknote,
};

export default function PaymentMethodsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    try {
      const res = await fetch("/api/super-admin/pricing/payment-methods");
      if (res.ok) setData((await res.json()).items || []);
    } catch {} finally { setLoading(false); }
  }

  if (loading) return <div className="border-2 border-[var(--border-primary)] bg-[var(--surface-white)] p-8 text-center text-[12px] font-bold">Loading...</div>;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payment Methods"
        description="Manage payment gateway configurations"
      />

      {data.length === 0 && (
        <Card>
          <div className="text-center py-8 text-[12px] font-bold text-[var(--text-primary)]/40">
            No payment gateways configured yet.
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.map((method: any) => {
          const Icon = GATEWAY_ICONS[method.gateway] || CreditCard;
          return (
            <div key={method._id?.toString()} className="border-2 border-[var(--border-primary)] bg-[var(--surface-white)] shadow-[4px_4px_0px_0px_var(--border-primary)]">
              <div className="border-b-2 border-[var(--border-primary)] bg-[var(--dark-bg)] px-4 py-3 text-[var(--light-text)] text-xs font-black uppercase flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-[var(--accent)]" />
                  <span>{method.gateway}</span>
                </div>
                <StatusBadge status={method.isEnabled ? "Enabled" : "Disabled"} />
              </div>
              <div className="p-4 space-y-3">
                <div className="text-sm font-black">{method.displayName}</div>
                <div className="text-[10px] font-bold text-gray-500 space-y-1">
                  <div>API Key: {method.apiKey ? `${method.apiKey.slice(0, 8)}...` : "Not configured"}</div>
                  <div>Webhook: {method.webhookSecret ? "Configured" : "Not configured"}</div>
                  <div>Last updated: {method.updatedAt ? new Date(method.updatedAt).toLocaleDateString() : "—"}</div>
                </div>
                <div className="flex gap-2 pt-2">
                  <ActionButton
                    label={method.isEnabled ? "Disable" : "Enable"}
                    variant={method.isEnabled ? "danger" : "primary"}
                  />
                  <ActionButton label="Configure" variant="default" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
