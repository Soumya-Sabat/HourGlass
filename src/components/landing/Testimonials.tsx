import Image from "next/image";
import { Star, Quote } from "lucide-react";

export default function Testimonials() {
  const reviews = [
    {
      name: "Dr. Arisvham Murthy",
      role: "Dean of Academics",
      institution: "VIT University",
      image: "/images/testimonials/people.webp", 
      quote: "What used to take our administrative committee three weeks of back-and-forth negotiations now takes less than ten minutes. SchedulAI effortlessly handled our multi-shift labs and parallel NEP elective tracks with zero errors.",
      rating: 5,
    },
    {
      name: "Prof. Clara Simons",
      role: "Timetable Coordinator",
      institution: "St. Xavier's College",
      image: "/images/testimonials/avatar2.webp",
      quote: "The faculty leave re-scheduling feature is an absolute lifesaver. When a professor goes on unexpected leave, the AI automatically shuffles open rooms and substitutes available staff without disrupting the entire week's schema.",
      rating: 5,
    },
    {
      name: "Dr. Rajesh Chatterjee",
      role: "Head of CSE Department",
      institution: "IIT Tech Institute",
      image: "/images/testimonials/avatar3.webp",
      quote: "Role-based approval loops changed how we operate. As a HoD, I can review the automatically generated options, leave pinpointed adjustments, and pass it directly up to the Dean for instant institutional publishing.",
      rating: 5,
    },
  ];

  return (
    <section id="testimonials" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header Block */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-xs uppercase font-extrabold tracking-widest text-indigo-600 mb-2">
          Trusted by Educators
        </h2>
        <p className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Validated by leading institutions
        </p>
      </div>

      {/* Cards Matrix Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {reviews.map((review, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/60 shadow-sm flex flex-col justify-between relative hover:shadow-md transition-all duration-300 group"
          >
            {/* Top Design Element: Absolute layout quotation marker */}
            <Quote className="absolute right-6 top-6 h-8 w-8 text-indigo-50 opacity-40 group-hover:text-indigo-100 transition-colors pointer-events-none" />

            <div className="space-y-4">
              {/* Star Rating Matrix */}
              <div className="flex items-center gap-1">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Quote text block */}
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium italic">
                &ldquo;{review.quote}&rdquo;
              </p>
            </div>

            {/* Separator Line */}
            <div className="border-t border-slate-100 my-6 pt-4 flex items-center gap-4">
              {/* User Avatar Silhouette */}
              <div className="relative h-12 w-12 rounded-full overflow-hidden bg-indigo-50 border border-indigo-100 shrink-0">
                <Image
                  src={review.image}
                  alt={review.name}
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              </div>

              {/* Identity Stack */}
              <div className="min-w-0">
                <h4 className="text-sm font-black text-slate-900 tracking-tight truncate">
                  {review.name}
                </h4>
                <p className="text-xs font-bold text-slate-400 truncate">
                  {review.role}
                </p>
                <p className="text-[11px] font-extrabold text-indigo-600 tracking-wide uppercase mt-0.5 truncate">
                  {review.institution}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}