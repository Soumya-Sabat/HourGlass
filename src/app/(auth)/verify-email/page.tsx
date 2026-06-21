import Link from "next/link";
import Image from "next/image";
import { VerifyEmailForm } from "@/components/forms/auth-forms";

export default function VerifyEmailPage() {
  return (
    <section className="grid min-h-dvh lg:grid-cols-[0.9fr_1.1fr] font-mono text-[#1a1a14] bg-[#f4ebd0]">
      
      {/* High-Contrast Left Sidebar Banner */}
      <aside className="hidden bg-[#eae3cb] border-b-4 lg:border-b-0 lg:border-r-4 border-[#1a1a14] px-8 xl:px-10 py-10 xl:py-12 lg:flex lg:flex-col lg:justify-between relative">
        <Link href="/" className="inline-flex max-w-full items-center gap-3 select-none font-black uppercase text-base text-xl tracking-tight">
            <div className="bg-[#1a1a14] p-1.5 border-2 border-[#1a1a14] shadow-[2px_2px_0px_0px_#e28774] ">
              <Image
                src="/images/logo.png" 
                alt="HourGlass Logo"
                width={190}
                height={96}
                className="h-16 w-auto max-w-full object-contain brightness-0 invert" 
                priority
              />
            </div> 
            HourGlass
          </Link>
        
        <div className="max-w-md space-y-6 bg-white p-6 border-2 border-[#1a1a14] shadow-[4px_4px_0px_0px_#1a1a14]">
          <p className="text-xs font-black uppercase tracking-widest bg-[#e28774] text-[#1a1a14] inline-block px-2 py-0.5 border border-[#1a1a14]">
            Email Verification
          </p>
          <h1 className="text-3xl xl:text-4xl font-black uppercase leading-tight tracking-tight text-[#1a1a14]">
            Confirm the email for your account.
          </h1>
          <p className="text-xs font-bold leading-relaxed text-[#1a1a14]/80">
            Enter the OTP sent to your inbox. After verification, your email can be used for login.
          </p>
        </div>
        
        <p className="text-xs font-black uppercase tracking-wider text-[#1a1a14]/60 bg-white/50 border border-[#1a1a14] px-3 py-1 self-start">
          OTPs expire in 10 minutes.
        </p>
      </aside>

      {/* Main Form Interaction Enclosure */}
      <div className="flex min-h-dvh items-start justify-center px-3 py-6 sm:px-6 sm:py-12 lg:min-h-0 lg:items-center">
        <div className="w-full max-w-[440px] border-4 border-[#1a1a14] bg-white p-6 sm:p-8 shadow-[8px_8px_0px_0px_#1a1a14]">
          
          <div className="mb-6 space-y-3 border-b-2 border-[#1a1a14] pb-5">
            <Link href="/" className="inline-flex text-lg font-black uppercase tracking-wider text-[#1a1a14] lg:hidden bg-[#eae3cb] px-2 py-0.5 border-2 border-[#1a1a14] shadow-[2px_2px_0px_0px_#1a1a14]">
              HourGlass
            </Link>
            
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-[#1a1a14] break-words">
              Verify email
            </h2>
            <p className="text-xs font-bold leading-relaxed text-[#1a1a14]/70 break-words">
              Check your inbox for the HourGlass verification code and enter it here.
            </p>
          </div>

          {/* Core Embedded OTP Sub-Form Layout */}
          <VerifyEmailForm />
        </div>
      </div>
    </section>
  );
}