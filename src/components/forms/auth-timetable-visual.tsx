"use client";

import { CalendarClock, ChartNoAxesColumnIncreasing, CheckCheck, Sparkles } from "lucide-react";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const periods = ["08:30", "09:20", "10:10", "11:20", "12:10", "02:00"];
const classes = [
  { label: "PHY", area: "Lab 2", color: "bg-blue-500", cell: "col-start-2 row-start-2", delay: "0s" },
  { label: "MTH", area: "Room 104", color: "bg-emerald-500", cell: "col-start-4 row-start-3", delay: "0.5s" },
  { label: "CSE", area: "Lab 1", color: "bg-orange-500", cell: "col-start-3 row-start-5", delay: "1s" },
  { label: "ENG", area: "Room 208", color: "bg-violet-500", cell: "col-start-5 row-start-4", delay: "1.5s" },
];

export function AuthTimetableVisual({ mode }: { mode: "login" | "register" }) {
  return (
    <div className="relative min-h-[22rem] w-full overflow-hidden rounded-lg border border-white/70 bg-white/45 p-4 shadow-xl shadow-slate-900/10 backdrop-blur-md sm:min-h-[28rem] lg:min-h-[calc(100dvh-9rem)]">
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes slotPulse {
              0%, 100% { transform: translateY(0); opacity: 0.9; }
              50% { transform: translateY(-8px); opacity: 1; }
            }

            @keyframes scanLine {
              0% { transform: translateX(-110%); }
              100% { transform: translateX(110%); }
            }

            @keyframes barGrow {
              0%, 100% { transform: scaleX(0.62); }
              50% { transform: scaleX(1); }
            }
          `,
        }}
      />

      <div className="relative z-10 flex h-full min-h-[20rem] flex-col justify-between gap-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase text-orange-600">HourGlass AI</p>
            <h2 className="mt-2 text-2xl font-black text-slate-950 sm:text-4xl">
              {mode === "login" ? "Resume the schedule." : "Build the timetable."}
            </h2>
          </div>
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-950 text-white shadow-lg">
            <Sparkles className="h-5 w-5" />
          </span>
        </div>

        <div className="relative overflow-hidden rounded-lg border border-slate-200/80 bg-white/80 p-3 shadow-lg shadow-slate-900/5">
          <div className="absolute inset-y-0 left-0 z-20 w-1/2 bg-gradient-to-r from-transparent via-sky-100/70 to-transparent" style={{ animation: "scanLine 4.5s linear infinite" }} />
          <div className="grid grid-cols-[4rem_repeat(5,minmax(0,1fr))] gap-1 text-[10px] font-black uppercase text-slate-500">
            <span />
            {days.map((day) => (
              <span key={day} className="rounded-md bg-slate-100 px-2 py-2 text-center">
                {day}
              </span>
            ))}
            {periods.map((period) => (
              <span key={period} className="rounded-md bg-slate-50 px-2 py-3 text-center text-slate-400">
                {period}
              </span>
            ))}
            {Array.from({ length: 30 }, (_, index) => (
              <span key={index} className="min-h-10 rounded-md border border-dashed border-slate-200 bg-white/70" />
            ))}
          </div>

          <div className="pointer-events-none absolute inset-3 grid grid-cols-[4rem_repeat(5,minmax(0,1fr))] grid-rows-6 gap-1">
            {classes.map((item) => (
              <div
                key={item.label}
                className={`${item.cell} ${item.color} z-30 flex min-h-10 flex-col justify-center rounded-md px-2 text-white shadow-lg`}
                style={{ animation: `slotPulse 5s ease-in-out ${item.delay} infinite` }}
              >
                <span className="text-xs font-black">{item.label}</span>
                <span className="truncate text-[9px] font-bold opacity-85">{item.area}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { icon: CalendarClock, label: "Conflicts", value: "0" },
            { icon: ChartNoAxesColumnIncreasing, label: "Utilization", value: "87%" },
            { icon: CheckCheck, label: "Approvals", value: "3-step" },
          ].map((metric, index) => {
            const Icon = metric.icon;

            return (
              <div key={metric.label} className="rounded-lg border border-white/70 bg-white/65 p-3 shadow-sm">
                <div className="flex items-center gap-2 text-slate-500">
                  <Icon className="h-4 w-4" />
                  <span className="text-[10px] font-black uppercase">{metric.label}</span>
                </div>
                <p className="mt-2 text-xl font-black text-slate-950">{metric.value}</p>
                <span className="mt-3 block h-1.5 origin-left rounded-full bg-orange-400" style={{ animation: `barGrow ${3 + index * 0.4}s ease-in-out infinite` }} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
