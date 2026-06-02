import { ArrowRight } from "lucide-react";

export default function CTA() {
  return (
    <section className="bg-indigo-600 text-white py-16 px-4 text-center relative overflow-hidden">
      {/* Decorative ambient blobs */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 transform -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-48 h-48 bg-indigo-700 rounded-full mix-blend-multiply filter blur-xl opacity-50 transform translate-x-1/3 translate-y-1/3" />

      <div className="max-w-4xl mx-auto space-y-6 relative z-10">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Ready to stop building timetables manually?
        </h2>
        <p className="text-indigo-100 max-w-xl mx-auto text-sm sm:text-base">
          Join 500+ institutions already saving weeks of administrative overhead every single semester.
        </p>
        <div className="pt-2">
          <button className="inline-flex items-center justify-center gap-2 bg-white text-indigo-700 font-semibold px-6 py-3.5 rounded-xl hover:bg-slate-50 transition shadow-lg w-full sm:w-auto">
            Get Started Free <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
