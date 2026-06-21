"use client";

import { useState, useEffect } from "react";
import { Calendar, CheckCircle2, BookOpen, AlertCircle, Check, BellRing, MessageSquare } from "lucide-react";

const SCHEDULE_DATA = [
  { time: "09-10", code: "CS301", type: "LECTURE", room: "Room 204", prof: "Prof. Sharma", live: true },
  { time: "10-11", code: "MA201", type: "LECTURE", room: "Room 110", prof: "Prof. Das", live: false },
  { time: "11-12", code: "CS Lab", type: "LAB", room: "Lab 101", prof: "Prof. Sharma", live: false },
  { time: "12-01", code: "CS Lab", type: "LAB", room: "Lab 101", prof: "Self", live: false },
  { time: "02-03", code: "FREE PERIOD", type: "FREE", room: "Library", prof: "-", live: false },
];

const ATTENDANCE_DATA = [
  { subj: "CS301", pct: 92 },
  { subj: "CS302", pct: 88 },
  { subj: "MA201", pct: 74 },
  { subj: "PH101", pct: 95 },
  { subj: "HU101", pct: 68 },
];

export default function StudentDashboard() {
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      };
      setCurrentTime(now.toLocaleString('en-US', options).toUpperCase());
    };

    updateTime();
    const intervalId = setInterval(updateTime, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const criticalSubjects = ATTENDANCE_DATA.filter(item => item.pct < 75);
  const criticalCount = criticalSubjects.length;

  return (
    <div className="space-y-6 font-mono text-[#1a1a14]">
      
      {/* Top Banner Context Card */}
      <div className="p-4 border-2 border-black bg-[#eae3cb] shadow-[4px_4px_0px_0px_#1a1a14]">
        <h1 className="text-lg sm:text-xl font-black uppercase tracking-tight">GOOD MORNING, PRIYA ⚡</h1>
        <p className="text-[11px] text-[#1a1a14]/80 mt-1 font-bold tracking-tight">
          B.Tech CSE • Sem 5 • Batch A — {currentTime || "LOADING SYSTEM CHRONOMETER..."}
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "CLASSES TODAY", value: SCHEDULE_DATA.length.toString(), icon: Calendar, bg: "bg-white" },
          { label: "ATTENDANCE", value: "87%", icon: CheckCircle2, bg: "bg-white" },
          { label: "TOTAL SUBJECTS", value: "7", icon: BookOpen, bg: "bg-white" },
          { label: "CRITICAL TRACKS", value: criticalCount.toString(), icon: AlertCircle, bg: criticalCount > 0 ? "bg-[#e28774]" : "bg-white" },
        ].map((kpi, idx) => (
          <div key={idx} className={`p-4 border-2 border-black ${kpi.bg} shadow-[3px_3px_0px_0px_#1a1a14]`}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-black tracking-wider uppercase opacity-80">{kpi.label}</span>
              <kpi.icon className="h-4 w-4 stroke-[2.5]" />
            </div>
            <div className="text-2xl font-black">{kpi.value}</div>
          </div>
        ))}
      </div>

      {/* Main Workspace Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-start">
        
        {/* Column 1: Schedule Panel Canvas */}
        <div className="border-2 border-black bg-[#eae3cb] shadow-[4px_4px_0px_0px_#1a1a14] flex flex-col">
          <div className="p-3 border-b-2 border-black bg-[#1a1a14] text-[#f4ebd0] font-black text-xs uppercase tracking-wide">
            TODAY&apos;S SCHEDULE MATRIX
          </div>
          <div className="p-4 space-y-3 flex-1 bg-white">
            {SCHEDULE_DATA.map((slot, idx) => (
              <div key={idx} className={`p-3 border-2 border-black flex items-center justify-between ${slot.live ? "bg-[#e28774]/20 ring-2 ring-[#e28774]" : "bg-[#f4ebd0]/30"}`}>
                <div>
                  <div className="text-xs font-black text-[#e28774]">{slot.time}</div>
                  <div className="text-sm font-black">{slot.code} <span className="text-[9px] px-1 border border-black bg-white ml-1 font-normal">{slot.type}</span></div>
                  <div className="text-[11px] font-bold text-gray-600 mt-0.5">{slot.room} • {slot.prof}</div>
                </div>
                {slot.live && <span className="h-2 w-2 rounded-full bg-red-600 animate-pulse border border-black" />}
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: Attendance Tracking Deck */}
        <div className="border-2 border-black bg-[#eae3cb] shadow-[4px_4px_0px_0px_#1a1a14] flex flex-col">
          <div className="p-3 border-b-2 border-black bg-[#1a1a14] text-[#f4ebd0] font-black text-xs uppercase">
            ATTENDANCE RECORD STATUS
          </div>
          <div className="p-4 bg-white space-y-4 flex-1">
            {ATTENDANCE_DATA.map((item, idx) => {
              const isLow = item.pct < 75;
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-black">
                    <span>{item.subj}</span>
                    <span className={isLow ? "text-red-600" : ""}>{item.pct}%</span>
                  </div>
                  <div className="w-full bg-[#f4ebd0] h-3 border border-black rounded-none overflow-hidden">
                    <div 
                      className={`h-full border-r border-black ${isLow ? "bg-[#e28774]" : "bg-[#1a1a14]"}`} 
                      style={{ width: `${item.pct}%` }} 
                    />
                  </div>
                </div>
              );
            })}
            
            {criticalCount > 0 ? (
              <div className="pt-3 border-t border-dashed border-black text-[10px] font-black text-red-600 flex items-center gap-1.5 animate-pulse">
                <AlertCircle className="h-3.5 w-3.5 shrink-0 stroke-[2.5]" />
                <span>WARNING: {criticalCount} SUBJECTS CRITICAL (&lt;75% THRESHOLD)</span>
              </div>
            ) : (
              <div className="pt-3 border-t border-dashed border-black text-[10px] font-black text-green-600 flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                <span>ALL ATTENDANCE METRICS WITHIN SYSTEM NOMINALS</span>
              </div>
            )}
          </div>
        </div>

        {/* Column 3: Fully Separated Individual Terminal Blocks */}
        <div className="space-y-6 md:col-span-2 xl:col-span-1 flex flex-col">
          
          {/* Box 3A: Standalone System Broadcast Bulletins */}
          <div className="border-2 border-black bg-[#eae3cb] shadow-[4px_4px_0px_0px_#1a1a14]">
            <div className="p-3 border-b-2 border-black bg-[#1a1a14] text-[#f4ebd0] font-black text-xs uppercase flex items-center gap-2">
              <BellRing className="h-3.5 w-3.5 text-[#e28774]" />
              <span>OFFICIAL BROADCAST NOTICES</span>
            </div>
            <div className="p-4 bg-white space-y-3 max-h-[240px] overflow-y-auto">
              {[
                { title: "Mid-term Exams Schedule", tag: "EXAM", desc: "CS301 exam scheduled for Jan 22. Syllabus: Units 1-4." },
                { title: "Timetable Revision Directive", tag: "SCHEDULE", desc: "CS301 Monday slot shifted to Thursday 2 PM." },
              ].map((note, idx) => (
                <div key={idx} className="p-2.5 border border-black bg-[#eae3cb]/30 space-y-1">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-xs font-black uppercase tracking-tight leading-tight">{note.title}</span>
                    <span className="text-[8px] font-black px-1 bg-[#1a1a14] text-[#f4ebd0] shrink-0">{note.tag}</span>
                  </div>
                  <p className="text-[11px] text-gray-700 leading-tight">{note.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Box 3B: Standalone App Transmission Wire */}
          <div className="border-2 border-black bg-[#eae3cb] shadow-[4px_4px_0px_0px_#1a1a14]">
            <div className="p-3 border-b-2 border-black bg-[#1a1a14] text-[#f4ebd0] font-black text-xs uppercase flex items-center gap-2">
              <MessageSquare className="h-3.5 w-3.5 text-[#e28774]" />
              <span>TRANSMISSION WIRE // DESK DESPATCH</span>
            </div>
            <div className="p-4 bg-white space-y-3">
              <textarea 
                placeholder="DISPATCH QUERY OR INTER-APP WIRE TO INSTRUCTOR RECON..." 
                className="w-full p-2.5 bg-white border border-black rounded-none text-xs font-bold uppercase focus:outline-none placeholder:text-gray-400 focus:bg-[#eae3cb]/10"
                rows={3}
              />
              <button className="w-full py-2 bg-[#1a1a14] text-[#f4ebd0] font-black text-xs uppercase hover:bg-[#e28774] hover:text-[#1a1a14] transition-all border border-black flex items-center justify-center gap-1.5 shadow-[2px_2px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_#000]">
                <Check className="h-3.5 w-3.5 stroke-[3]" />
                <span>EXECUTE WIRE ROUTING</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}