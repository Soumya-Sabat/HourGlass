"use client";

import { PageHeader, StatCard, Card, SectionHeader } from "@/components/super-admin/ui";
import { MapPin, Users, Clock, Building2 } from "lucide-react";

const ROOM_UTILIZATION = [
  { room: "Room 101", utilization: 87, trend: "up" },
  { room: "Room 102", utilization: 72, trend: "down" },
  { room: "Room 201", utilization: 93, trend: "up" },
  { room: "Room 202", utilization: 65, trend: "down" },
  { room: "Lab 101", utilization: 91, trend: "up" },
  { room: "Lab 102", utilization: 78, trend: "up" },
  { room: "Lecture Hall A", utilization: 95, trend: "up" },
  { room: "Lecture Hall B", utilization: 84, trend: "down" },
];

const FACULTY_WORKLOAD = [
  { name: "Prof. Sharma", workload: 85, courses: 4 },
  { name: "Prof. Das", workload: 72, courses: 3 },
  { name: "Prof. Verma", workload: 91, courses: 5 },
  { name: "Prof. Gupta", workload: 68, courses: 3 },
  { name: "Prof. Singh", workload: 79, courses: 4 },
];

const PEAK_TIMES = [
  { time: "09:00 - 10:00", usage: 92, label: "Peak" },
  { time: "10:00 - 11:00", usage: 88, label: "High" },
  { time: "11:00 - 12:00", usage: 85, label: "High" },
  { time: "12:00 - 13:00", usage: 45, label: "Lunch" },
  { time: "13:00 - 14:00", usage: 70, label: "Moderate" },
  { time: "14:00 - 15:00", usage: 82, label: "High" },
  { time: "15:00 - 16:00", usage: 76, label: "Moderate" },
  { time: "16:00 - 17:00", usage: 55, label: "Low" },
];

export default function ResourceUtilizationPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Resource Utilization"
        description="Monitor room usage, faculty workload, and peak times"
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Avg Room Utilization" value="83%" icon={MapPin} trend={{ value: "+5% this month", positive: true }} />
        <StatCard label="Avg Faculty Workload" value="79%" icon={Users} trend={{ value: "Within limits", positive: true }} />
        <StatCard label="Peak Hour Usage" value="92%" icon={Clock} trend={{ value: "09:00 - 10:00", positive: true }} />
        <StatCard label="Total Resources" value="24" icon={Building2} trend={{ value: "Rooms & Labs", positive: true }} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Room Utilization">
          <div className="space-y-3">
            {ROOM_UTILIZATION.map((item) => (
              <div key={item.room} className="space-y-1">
                <div className="flex justify-between text-[10px] font-black">
                  <span>{item.room}</span>
                  <span className={item.trend === "up" ? "text-green-700" : "text-red-700"}>
                    {item.utilization}% {item.trend === "up" ? "↑" : "↓"}
                  </span>
                </div>
                <div className="w-full bg-[#f4ebd0] h-3 border border-black">
                  <div
                    className="h-full bg-[#1a1a14] border-r border-black transition-all"
                    style={{ width: `${item.utilization}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Faculty Workload">
          <div className="space-y-3">
            {FACULTY_WORKLOAD.map((item) => (
              <div key={item.name} className="space-y-1">
                <div className="flex justify-between text-[10px] font-black">
                  <span>{item.name}</span>
                  <span>{item.workload}% ({item.courses} courses)</span>
                </div>
                <div className="w-full bg-[#f4ebd0] h-3 border border-black">
                  <div
                    className={`h-full border-r border-black transition-all ${
                      item.workload > 85 ? "bg-[#e28774]" : "bg-[#1a1a14]"
                    }`}
                    style={{ width: `${item.workload}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card title="Peak Time Analysis">
        <div className="space-y-3">
          {PEAK_TIMES.map((item) => (
            <div key={item.time} className="flex items-center gap-4">
              <span className="text-[10px] font-black w-28 shrink-0">{item.time}</span>
              <div className="flex-1 bg-[#f4ebd0] h-4 border border-black">
                <div
                  className={`h-full border-r border-black transition-all ${
                    item.label === "Peak" ? "bg-[#e28774]" : item.label === "High" ? "bg-[#1a1a14]" : "bg-gray-400"
                  }`}
                  style={{ width: `${item.usage}%` }}
                />
              </div>
              <span className="text-[10px] font-black w-16 text-right">{item.usage}%</span>
              <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 border border-black ${
                item.label === "Peak" ? "bg-[#e28774] text-white" : "bg-white"
              }`}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
