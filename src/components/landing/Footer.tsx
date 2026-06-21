import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full overflow-x-clip bg-[#eae3cb] text-[#1a1a14] text-xs border-t-4 border-[#1a1a14] mt-20 font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16 grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-10">
        
        {/* BRAND IDENTITY COLUMN - Spans 4 layout structural units */}
        <div className="md:col-span-4 space-y-4 min-w-0">
         <Link href="/" className="inline-flex max-w-full items-center gap-3 select-none font-black uppercase text-base tracking-tight">
            <div className="bg-[#1a1a14] p-1.5 border-2 border-[#1a1a14] shadow-[2px_2px_0px_0px_#e28774]">
              <Image
                src="/images/logo.png" 
                alt="HourGlass Logo"
                width={190}
                height={96}
                className="h-8 w-auto max-w-full object-contain brightness-0 invert" 
                priority
              />
            </div> 
            HourGlass
          </Link>
          <p className="text-[#1a1a14]/80 font-bold leading-relaxed max-w-sm text-pretty break-words">
            Next-generation constraint satisfaction AI engine engineered to resolve administrative overlaps, room conflicts, and workload restrictions automatically.
          </p>
        </div>

        {/* REPLICATED LINKS GRID DIRECTORIES - Spans 8 layout structural units */}
        <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-7 sm:gap-8 min-w-0">
          
          {/* Column 1: Platform Directory */}
          <div className="space-y-4 min-w-0">
            <h4 className="text-xs font-black text-[#1a1a14] bg-[#f4ebd0] border-2 border-[#1a1a14] px-2 py-0.5 w-fit tracking-wide uppercase break-words">
              Platform
            </h4>
            <ul className="space-y-2 font-bold uppercase text-[11px]">
              <li><Link href="#features" className="inline-block max-w-full hover:underline break-words">Features Core</Link></li>
              <li><Link href="#how-it-works" className="inline-block max-w-full hover:underline break-words">AI Engine Tracker</Link></li>
              <li><Link href="/nep-compliance" className="inline-block max-w-full hover:underline break-words">NEP 2020 Compliance</Link></li>
              <li><Link href="/pricing" className="inline-block max-w-full hover:underline break-words">Pricing Models</Link></li>
              <li><Link href="/deployment" className="inline-block max-w-full hover:underline break-words">Enterprise Setup</Link></li>
            </ul>
          </div>

          {/* Column 2: Company Directory */}
          <div className="space-y-4 min-w-0">
            <h4 className="text-xs font-black text-[#1a1a14] bg-[#f4ebd0] border-2 border-[#1a1a14] px-2 py-0.5 w-fit tracking-wide uppercase break-words">
              Company
            </h4>
            <ul className="space-y-2 font-bold uppercase text-[11px]">
              <li><Link href="/about" className="inline-block max-w-full hover:underline break-words">Our Mission</Link></li>
              <li><Link href="/careers" className="inline-block max-w-full hover:underline break-words">Careers</Link></li>
              <li><Link href="/press" className="inline-block max-w-full hover:underline break-words">Press Wire</Link></li>
              <li><Link href="/security" className="inline-block max-w-full hover:underline break-words">Security & Audits</Link></li>
              <li><Link href="#contact" className="inline-block max-w-full hover:underline break-words">Contact Sales</Link></li>
              <li><Link href="/bug-report" className="inline-block max-w-full hover:underline break-words">Report a Bug</Link></li>
            </ul>
          </div>

          {/* Column 3: Legal Compliance Directory */}
          <div className="space-y-4 sm:col-span-1 min-w-0">
            <h4 className="text-xs font-black text-[#1a1a14] bg-[#f4ebd0] border-2 border-[#1a1a14] px-2 py-0.5 w-fit tracking-wide uppercase break-words">
              Legal
            </h4>
            <ul className="space-y-2 font-bold uppercase text-[11px]">
              <li><Link href="/terms" className="inline-block max-w-full hover:underline break-words">Terms of Service</Link></li>
              <li><Link href="/privacy" className="inline-block max-w-full hover:underline break-words">Privacy Statement</Link></li>
              <li><Link href="/cookies" className="inline-block max-w-full hover:underline break-words">Cookie Protocol</Link></li>
              <li><Link href="/sla" className="inline-block max-w-full hover:underline break-words">SLA Agreement</Link></li>
            </ul>
          </div>

        </div>

      </div>

      {/* Structural bottom baseline attribution overlay */}
      <div className="border-t-2 border-[#1a1a14] bg-[#1a1a14] px-4 py-5 sm:py-6 text-center text-[10px] font-black text-[#f4ebd0] uppercase tracking-wider select-none break-words">
        &copy; {new Date().getFullYear()} HourGlass Frameworks Inc. All Rights Reserved.
      </div>
    </footer>
  );
}