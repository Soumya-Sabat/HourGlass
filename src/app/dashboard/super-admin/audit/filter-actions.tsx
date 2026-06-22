"use client";

import { useRouter } from "next/navigation";

export function FilterActions({ actionTypes, currentAction }: { actionTypes: string[]; currentAction: string }) {
  const router = useRouter();

  return (
    <>
      <select
        value={currentAction}
        onChange={(e) => {
          const v = e.target.value;
          router.push(v ? `?action=${v}` : ".");
        }}
        className="h-9 px-3 text-[11px] font-bold border-2 border-black bg-white focus:outline-none"
      >
        <option value="">All Actions</option>
        {actionTypes.map((a) => (
          <option key={a} value={a}>{a.replace(/_/g, " ")}</option>
        ))}
      </select>
    </>
  );
}
