import { CheckSquare, BookOpen, Users, MessageSquare, BellRing } from "lucide-react";

const HEAD_DASHBOARD_CARDS = [
  { label: "PENDING APPROVALS", value: "12", icon: CheckSquare },
  { label: "SUBJECT MAPS", value: "8", icon: BookOpen },
  { label: "FACULTY ROSTER", value: "24", icon: Users },
  { label: "DESK WIRES", value: "5", icon: MessageSquare },
];

export default function HeadDashboard() {
  return (
    <div className="space-y-6 font-mono text-[#1a1a14]">
      <div className="border-2 border-black bg-[#eae3cb] shadow-[4px_4px_0px_0px_#1a1a1a] p-4">
        <h1 className="text-lg sm:text-xl font-black uppercase tracking-tight">HEAD COMMAND CENTER</h1>
        <p className="text-[11px] mt-1 font-bold tracking-tight text-[#1a1a14]/80">
          Department head approvals, syllabus routing, faculty oversight, and official desk wires.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {HEAD_DASHBOARD_CARDS.map((card, idx) => (
          <div key={idx} className="border-2 border-black bg-white shadow-[3px_3px_0px_0px_#1a1a14] p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-black tracking-wider uppercase opacity-80">{card.label}</span>
              <card.icon className="h-4 w-4 stroke-[2.5]" />
            </div>
            <div className="text-2xl font-black">{card.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="border-2 border-black bg-[#eae3cb] shadow-[4px_4px_0px_0px_#1a1a14]">
          <div className="border-b-2 border-black bg-[#1a1a14] p-3 text-[#f4ebd0] text-xs font-black uppercase">
            Approval Queue
          </div>
          <div className="space-y-3 p-4 bg-white">
            {[
              { title: "Syllabus change request", meta: "CSE Sem 5 • Prof. Das", status: "PENDING REVIEW" },
              { title: "Faculty exchange request", meta: "MA201 • Section A", status: "AWAITING SLOT" },
              { title: "Notice publication request", meta: "Department broadcast", status: "READY TO PUBLISH" },
            ].map((item, idx) => (
              <div key={idx} className="border-2 border-black p-3 bg-[#f4ebd0]/40">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-black">{item.title}</div>
                    <div className="text-[11px] text-gray-600 mt-0.5">{item.meta}</div>
                  </div>
                  <span className="text-[8px] font-black px-1 bg-[#e28774] border border-black">{item.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-2 border-black bg-[#eae3cb] shadow-[4px_4px_0px_0px_#1a1a14]">
          <div className="border-b-2 border-black bg-[#1a1a14] p-3 text-[#f4ebd0] text-xs font-black uppercase flex items-center gap-2">
            <BellRing className="h-3.5 w-3.5" />
            Official Desk Alerts
          </div>
          <div className="space-y-3 p-4 bg-white">
            {[
              { title: "Academic council review window opens", tag: "SCHEDULE" },
              { title: "Faculty roster freeze deadline approaching", tag: "ROSTER" },
              { title: "Department notices require final approval", tag: "NOTICE" },
            ].map((alert, idx) => (
              <div key={idx} className="border border-black p-3 bg-[#f4ebd0]/30">
                <div className="flex justify-between items-start gap-2">
                  <span className="text-xs font-black uppercase tracking-tight">{alert.title}</span>
                  <span className="text-[8px] font-black px-1 bg-[#1a1a14] text-[#f4ebd0]">{alert.tag}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
