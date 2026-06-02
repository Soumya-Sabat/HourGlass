export default function Stats() {
  const stats = [
    { value: "500+", label: "Institutions" },
    { value: "12K+", label: "Timetables Generated" },
    { value: "98%", label: "Conflict-free Rate" },
    { value: "4x", label: "Faster Than Manual" },
  ];

  return (
    <section className="bg-white border-y border-slate-200 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-4 text-center divide-y-0 divide-x-0 sm:divide-x sm:divide-slate-200">
          {stats.map((stat, idx) => (
            <div key={idx} className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-indigo-600 tracking-tight">{stat.value}</div>
              <div className="text-xs sm:text-sm font-medium text-slate-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
