"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { LoginForm } from "@/components/forms/auth-forms";
import { AuthTimetableVisual } from "@/components/forms/auth-timetable-visual";

export default function LoginPage() {
  return (
    <section className="relative z-10 grid min-h-dvh w-full grid-cols-1 overflow-x-hidden bg-[#f4ebd0] font-mono text-[#1a1a14] lg:grid-cols-[40%_60%]">
      
      {/* Visual Column Frame */}
      <div className="relative z-20 px-4 pb-4 pt-24 sm:px-6 sm:pt-28 lg:flex lg:min-h-dvh lg:items-center lg:px-8 lg:py-20 border-b-4 lg:border-b-0 lg:border-r-4 border-[#1a1a14] bg-white">
        <AuthTimetableVisual mode="login" />
      </div>

      {/* Main Interaction Form Side */}
      <div className="relative z-20 flex min-h-[auto] w-full items-start justify-center px-4 pb-8 pt-6 sm:px-6 lg:min-h-dvh lg:items-center lg:justify-start lg:px-12 lg:py-20 xl:px-20">
        <div className="w-full max-w-xl">
          
          {/* Breadcrumb Stepper Matrix */}
          <div className="mb-4 hidden items-center justify-start gap-2 sm:flex">
            {["Request", "Verify", "Enter"].map((step, index) => (
              <span key={step} className="inline-flex items-center gap-2">
                <span className="inline-flex h-8 items-center border-2 border-[#1a1a14] bg-white px-3 text-[10px] font-black uppercase text-[#1a1a14] shadow-[2px_2px_0px_0px_#1a1a14]">
                  {step}
                </span>
                {index < 2 && <ArrowRight className="h-4 w-4 text-[#1a1a14] stroke-[2.5]" />}
              </span>
            ))}
          </div>

          {/* Sharp Brutalist Main Form Enclosure Box */}
          <div className="border-4 border-[#1a1a14] bg-[#eae3cb] p-4 shadow-[8px_8px_0px_0px_#1a1a14] sm:p-6 xl:p-8">
            <div className="mb-5 flex items-start justify-between gap-4 border-b-2 border-[#1a1a14] pb-5">
              <div className="space-y-3">
                <span className="inline-flex border-2 border-[#1a1a14] bg-[#e28774] px-3 py-1 text-[10px] font-black uppercase text-[#1a1a14] shadow-[2px_2px_0px_0px_#1a1a14]">
                  HourGlass Login
                </span>
                <h1 className="text-2xl font-black uppercase tracking-tight text-[#1a1a14] sm:text-3xl">
                  Welcome back.
                </h1>
                <p className="text-xs font-bold leading-relaxed text-[#1a1a14]/80">
                  Use your registered email to receive a one-time passcode and continue to your timetable dashboard.
                </p>
              </div>
              
              {/* OTP Badge Block */}
              <span className="inline-flex h-9 shrink-0 items-center gap-1.5 border-2 border-[#1a1a14] bg-white px-3 text-[10px] font-black uppercase text-[#1a1a14] shadow-[2px_2px_0px_0px_#1a1a14]">
                <ShieldCheck className="h-4 w-4 stroke-[2.5]" />
                OTP
              </span>
            </div>

            {/* Embedded Sub-form Layout Component */}
            <LoginForm />
          </div>

        </div>
      </div>
    </section>
  );
}