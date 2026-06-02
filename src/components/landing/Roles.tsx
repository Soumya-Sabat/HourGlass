import { Check, ShieldAlert, CalendarRange, UserCheck } from "lucide-react";

export default function Roles() {
  const systemRoles = [
    {
      icon: <ShieldAlert className="h-5 w-5 text-indigo-600" />,
      roleName: "Super Admin",
      perms: [
        "Manage all departments & settings",
        "Create & manage admin profiles",
        "Override configuration engines",
        "Global analytics lookup view",
      ],
    },
    {
      icon: <CalendarRange className="h-5 w-5 text-indigo-600" />,
      roleName: "Timetable Admin",
      perms: [
        "Generate adaptive timetables",
        "Manage faculty, slots & rooms",
        "Submit draft configurations for approval",
        "Export metrics (PDF, Excel, ICS)",
      ],
    },
    {
      icon: <UserCheck className="h-5 w-5 text-indigo-600" />,
      roleName: "HoD / Dean",
      perms: [
        "Review submitted timetables live",
        "Approve drafts or request adjustments",
        "View historical department reports",
        "Assign priority rule preferences",
      ],
    },
  ];

  return (
    <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-14 md:mb-20">
        <h2 className="text-xs uppercase font-bold tracking-widest text-indigo-600 mb-2">Built for every stakeholder</h2>
        <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Role-based access ensures the right people see the right tools
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {systemRoles.map((role, idx) => (
          <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-5">
                <div className="bg-indigo-50 p-2.5 rounded-xl text-indigo-600">
                  {role.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900">{role.roleName}</h3>
              </div>
              <ul className="space-y-3">
                {role.perms.map((p, pIdx) => (
                  <li key={pIdx} className="text-sm text-slate-600 flex items-start gap-2.5">
                    <Check className="h-4 w-4 shrink-0 text-indigo-500 mt-0.5" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
