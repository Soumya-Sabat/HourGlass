"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { RegisterForm } from "@/components/forms/auth-forms";
import { registerSections } from "@/components/forms/auth-register-sections";
import { AuthTimetableVisual } from "@/components/forms/auth-timetable-visual";

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <section className="relative z-10 grid min-h-dvh w-full grid-cols-1 overflow-x-hidden bg-[#f4ebd0] font-mono text-[#1a1a14] lg:grid-cols-[40%_60%]">
      
      {/* Visual Frame Split Screen Column */}
      <div className="relative z-20 px-4 pb-4 pt-24 sm:px-6 sm:pt-28 lg:flex lg:min-h-dvh lg:items-center lg:px-8 lg:py-20 border-b-4 lg:border-b-0 lg:border-r-4 border-[#1a1a14] bg-white">
        <AuthTimetableVisual mode="register" />
      </div>

      {/* Interactive Registration Content Side */}
      <div className="relative z-20 flex w-full items-start justify-center px-4 pb-8 pt-6 sm:px-6 lg:min-h-dvh lg:items-center lg:px-10 lg:py-20 xl:px-14">
        <div className="flex w-full max-w-[820px] flex-col justify-center">
          
          {/* Neo-brutalist Step Indicator Track */}
          <div className="no-scrollbar relative z-10 mb-4 flex max-w-full shrink-0 items-center justify-start gap-1.5 overflow-x-auto px-1 pb-2">
            {registerSections.map((section, index) => (
              <span key={section.id} className="inline-flex items-center gap-1.5">
                <span className={`inline-flex h-7 items-center whitespace-nowrap border-2 border-[#1a1a14] px-2.5 text-[9px] font-black uppercase tracking-tight shadow-[2px_2px_0px_0px_#1a1a14] transition-all ${
                  index === currentStep
                    ? "bg-[#e28774] text-[#1a1a14]"
                    : "bg-white text-[#1a1a14]/60"
                }`}>
                  {section.title}
                </span>
                {index < registerSections.length - 1 && (
                  <ArrowRight className="h-3.5 w-3.5 shrink-0 text-[#1a1a14] stroke-[2.5]" />
                )}
              </span>
            ))}
          </div>

          {/* Form wrapper layout is configured inside the component mapping directly */}
          <RegisterForm currentStep={currentStep} onStepChange={setCurrentStep} />
        </div>
      </div>
    </section>
  );
}