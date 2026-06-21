import Link from "next/link";
import Image from "next/image";
import { VerifyEmailForm } from "@/components/forms/auth-forms";

export default function VerifyEmailPage() {
  return (
    <section className="grid min-h-dvh lg:grid-cols-[0.9fr_1.1fr]">
      <aside className="hidden bg-[#073B4C] px-8 xl:px-10 py-10 xl:py-12 text-white lg:flex lg:flex-col lg:justify-between">
        <Link href="/" className="text-2xl font-black tracking-wider">
          <Image
            src="/images/logo.png"
            alt="HourGlass Logo"
            width={220}
            height={80}
            className="h-auto w-44 xl:w-56 object-contain"
            priority
          />
        </Link>
        <div className="max-w-md space-y-6">
          <p className="text-sm font-black uppercase tracking-[0.3em] text-cyan-100">Email Verification</p>
          <h1 className="text-4xl xl:text-5xl font-black leading-tight">Confirm the email for your account.</h1>
          <p className="text-base font-medium leading-7 text-cyan-50/85">
            Enter the OTP sent to your inbox. After verification, your email can be used for login.
          </p>
        </div>
        <p className="text-xs font-bold uppercase tracking-wider text-cyan-100/70">
          OTPs expire in 10 minutes.
        </p>
      </aside>

      <div className="flex min-h-dvh items-start justify-center px-3 py-6 sm:px-6 sm:py-12 lg:min-h-0 lg:items-center">
        <div className="w-full max-w-[440px] rounded-lg border border-slate-200 bg-white p-4 shadow-xl shadow-slate-200/60 sm:p-8">
          <div className="mb-8 space-y-3">
            <Link href="/" className="inline-flex text-xl font-black tracking-wider text-brand-dark lg:hidden">
              HourGlass
            </Link>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 break-words">Verify email</h2>
            <p className="text-sm font-medium leading-6 text-slate-500 break-words">
              Check your inbox for the HourGlass verification code and enter it here.
            </p>
          </div>
          <VerifyEmailForm />
        </div>
      </div>
    </section>
  );
}
