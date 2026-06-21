import { User, Shield, Briefcase, Users } from "lucide-react";

export default function Stakeholders() {
  const roles = [
    {
      icon: <Shield className="h-5 w-5 text-[#1a1a14]" />,
      title: "Super Admin",
      points: ["Manage all departments", "Create & delete admins", "System-wide settings", "View all timetables"]
    },
    {
      icon: <Briefcase className="h-5 w-5 text-[#1a1a14]" />,
      title: "Timetable Admin",
      points: ["Generate timetables", "Manage faculty & rooms", "Submit for approval", "Export & publish"]
    },
    {
      icon: <User className="h-5 w-5 text-[#1a1a14]" />,
      title: "HoD / Dean",
      points: ["Review submitted timetables", "Approve or request changes", "View department reports", "Read-only access"]
    },
    {
      icon: <Users className="h-5 w-5 text-[#1a1a14]" />,
      title: "Viewer",
      points: ["View published timetables", "Download / export PDF", "No edit permissions", "Faculty & student access"]
    }
  ];

  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-mono text-[#1a1a14]">
      {/* Neo-brutalist Title Banner */}
      <div className="text-center max-w-3xl mx-auto mb-16 p-6 border-2 border-[#1a1a14] bg-[#eae3cb] shadow-[4px_4px_0px_0px_#1a1a14]">
        <h2 className="text-xs uppercase font-black tracking-widest bg-[#1a1a14] text-[#f4ebd0] inline-block px-2 py-0.5 mb-3">
          Built for every stakeholder
        </h2>
        <p className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#1a1a14]">
          Role-based access ensures the right people see the right tools
        </p>
      </div>

      {/* Role Deck Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {roles.map((role, idx) => (
          <div 
            key={idx} 
            className="bg-white p-6 border-2 border-[#1a1a14] shadow-[4px_4px_0px_0px_#1a1a14] flex flex-col justify-between transition-transform hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#1a1a14]"
          >
            <div>
              {/* Header inside specific card element */}
              <div className="flex items-center gap-3 border-b-2 border-[#1a1a14] pb-4 mb-4">
                <div className="bg-[#f4ebd0] p-2 border-2 border-[#1a1a14] shadow-[2px_2px_0px_0px_#1a1a14] [&_svg]:stroke-[2.5]">
                  {role.icon}
                </div>
                <h3 className="text-base font-black uppercase tracking-tight text-[#1a1a14]">
                  {role.title}
                </h3>
              </div>
              
              {/* Thick Bullet List */}
              <ul className="space-y-3">
                {role.points.map((pt, pIdx) => (
                  <li key={pIdx} className="text-xs text-[#1a1a14]/90 flex items-start gap-2.5 font-bold">
                    <span className="text-[#1a1a14] bg-[#eae3cb] border border-[#1a1a14] px-1 text-[10px] font-black leading-none py-0.5">
                      ✓
                    </span>
                    <span className="leading-tight">{pt}</span>
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