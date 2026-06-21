"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { LoginForm } from "@/components/forms/auth-forms";
import { AuthTimetableVisual } from "@/components/forms/auth-timetable-visual";

export default function LoginPage() {
  return (
    <section className="relative z-10 grid min-h-dvh w-full grid-cols-1 overflow-x-hidden bg-[#eef7ff] font-sans lg:grid-cols-[40%_60%]">
      <div className="relative z-20 px-4 pb-4 pt-24 sm:px-6 sm:pt-28 lg:flex lg:min-h-dvh lg:items-center lg:px-8 lg:py-20">
        <AuthTimetableVisual mode="login" />
      </div>

      <div className="relative z-20 flex min-h-[auto] w-full items-start justify-center px-4 pb-8 pt-2 sm:px-6 lg:min-h-dvh lg:items-center lg:justify-start lg:px-12 lg:py-20 xl:px-20">
        <div className="w-full max-w-xl">
          <div className="mb-4 hidden items-center justify-start gap-2 sm:flex">
            {["Request", "Verify", "Enter"].map((step, index) => (
              <span key={step} className="inline-flex items-center gap-2">
                <span className="inline-flex h-8 items-center rounded-lg border border-white/80 bg-white/70 px-3 text-[11px] font-black uppercase text-slate-700 shadow-sm backdrop-blur">
                  {step}
                </span>
                {index < 2 && <ArrowRight className="h-3.5 w-3.5 text-slate-500" />}
              </span>
            ))}
          </div>

          <div className="rounded-lg border border-white/80 bg-white/75 p-4 shadow-2xl shadow-slate-900/10 backdrop-blur-xl transition-all duration-300 focus-within:border-orange-300 sm:p-6 xl:p-8">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div className="space-y-2">
                <span className="inline-flex rounded-lg bg-[#fef08a] px-3 py-1 text-[11px] font-black uppercase text-[#713f12] shadow-sm">
                  HourGlass Login
                </span>
                <h1 className="text-3xl font-black text-slate-950 sm:text-4xl">Welcome back.</h1>
                <p className="text-sm font-semibold leading-6 text-slate-600">
                  Use your registered email to receive a one-time passcode and continue to your timetable dashboard.
                </p>
              </div>
              <span className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 text-[11px] font-black uppercase text-emerald-700 shadow-sm">
                <ShieldCheck className="h-3.5 w-3.5" />
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
