"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  // const documentation = [
  //   { name: "API docs", href: "/docs/api", desc: "Integrate HourGlass with your applications.", icon: <Webhook className="h-4 w-4 text-[#1a1a14]" /> },
  // ];

  const standardLinks = [
    { name: "Features", href: "#features" },
    { name: "How it Works", href: "#how-it-works" },
    { name: "Blogs", href: "/docs/blogs" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "Pricing", href: "/pricing" },
  ];

  return (
    <nav className="fixed top-4 left-0 right-0 z-50 px-3 sm:px-4 font-mono text-[#1a1a14]">
      <div className="max-w-7xl mx-auto bg-[#eae3cb] border-2 border-[#1a1a14] shadow-[4px_4px_0px_0px_#1a1a14] px-4 sm:px-6">
        <div className="flex items-center w-full h-16">
          
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0 border-2 border-transparent hover:border-[#1a1a14] hover:bg-white px-2 py-1 transition-all" aria-label="Go to HourGlass home">
            {/* <div className="bg-[#1a1a14] p-1.5 border-2 border-[#1a1a14] shadow-[2px_2px_0px_0px_#e28774] "> */}
            <Image
              src="/images/logo.png"
              alt="HourGlass Logo"
              width={160}
              height={56}
              className="h-10 w-auto max-w-full object-contain sm:h-12 brightness-0"
              priority
            />
            {/* HOurGlass  */}
            {/* </div> */}
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex flex-1 justify-center items-center gap-4 xl:gap-6">
            {standardLinks.slice(0, 2).map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-xs font-black uppercase tracking-tight px-3 py-1.5 border border-transparent hover:border-[#1a1a14] hover:bg-[#f4ebd0] transition-all"
              >
                {link.name}
              </a>
            ))}

            {/* Remaining Standard Links */}
            {standardLinks.slice(2).map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-xs font-black uppercase tracking-tight px-3 py-1.5 border border-transparent hover:border-[#1a1a14] hover:bg-[#f4ebd0] transition-all"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3 ml-auto">
            <button 
              onClick={() => router.push("/login")}
              className="text-xs font-black uppercase tracking-wider px-4 py-2 border border-transparent hover:border-[#1a1a14] hover:bg-white transition-all"
            >
              Log in
            </button>
            <button 
              onClick={() => router.push("/register")}
              className="bg-[#e28774] text-[#1a1a14] text-xs font-black uppercase tracking-wider px-5 py-2.5 border-2 border-[#1a1a14] shadow-[2px_2px_0px_0px_#1a1a14] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#1a1a14] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
            >
              Get Started Free
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation menu"
            className="lg:hidden ml-auto p-2 border-2 border-[#1a1a14] bg-[#f4ebd0] active:bg-[#e28774] flex items-center justify-center transition-colors"
          >
            {isOpen ? <X className="h-5 w-5 stroke-[2.5]" /> : <Menu className="h-5 w-5 stroke-[2.5]" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className="lg:hidden mt-2 max-w-7xl mx-auto">
          <div className="bg-[#eae3cb] border-2 border-[#1a1a14] shadow-[4px_4px_0px_0px_#1a1a14] overflow-hidden">
            <div className="p-4 max-h-[calc(100vh-120px)] overflow-y-auto">
              
              <div className="space-y-1">
                {/* Standard Top Links */}
                {standardLinks.slice(0, 2).map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-2.5 border border-transparent hover:border-[#1a1a14] hover:bg-white text-xs font-black uppercase transition-colors"
                  >
                    {link.name}
                  </a>
                ))}

                {/* Remaining Mobile Links */}
                {standardLinks.slice(2).map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-2.5 border border-transparent hover:border-[#1a1a14] hover:bg-white text-xs font-black uppercase transition-colors"
                  >
                    {link.name}
                  </a>
                ))}
              </div>

              {/* Mobile Interactive Buttons */}
              <div className="mt-4 pt-4 border-t-2 border-[#1a1a14] flex flex-col gap-2">
                <button
                  onClick={() => router.push("/login")}
                  className="w-full py-2.5 bg-white border-2 border-[#1a1a14] text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_#1a1a14] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
                >
                  Log in
                </button>
                <button 
                  onClick={() => router.push("/register")}
                  className="w-full py-2.5 bg-[#e28774] border-2 border-[#1a1a14] text-[#1a1a14] text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_#1a1a14] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
                >
                  Get Started
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </nav>
  );
}