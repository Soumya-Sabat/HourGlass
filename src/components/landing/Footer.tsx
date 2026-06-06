import { Calendar } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white/40 backdrop-blur-md border-t border-indigo-100/50 text-slate-600 py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-sm">
          
          {/* Logo Stack */}
          <div className="flex items-center gap-2 opacity-80">
            <div className="bg-indigo-600 text-white p-1.5 rounded-lg">
              <Calendar className="h-4 w-4" />
            </div>
            <span className="font-bold text-slate-900 tracking-tight">
              Schedul<span className="text-indigo-600">AI</span>
            </span>
          </div>

          {/* Legal / Policy Routing */}
          <div className="flex flex-wrap justify-center gap-6 font-medium text-slate-500">
            <a href="#" className="hover:text-indigo-600 transition">Privacy Policy</a>
            <a href="#" className="hover:text-indigo-600 transition">Terms of Use</a>
            <a href="#" className="hover:text-indigo-600 transition">Contact</a>
            <a href="#" className="hover:text-indigo-600 transition">Support</a>
          </div>

          {/* Copyright Tagline */}
          <div className="text-xs font-semibold text-slate-400 text-center sm:text-right">
            &copy; {currentYear} SchedulAI. All rights reserved.
          </div>
          
        </div>
      </div>
    </footer>
  );
}