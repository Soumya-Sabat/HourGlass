"use client";

import { Kalam } from "next/font/google";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { LoginForm } from "@/components/forms/auth-forms";
import { AuthTimetableVisual } from "@/components/forms/auth-timetable-visual";

const chalkFont = Kalam({ subsets: ["latin"], weight: ["300", "400", "700"], display: "swap" });

export default function LoginPage() {
  return (
    <section className="relative z-10 grid min-h-dvh w-full grid-cols-1 overflow-x-hidden bg-[#f4ebd0] font-mono text-[#1a1a14] lg:grid-cols-[40%_60%]">
      
      {/* Visual Column Frame */}
      <div className="relative z-20 px-4 pb-4 pt-24 sm:px-6 sm:pt-28 lg:flex lg:min-h-dvh lg:items-center lg:px-8 lg:py-20 border-b-4 lg:border-b-0 lg:border-r-4 border-[#1a1a14] bg-[#eae3cb]">
        <AuthTimetableVisual mode="login" />
      </div>

      {/* Main Interaction Form Side */}
      <div className="relative z-20 flex min-h-[auto] w-full items-start justify-center px-4 pb-8 pt-6 sm:px-6 lg:min-h-dvh lg:items-center lg:justify-start lg:px-12 lg:py-20 xl:px-20">
        <div className="flex w-full max-w-[820px] flex-col justify-center">

          {/* Breadcrumb Stepper Matrix */}
          <div className="mb-4 hidden items-center justify-start gap-2 sm:flex">
            {["Request", "Verify", "Enter"].map((step, index) => (
              <span key={step} className="inline-flex items-center gap-2">
                <span className="inline-flex h-8 items-center border-2 border-[#1a1a14] bg-[#1a1a14] px-3 text-[10px] font-black uppercase text-[#f4ebd0] shadow-[2px_2px_0px_0px_#1a1a14]">
                  {step}
                </span>
                {index < 2 && <ArrowRight className="h-4 w-4 text-[#1a1a14] stroke-[2.5]" />}
              </span>
            ))}
          </div>

          {/* Chalkboard hanging from top pins - irregular wood board */}
          <div className={`${chalkFont.className} relative rounded-lg bg-[#7B5B3A] p-5 shadow-[6px_10px_0px_0px_#1a1a14] before:pointer-events-none before:absolute before:inset-0 before:rounded-lg before:bg-[repeating-linear-gradient(90deg,transparent,transparent_60px,rgba(0,0,0,0.04)_60px,rgba(0,0,0,0.04)_61px)] [clip-path:polygon(0%_5%,1.5%_0.5%,4%_1%,8%_0.3%,12%_1.2%,16%_0%,20%_0.8%,24%_0.2%,28%_1.5%,32%_0%,36%_0.7%,40%_0.1%,44%_1.3%,48%_0.4%,52%_0%,56%_0.9%,60%_0.2%,64%_1.1%,68%_0%,72%_0.6%,76%_0.3%,80%_1.4%,84%_0%,88%_0.8%,92%_0.1%,96%_1.2%,99%_0.5%,100%_4%,99.5%_8%,100%_12%,99.2%_16%,100%_20%,99.5%_24%,100%_28%,99%_32%,100%_36%,99.3%_40%,100%_44%,99.6%_48%,100%_52%,99%_56%,100%_60%,99.4%_64%,100%_68%,99.7%_72%,100%_76%,99.2%_80%,100%_84%,99.5%_88%,100%_92%,99%_96%,100%_99%,96%_99.5%,92%_100%,88%_99.3%,84%_100%,80%_99.7%,76%_100%,72%_99%,68%_100%,64%_99.4%,60%_100%,56%_99.6%,52%_100%,48%_99.2%,44%_100%,40%_99.5%,36%_100%,32%_99%,28%_100%,24%_99.3%,20%_100%,16%_99.7%,12%_100%,8%_99%,4%_100%,2%_99.5%,0%_96%,0.5%_92%,0%_88%,0.3%_84%,0%_80%,0.6%_76%,0%_72%,0.4%_68%,0%_64%,0.7%_60%,0%_56%,0.2%_52%,0%_48%,0.5%_44%,0%_40%,0.8%_36%,0%_32%,0.3%_28%,0%_24%,0.6%_20%,0%_16%,0.9%_12%,0%_8%,0.4%_4%)]`}>
            {/* Nail/peg wire anchors */}
            <span className="absolute -top-4 left-1/2 z-10 h-3 w-1 -translate-x-[3.5rem] rounded-full bg-[#C0C0C0] shadow-[1px_1px_0px_0px_#1a1a14]" />
            <span className="absolute -top-4 left-1/2 z-10 h-3 w-1 translate-x-[3.5rem] rounded-full bg-[#C0C0C0] shadow-[1px_1px_0px_0px_#1a1a14]" />
            {/* Left log pin - irregular shape */}
            <span className="absolute -top-5 left-1/2 z-20 -translate-x-[4rem] rotate-[-3deg]">
              <span className="block h-10 w-9 overflow-hidden rounded-[50%_40%_45%_55%/50%_45%_55%_45%] border-[3px] border-[#5C3D0E] bg-[#8B6914] shadow-[inset_-2px_-2px_0_2px_#A0822D,inset_2px_2px_0_2px_#6B4E0A,2px_2px_0px_0px_#1a1a14]">
                <span className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-[45%_55%_50%_50%] bg-[#5C3D0E]" />
                <span className="absolute left-[30%] top-[20%] h-1 w-0.5 rotate-[-20deg] rounded-full bg-[#6B4E0A]" />
                <span className="absolute right-[25%] bottom-[25%] h-0.5 w-1 rotate-[15deg] rounded-full bg-[#6B4E0A]" />
              </span>
            </span>
            {/* Right log pin - irregular shape */}
            <span className="absolute -top-5 left-1/2 z-20 translate-x-[4rem] rotate-[2deg]">
              <span className="block h-10 w-9 overflow-hidden rounded-[45%_55%_50%_50%/40%_50%_50%_60%] border-[3px] border-[#5C3D0E] bg-[#8B6914] shadow-[inset_-2px_-2px_0_2px_#A0822D,inset_2px_2px_0_2px_#6B4E0A,2px_2px_0px_0px_#1a1a14]">
                <span className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-[50%_50%_55%_45%] bg-[#5C3D0E]" />
                <span className="absolute right-[30%] top-[25%] h-0.5 w-1 rotate-[25deg] rounded-full bg-[#6B4E0A]" />
                <span className="absolute left-[20%] bottom-[30%] h-1 w-0.5 rotate-[-10deg] rounded-full bg-[#6B4E0A]" />
              </span>
            </span>

            <div className="mb-5 flex items-start justify-between gap-4 border-b-2 border-[#f4ebd0]/20 pb-5">
              <div className="space-y-3">
                <span className="inline-flex border-2 border-[#f4ebd0] bg-[#e28774] px-3 py-1 text-xl font-black uppercase text-[#1a1a14] shadow-[2px_2px_0px_0px_#f4ebd0]">
                  HourGlass Login
                </span>
                <h1 className="text-2xl font-black uppercase tracking-tight text-[#f4ebd0] sm:text-3xl">
                  Welcome back.
                </h1>
                <p className="text-xs font-bold leading-relaxed text-[#f4ebd0]/80">
                  Use your registered email to receive a one-time passcode and continue to your timetable dashboard.
                </p>
              </div>
              
              {/* OTP Badge Block */}
              <span className="inline-flex h-9 shrink-0 items-center gap-1.5 border-2 border-[#f4ebd0] bg-[#1a1a14] px-3 text-xl font-black uppercase text-[#f4ebd0] shadow-[2px_2px_0px_0px_#f4ebd0]">
                <ShieldCheck className="h-4 w-4 stroke-[2.5]" />
                OTP
              </span>
            </div>

            <LoginForm />
          </div>

        </div>
      </div>
    </section>
  );
}
