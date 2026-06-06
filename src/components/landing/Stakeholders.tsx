export default function Stakeholders() {
  const roles = [
    {
      title: "Super Admin",
      items: ["Manage all departments", "Create & delete admins", "System-wide settings", "View all timetables"],
    },
    {
      title: "Timetable Admin",
      items: ["Generate timetables", "Manage faculty & rooms", "Submit for approval", "Export & publish"],
    },
    {
      title: "HoD / Dean",
      items: ["Review submitted timetables", "Approve or request changes", "View department reports", "Read-only access"],
    },
    {
      title: "Viewer",
      items: ["View published timetables", "Download / export PDF", "No edit permissions", "Faculty & student access"],
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-slate-100 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Built for every stakeholder</h2>
          <p className="text-base text-slate-500 mt-2 font-medium">Role-based access ensures the right people see the right tools</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {roles.map((role, idx) => (
            /* Replaced white card backgrounds with high-visibility, deep blue-green profiles */
            <div key={idx} className="bg-gradient-to-br from-blue-600 to-emerald-600 text-white p-6 rounded-2xl shadow-xl flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-black tracking-tight border-b border-white/20 pb-3 mb-4">{role.title}</h3>
                <ul className="space-y-2.5">
                  {role.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="text-xs sm:text-sm text-blue-50 flex items-center gap-2 font-medium">
                      <span className="text-emerald-300">✓</span> {item}
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