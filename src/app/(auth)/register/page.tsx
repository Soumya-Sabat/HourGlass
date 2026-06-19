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
    <section className="relative z-10 grid min-h-dvh w-full grid-cols-1 overflow-x-hidden bg-[#eef7ff] font-sans lg:grid-cols-[40%_60%]">
      <div className="absolute left-5 top-5 z-50 sm:left-8 sm:top-7">
        <Link href="/" className="inline-flex transition-transform duration-300 hover:scale-[1.02]" aria-label="Go to HourGlass home">
          <Image
            src="/images/logo.png"
            alt="HourGlass Logo"
            width={176}
            height={64}
            className="h-12 w-36 object-contain mix-blend-multiply sm:h-14 sm:w-40"
            priority
          />
        </Link>
      </div>

      <div className="relative z-20 px-4 pb-4 pt-24 sm:px-6 sm:pt-28 lg:flex lg:min-h-dvh lg:items-center lg:px-8 lg:py-20">
        <AuthTimetableVisual mode="register" />
      </div>

      <div className="relative z-20 flex w-full items-start justify-center px-4 pb-8 pt-2 sm:px-6 lg:min-h-dvh lg:items-center lg:px-10 lg:py-20 xl:px-14">
        <div className="flex w-full max-w-[820px] flex-col justify-center">
          <div className="no-scrollbar relative z-10 mb-4 flex max-w-full shrink-0 items-center justify-start gap-1.5 overflow-x-auto px-1 pb-1">
            {registerSections.map((section, index) => (
              <span key={section.id} className="inline-flex items-center gap-1.5">
                <span className={`inline-flex h-7 items-center whitespace-nowrap rounded-lg border px-2.5 text-[9px] font-black uppercase shadow-xs backdrop-blur ${
                  index === currentStep
                    ? "border-orange-200 bg-orange-50 text-orange-700"
                    : "border-white/70 bg-white/55 text-slate-500"
                }`}>
                  {section.title}
                </span>
                {index < registerSections.length - 1 && <ArrowRight className="h-3 w-3 shrink-0 text-slate-400" />}
              </span>
            ))}
          </div>

          <RegisterForm currentStep={currentStep} onStepChange={setCurrentStep} />
        </div>
      </div>
    </section>
  );
}
