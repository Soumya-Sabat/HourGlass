"use client";

import { useState, useRef, useEffect } from "react";
import { Menu, X, ChevronDown, Webhook, Rss } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router=useRouter()
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const documentation = [
    { name: "Blogs", href: "/docs/blogs", desc: "What we do and friction topics.", icon: <Rss className="h-4 w-4 text-indigo-600" /> },
    { name: "API docs", href: "/docs/api", desc: "Integrate HourGlass with your applications.", icon: <Webhook className="h-4 w-4 text-indigo-600" /> },
  ];

  const standardLinks = [
    { name: "Features", href: "#features" },
    { name: "How it Works", href: "#how-it-works" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "Pricing", href: "/pricing" },
  ];

  return (
    <nav className="fixed top-4 left-0 right-0 z-50 px-3 sm:px-4">
      <div className="max-w-7xl mx-auto bg-gradient-to-r from-[#F1F7FC]/60 via-[#EAF3FA]/60 to-[#FCECE5]/60 backdrop-blur-xl border border-slate-200/50 shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-full px-4 bg-slate-500 sm:px-6">
        <div className="flex items-center w-full h-16">
          
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0" aria-label="Go to HourGlass home">
            <Image
              src="/images/logo.png"
              alt="HourGlass Logo"
              width={160}
              height={56}
              className="h-10 w-auto max-w-full object-contain sm:h-12 brightness-0 invert"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex flex-1 justify-center items-center gap-6 xl:gap-8">
            {/* Standard Links Before Dropdown */}
            {standardLinks.slice(0, 2).map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors duration-200"
              >
                {link.name}
              </a>
            ))}

            {/* Solutions Dropdown Trigger */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                onMouseEnter={() => setIsDropdownOpen(true)}
                className="flex items-center gap-1 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors duration-200 focus:outline-none"
              >
                Documents
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Crisp Solid Dropdown Box */}
              {isDropdownOpen && (
                <div 
                  onMouseLeave={() => setIsDropdownOpen(false)}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-64 bg-white border border-slate-200/80 rounded-2xl p-2 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200"
                >
                  {documentation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 group transition-colors"
                    >
                      <div className="bg-indigo-50 p-2 rounded-lg border border-indigo-100 mt-0.5">
                        {item.icon}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {item.name}
                        </div>
                        <div className="text-xs text-slate-500 font-medium mt-0.5 leading-normal">
                          {item.desc}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Remaining Standard Links */}
            {standardLinks.slice(2).map((link) => (
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
            <button 
            onClick={() => router.push("/login")}
            className="text-sm font-semibold text-slate-700 hover:text-indigo-600 transition-colors px-3 py-2">
              Log in
            </button>
            <button 
            onClick={(() => router.push("/register"))}
            className="bg-indigo-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition-all duration-200 shadow-lg shadow-indigo-500/20">
              Get Started Free
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation menu"
            className="lg:hidden ml-auto p-2 rounded-lg text-slate-700 hover:bg-slate-100 hover:text-indigo-600 transition-colors"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Content Panel */}
      {isOpen && (
        <div className="lg:hidden mt-3 max-w-7xl mx-auto">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-slate-200/60 shadow-xl overflow-hidden">
            <div className="p-4 max-h-[calc(100vh-120px)] overflow-y-auto">
              
              <div className="space-y-1">
                {/* Standard Top Links */}
                {standardLinks.slice(0, 2).map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 rounded-xl text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                  >
                    {link.name}
                  </a>
                ))}

                {/* Mobile Dropdown Category Segment */}
                <div className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-400 mt-2">
                  Solutions
                </div>
                {documentation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-6 py-3 rounded-xl text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                ))}

                {/* Remaining Mobile Links */}
                {standardLinks.slice(2).map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 rounded-xl text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors pt-2"
                  >
                    {link.name}
                  </a>
                ))}
              </div>

              {/* Mobile Interaction Drawer Blocks */}
              <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-3">
                <button
                onClick={() => router.push("/login")}
                className="w-full py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-colors">
                  Log in
                </button>
                <button 
                onClick={() => router.push("/register")}
                className="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20">
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