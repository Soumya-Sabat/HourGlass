"use client";

import { ActionButton } from "@/components/super-admin/ui";

export function GDPRRowActions({ id, status }: { id: string; status: string }) {
  if (status !== "Pending") {
    return <span className="text-[10px] font-bold text-gray-500">—</span>;
  }

  return (
    <div className="flex items-center gap-2">
      <ActionButton label="Fulfill" variant="primary" onClick={() => alert(`Fulfill request ${id}`)} />
      <ActionButton label="Reject" variant="danger" onClick={() => alert(`Reject request ${id}`)} />
    </div>
  );
}
