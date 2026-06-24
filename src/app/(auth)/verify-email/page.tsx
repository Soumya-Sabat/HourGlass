import Link from "next/link";
import Image from "next/image";
import { Kalam } from "next/font/google";
import { VerifyEmailForm } from "@/components/forms/auth-forms";

const chalkFont = Kalam({ subsets: ["latin"], weight: ["300", "400", "700"], display: "swap" });

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
        
        <div className="max-w-md space-y-6 bg-[#1a1a14] p-6 border-2 border-[#f4ebd0]/30 shadow-[4px_4px_0px_0px_#1a1a14]">
          <p className="text-xl font-black uppercase tracking-widest bg-[#e28774] text-[#1a1a14] inline-block px-2 py-0.5 border-2 border-[#f4ebd0]">
            Email Verification
          </p>
          <h1 className="text-3xl xl:text-4xl font-black uppercase leading-tight tracking-tight text-[#f4ebd0]">
            Confirm the email for your account.
          </h1>
          <p className="text-xs font-bold leading-relaxed text-[#f4ebd0]/80">
            Enter the OTP sent to your inbox. After verification, your email can be used for login.
          </p>
        </div>
        
        <p className="text-xl font-black uppercase tracking-wider text-[#f4ebd0]/60 bg-[#1a1a14] border-2 border-[#f4ebd0]/30 px-3 py-1 self-start">
          OTPs expire in 10 minutes.
        </p>
      </aside>

      {/* Main Form Interaction Enclosure */}
      <div className="flex min-h-dvh items-start justify-center px-3 py-6 sm:px-6 sm:py-12 lg:min-h-0 lg:items-center">
        <div className={`${chalkFont.className} w-full max-w-[440px] relative rounded-lg bg-[#7B5B3A] p-5 shadow-[6px_10px_0px_0px_#1a1a14] before:pointer-events-none before:absolute before:inset-0 before:rounded-lg before:bg-[repeating-linear-gradient(90deg,transparent,transparent_60px,rgba(0,0,0,0.04)_60px,rgba(0,0,0,0.04)_61px)] [clip-path:polygon(0%_5%,1.5%_0.5%,4%_1%,8%_0.3%,12%_1.2%,16%_0%,20%_0.8%,24%_0.2%,28%_1.5%,32%_0%,36%_0.7%,40%_0.1%,44%_1.3%,48%_0.4%,52%_0%,56%_0.9%,60%_0.2%,64%_1.1%,68%_0%,72%_0.6%,76%_0.3%,80%_1.4%,84%_0%,88%_0.8%,92%_0.1%,96%_1.2%,99%_0.5%,100%_4%,99.5%_8%,100%_12%,99.2%_16%,100%_20%,99.5%_24%,100%_28%,99%_32%,100%_36%,99.3%_40%,100%_44%,99.6%_48%,100%_52%,99%_56%,100%_60%,99.4%_64%,100%_68%,99.7%_72%,100%_76%,99.2%_80%,100%_84%,99.5%_88%,100%_92%,99%_96%,100%_99%,96%_99.5%,92%_100%,88%_99.3%,84%_100%,80%_99.7%,76%_100%,72%_99%,68%_100%,64%_99.4%,60%_100%,56%_99.6%,52%_100%,48%_99.2%,44%_100%,40%_99.5%,36%_100%,32%_99%,28%_100%,24%_99.3%,20%_100%,16%_99.7%,12%_100%,8%_99%,4%_100%,2%_99.5%,0%_96%,0.5%_92%,0%_88%,0.3%_84%,0%_80%,0.6%_76%,0%_72%,0.4%_68%,0%_64%,0.7%_60%,0%_56%,0.2%_52%,0%_48%,0.5%_44%,0%_40%,0.8%_36%,0%_32%,0.3%_28%,0%_24%,0.6%_20%,0%_16%,0.9%_12%,0%_8%,0.4%_4%)]`}>
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

          <div className="mb-6 space-y-3 border-b-2 border-[#f4ebd0]/20 pb-5">
            <Link href="/" className="inline-flex text-xl font-black uppercase tracking-wider text-[#f4ebd0] lg:hidden bg-[#1a1a14] px-2 py-0.5 border-2 border-[#f4ebd0]/30 shadow-[2px_2px_0px_0px_#f4ebd0]">
              HourGlass
            </Link>
            
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-[#f4ebd0] break-words">
              Verify email
            </h2>
            <p className="text-xs font-bold leading-relaxed text-[#f4ebd0]/70 break-words">
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
