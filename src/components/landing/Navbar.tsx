"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "How it Works", href: "#how-it-works" },
    { name: "For Schools", href: "#" },
    { name: "For Colleges", href: "#" },
    { name: "Pricing", href: "#" },
  ];

  return (
    <nav className="fixed top-4 left-0 right-0 z-50 px-3 sm:px-4">
      <div className="max-w-7xl mx-auto bg-gradient-to-r from-[#F1F7FC]/60 via-[#EAF3FA]/60 to-[#FCECE5]/60 backdrop-blur-xl border border-slate-200/50 shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-full px-4 sm:px-6">
        <div className="flex items-center w-full h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center shrink-0"
            aria-label="Go to HourGlass home"
          >
            <Image
              src="/images/logo.png"
              alt="HourGlass Logo"
              width={160}
              height={56}
              className="h-10 w-auto sm:h-12"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex flex-1 justify-center items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors duration-200"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3 ml-auto">
            <button className="text-sm font-semibold text-slate-700 hover:text-indigo-600 transition-colors px-3 py-2">
              Log in
            </button>

            <button className="bg-indigo-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition-all duration-200 shadow-lg shadow-indigo-500/20">
              Get Started Free
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation menu"
            className="md:hidden ml-auto p-2 rounded-lg text-slate-700 hover:bg-slate-100 hover:text-indigo-600 transition-colors"
          >
            {isOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-3 max-w-7xl mx-auto">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-slate-200/60 shadow-xl overflow-hidden">
            <div className="p-4">
              {/* Navigation Links */}
              <div className="space-y-1">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 rounded-xl text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                  >
                    {link.name}
                  </a>
                ))}
              </div>

              {/* Mobile Actions */}
              <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-3">
                <button className="w-full py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-colors">
                  Log in
                </button>

                <button className="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20">
                  Get Started Free
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
} 