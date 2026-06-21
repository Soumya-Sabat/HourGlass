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
    <section id="testimonials" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-mono text-[#1a1a14]">
      {/* Neo-brutalist Header Banner */}
      <div className="text-center max-w-3xl mx-auto mb-16 p-6 border-2 border-[#1a1a14] bg-[#eae3cb] shadow-[4px_4px_0px_0px_#1a1a14]">
        <h2 className="text-xs uppercase font-black tracking-widest bg-[#1a1a14] text-[#f4ebd0] inline-block px-2 py-0.5 mb-3">
          Trusted by Educators
        </h2>
        <p className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#1a1a14]">
          Validated by leading institutions
        </p>
      </div>

      {/* Cards Matrix Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {reviews.map((review, idx) => (
          <div
            key={idx}
            className="bg-white p-6 sm:p-8 border-2 border-[#1a1a14] shadow-[4px_4px_0px_0px_#1a1a14] flex flex-col justify-between relative transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#1a1a14] group"
          >
            {/* Rigidly Boxed Absolute Quote Indicator */}
            <div className="absolute right-6 top-6 bg-[#eae3cb] border border-[#1a1a14] p-1 shadow-[1px_1px_0px_0px_#1a1a14] pointer-events-none">
              <Quote className="h-4 w-4 text-[#1a1a14] fill-[#1a1a14]" />
            </div>

            <div className="space-y-4">
              {/* Brutalist Star Matrix Container */}
              <div className="flex items-center gap-1 bg-[#1a1a14] inline-flex p-1 border border-[#1a1a14]">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-[#e28774] text-[#e28774]" />
                ))}
              </div>

              {/* Quote text block */}
              <p className="text-xs sm:text-sm text-[#1a1a14]/90 leading-relaxed font-bold">
                &ldquo;{review.quote}&rdquo;
              </p>
            </div>

            {/* Sharp Section Splitter */}
            <div className="border-t-2 border-[#1a1a14] mt-6 pt-4 flex items-center gap-4">
              {/* Hard-bordered Avatar Silhouette */}
              <div className="relative h-12 w-12 border-2 border-[#1a1a14] bg-[#f4ebd0] shadow-[2px_2px_0px_0px_#1a1a14] shrink-0">
                <Image
                  src={review.image}
                  alt={review.name}
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              </div>

              {/* Identity Details Stack */}
              <div className="min-w-0">
                <h4 className="text-xs font-black uppercase text-[#1a1a14] tracking-tight truncate">
                  {review.name}
                </h4>
                <p className="text-[11px] font-bold text-[#1a1a14]/70 truncate">
                  {review.role}
                </p>
                <span className="inline-block text-[10px] font-black text-[#1a1a14] bg-[#eae3cb] border border-[#1a1a14] px-1.5 mt-1 tracking-wide uppercase truncate">
                  {review.institution}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}