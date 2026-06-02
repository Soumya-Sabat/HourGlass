import { Check } from "lucide-react";

export default function Stakeholders() {
  const roles = [
    { title: "Super Admin", perks: ["Manage all institutional departments", "Provision & govern access roles", "Audit global history logs", "Configure macro system parameters"] },
    { title: "Timetable Admin", perks: ["Generate layout variations via AI", "Govern faculty parameters & spaces", "Submit versions up for multi-level checks", "Export cleanly to PDF / Xlsx sheets"] },
    { title: "HoD / Dean", perks: ["Review sub-department iterations", "Leave structural change logs", "Approve drafts into active staging states", "View global balance metrics charts"] },
  ];

  return (
    <section className="py-20 lg:py-28 bg-white border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-base font-semibold tracking-wider text-indigo-600 uppercase">Granular Access</h2>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Built for every layer of authority
          </p>
        </div>
        <div className="grid gap-8 lg:grid-cols-3">
          {roles.map((role, idx) => (
            <div key={idx} className="rounded-2xl border border-slate-200 bg-slate-50/40 p-8 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-6 pb-2 border-b border-slate-200">{role.title}</h3>
                <ul className="space-y-3.5">
                  {role.perks.map((perk, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                      <Check className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}