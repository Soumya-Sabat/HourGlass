"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleLogoClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setIsOpen(false);

    if (window.location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    router.push("/");
  };

  return (
    <nav className="fixed top-3 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-5xl bg-slate-200/90 backdrop-blur-md border border-slate-200/60 rounded-full px-4 sm:px-6 py-1 shadow-md transition-all">
      <div className="flex items-center justify-between h-13">
        
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center cursor-pointer group shrink-0"
          onClick={handleLogoClick}
        >
          <Image
            src="/images/logo.png"
            alt="HourGlass Logo"
            height={28}
            width={64}
            className="object-contain"
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2 text-base font-semibold text-slate-700">
          <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-indigo-600 transition-colors">How it works</a>
          <a href="#pricing" className="hover:text-indigo-600 transition-colors">Pricing</a>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          <button 
            onClick={() => router.push("/login")}
            className="text-sm font-semibold text-slate-700 hover:text-indigo-600 transition-colors"
          >
            Sign In
          </button>
          <button 
            onClick={() => router.push("/signup")}
            className="bg-indigo-600 text-white text-sm font-semibold px-4 py-1.5 rounded-full hover:bg-indigo-700 transition shadow-sm"
          >
            Get Started
          </button>
        </div>

        {/* Mobile/Tablet Hamburger Trigger */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 text-slate-600 hover:text-slate-900 focus:outline-none transition-colors"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Responsive Mobile Drawer Container */}
      {isOpen && (
        <div className="md:hidden mt-2 bg-white/95 border border-slate-200/80 rounded-2xl px-4 py-4 space-y-3 shadow-xl animate-in slide-in-from-top duration-200">
          <a 
            href="#features" 
            onClick={() => setIsOpen(false)} 
            className="block px-3 py-2 rounded-xl text-lg font-bold text-slate-800 hover:bg-slate-50 transition-colors"
          >
            Features
          </a>
          <a 
            href="#how-it-works" 
            onClick={() => setIsOpen(false)} 
            className="block px-3 py-2 rounded-xl text-lg font-bold text-slate-800 hover:bg-slate-50 transition-colors"
          >
            How it works
          </a>
          <a 
            href="#pricing" 
            onClick={() => setIsOpen(false)} 
            className="block px-3 py-2 rounded-xl text-lg font-bold text-slate-800 hover:bg-slate-50 transition-colors"
          >
            Pricing
          </a>
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <button 
              onClick={() => { setIsOpen(false); router.push("/login"); }}
              className="w-full bg-slate-100 text-slate-800 py-2.5 rounded-xl font-bold text-base hover:bg-slate-200 transition shadow-sm"
            >
              Sign In
            </button>
            <button 
              onClick={() => { setIsOpen(false); router.push("/signup"); }}
              className="w-full bg-indigo-600 text-white py-2.5 rounded-xl font-bold text-base hover:bg-indigo-700 transition shadow-sm"
            >
              Get Started Free
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}