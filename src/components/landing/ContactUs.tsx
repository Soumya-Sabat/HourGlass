import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function ContactSection() {
  return (
    <section id="contact" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-xs uppercase font-extrabold tracking-widest text-indigo-600 mb-2">Connect With Us</h2>
        <p className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Request an enterprise deployment briefing
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Info Column */}
        <div className="lg:col-span-5 flex flex-col gap-4 justify-between">
          {[
            { icon: <Mail />, title: "Email Support", text: "deployment@schedulai.edu" },
            { icon: <Phone />, title: "Contact Phone", text: "+91 (800) 555-0199" },
            { icon: <MapPin />, title: "Institutional HQ", text: "Sector 62, Noida, UP, India" },
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex items-center gap-4">
              <div className="bg-indigo-50 p-3 rounded-xl border border-indigo-100 [&_svg]:h-5 [&_svg]:w-5 [&_svg]:text-indigo-600">
                {item.icon}
              </div>
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">{item.title}</div>
                <div className="text-base font-bold text-slate-800 mt-0.5">{item.text}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Input Form Deck */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/60 shadow-sm">
          <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Your Name</label>
                <input type="text" placeholder="Dr. Sarah Jenkins" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition font-medium" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Institutional Email</label>
                <input type="email" placeholder="dean@university.edu" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition font-medium" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Message</label>
              <textarea rows={4} placeholder="Specify estimated student batch volumes, resource constraints, or special requirements..." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition font-medium resize-none" />
            </div>
            <button type="submit" className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-extrabold px-5 py-3.5 rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-600/10 text-sm tracking-wide">
              <Send className="h-4 w-4" /> Dispatch Request
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}