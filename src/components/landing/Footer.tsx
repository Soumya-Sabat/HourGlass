import { Hourglass } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2 font-bold text-lg text-white">
            <Hourglass className="h-5 w-5 text-indigo-500" />
            <span>HourGlass</span>
          </div>
          <p className="text-slate-500 max-w-xs leading-relaxed">
            Automating institutional complexity through modern constraint scheduling algorithms.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-3">Product</h4>
          <ul className="space-y-2">
            <li><a href="#features" className="hover:text-white transition">Features</a></li>
            <li><a href="#how-it-works" className="hover:text-white transition">How It Works</a></li>
            <li><a href="#pricing" className="hover:text-white transition">Pricing Options</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-3">Legal</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-white transition">Terms of Use</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-3">Contact</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-white transition">Support</a></li>
            <li><a href="#contact" className="hover:text-white transition">Request a Demo</a></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 border-t border-slate-900 text-center text-slate-600 text-[11px] sm:text-xs">
        &copy; {new Date().getFullYear()} HourGlass. All rights reserved.
      </div>
    </footer>
  );
}
