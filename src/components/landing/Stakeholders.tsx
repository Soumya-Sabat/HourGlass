import { User, Shield, Briefcase, Users } from "lucide-react";

export default function Stakeholders() {
  const roles = [
    {
      icon: <Shield className="h-5 w-5 text-indigo-600" />,
      title: "Super Admin",
      points: ["Manage all departments", "Create & delete admins", "System-wide settings", "View all timetables"]
    },
    {
      icon: <Briefcase className="h-5 w-5 text-indigo-600" />,
      title: "Timetable Admin",
      points: ["Generate timetables", "Manage faculty & rooms", "Submit for approval", "Export & publish"]
    },
    {
      icon: <User className="h-5 w-5 text-indigo-600" />,
      title: "HoD / Dean",
      points: ["Review submitted timetables", "Approve or request changes", "View department reports", "Read-only access"]
    },
    {
      icon: <Users className="h-5 w-5 text-indigo-600" />,
      title: "Viewer",
      points: ["View published timetables", "Download / export PDF", "No edit permissions", "Faculty & student access"]
    }
  ];

  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-xs uppercase font-extrabold tracking-widest text-indigo-600 mb-2">Built for every stakeholder</h2>
        <p className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Role-based access ensures the right people see the right tools
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {roles.map((role, idx) => (
          <div 
            key={idx} 
            className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-300"
          >
            <div>
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-4">
                <div className="bg-indigo-50 p-2 rounded-lg border border-indigo-100">
                  {role.icon}
                </div>
                <h3 className="text-lg font-bold tracking-tight text-slate-900">{role.title}</h3>
              </div>
              <ul className="space-y-3">
                {role.points.map((pt, pIdx) => (
                  <li key={pIdx} className="text-xs sm:text-sm text-slate-600 flex items-start gap-2.5 font-medium">
                    <span className="text-emerald-500 font-bold text-sm leading-none">✔</span>
                    <span>{pt}</span>
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