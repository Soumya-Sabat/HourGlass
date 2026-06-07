"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Helicopter, DraftingCompass, FlaskConical,Sigma,BrainCircuit } from "lucide-react";
import { RegisterForm } from "@/components/forms/auth-forms";
import { registerSections } from "@/components/forms/auth-register-sections";

type OrbData = {
  title: string;
  subtitle: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  accent: string;
  position: string;
  delay: string;
};

const learningNodes: OrbData[] = [
  {
    title: "Science",
    subtitle: "Observe",
    icon: FlaskConical,
    accent: "#2563eb",
    position: "left-[9%] top-[20%]",
    delay: "0s",
  },
  {
    title: "Technology",
    subtitle: "Scale",
    icon: Helicopter,
    accent: "#059669",
    position: "right-[7%] top-[24%]",
    delay: "0.9s",
  },
  {
    title: "Engineering",
    subtitle: "Build",
    icon: DraftingCompass,
    accent: "#ea580c",
    position: "left-[13%] bottom-[19%]",
    delay: "1.8s",
  },
  {
    title: "Mathematics",
    subtitle: "Prove",
    icon: Sigma,
    accent: "#7c3aed",
    position: "right-[12%] bottom-[17%]",
    delay: "2.7s",
  },
  {
    title: "Arts",
    subtitle: "Show",
    icon: BrainCircuit,
    accent: "#e41da5ff",
    position: "top-[10%] left-[40%]",
    delay: "2.7s",
  },
];

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <section className="relative z-10 grid min-h-dvh w-full grid-cols-1 overflow-x-hidden box-border bg-radial from-[#ffd6c4] via-[#deffe0] to-[#bee2ff] font-sans lg:grid-cols-[minmax(520px,1fr)_minmax(460px,0.9fr)]">
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes loginNodeFloat {
              0%, 100% { transform: translate3d(0, 0, 0); }
              50% { transform: translate3d(0, -12px, 0); }
            }

            @keyframes loginCenterBreathe {
              0%, 100% { transform: scale(1); box-shadow: 0 18px 55px rgba(15, 23, 42, 0.12); }
              50% { transform: scale(1.025); box-shadow: 0 22px 70px rgba(37, 99, 235, 0.16); }
            }

            @keyframes loginDash {
              to { stroke-dashoffset: -36; }
            }

            .login-map:hover .login-node {
              filter: saturate(1.12);
            }

            .login-map:hover .login-center {
              transform: scale(0.98);
            }

            /* Hide scrollbar logic for Chrome, Safari and Opera */
            .no-scrollbar::-webkit-scrollbar {
              display: none;
            }
            /* Hide scrollbar logic for IE, Edge and Firefox */
            .no-scrollbar {
              -ms-overflow-style: none;  /* IE and Edge */
              scrollbar-width: none;  /* Firefox */
            }
          `,
        }}
      />

      {/* Background Subtle Geometric Vector Lines */}
      <div className="absolute inset-0 w-full h-full opacity-[0.22] pointer-events-none z-0 mix-blend-multiply">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <g stroke="rgba(123, 97, 255, 0.3)" strokeWidth="1.5" fill="none">
            <line x1="0" y1="0" x2="50%" y2="50%" />
            <line x1="100%" y1="0" x2="50%" y2="50%" />
            <line x1="0" y1="100%" x2="50%" y2="50%" />
            <line x1="100%" y1="100%" x2="50%" y2="50%" />
            <line x1="50%" y1="0" x2="50%" y2="100%" />
            <line x1="0" y1="50%" x2="100%" y2="50%" />
          </g>
        </svg>
      </div>

      {/* Top Main Branding Header */}
      <div className="absolute top-6 left-5 sm:top-8 sm:left-10 z-50">
        <Link href="/" className="inline-flex transition-transform duration-300 hover:scale-[1.02]" aria-label="Go to HourGlass home">
          <Image
            src="/images/logo.png"
            alt="HourGlass Logo"
            width={176}
            height={64}
            className="h-12 w-33 sm:h-14 sm:w-38 lg:h-16 lg:w-44 object-contain mix-blend-multiply"
            priority
          />
        </Link>
      </div>

      {/* LEFT COLUMN: Combined Interactive Nodes + Code Cyber Patterns Behind */}
      <div className="hidden lg:flex items-center justify-center relative z-20 min-h-dvh w-auto select-none px-10 pt-28 pb-14 xl:px-12">
        {/* Foreground Animated Interactive Schema Map */}
        <div className="login-map relative aspect-square w-[min(620px,calc(100dvh-160px),42vw)]">
          <div
            className="absolute left-1/2 top-1/2 z-0 h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,107,53,0.52)_0%,rgba(255,142,100,0.26)_42%,transparent_72%)] blur-3xl"
            aria-hidden="true"
          />
          <svg className="absolute inset-[8%] h-[84%] w-[84%] overflow-visible" viewBox="0 0 520 520" aria-hidden="true">
            <g fill="none" strokeLinecap="round">
              <circle cx="260" cy="260" r="148" stroke="rgba(15, 23, 42, 0.13)" strokeWidth="1.5" />
              <circle cx="260" cy="260" r="215" stroke="rgba(255, 255, 255, 0.72)" strokeWidth="1.5" />
              <path
                d="M260 260 C170 120 118 118 74 88"
                stroke="rgba(37, 99, 235, 0.32)"
                strokeWidth="2"
                strokeDasharray="8 10"
                style={{ animation: "loginDash 5s linear infinite" }}
              />
              <path
                d="M260 260 C345 118 394 128 450 104"
                stroke="rgba(5, 150, 105, 0.32)"
                strokeWidth="2"
                strokeDasharray="8 10"
                style={{ animation: "loginDash 5.5s linear infinite" }}
              />
              <path
                d="M260 260 C154 380 132 420 92 452"
                stroke="rgba(234, 88, 12, 0.32)"
                strokeWidth="2"
                strokeDasharray="8 10"
                style={{ animation: "loginDash 6s linear infinite" }}
              />
              <path
                d="M260 260 C370 382 410 414 456 436"
                stroke="rgba(124, 58, 237, 0.32)"
                strokeWidth="2"
                strokeDasharray="8 10"
                style={{ animation: "loginDash 6.5s linear infinite" }}
              />
              <path
                d="M260 260 C245 158 260 120 258 72"
                stroke="rgba(228, 29, 165, 0.32)"
                strokeWidth="2"
                strokeDasharray="8 10"
                style={{ animation: "loginDash 5.75s linear infinite" }}
              />
            </g>
          </svg>

          <div
            className="login-center absolute left-1/2 top-1/2 z-30 flex h-40 w-40 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-white/70 bg-white/45 text-center shadow-2xl backdrop-blur-xl transition-all duration-500 hover:bg-white hover:border-white"
            style={{ animation: "loginCenterBreathe 6s ease-in-out infinite" }}
          >
            <span className="text-[11px] font-black uppercase text-orange-500">HourGlass</span>
            <h2 className="mt-1 text-4xl font-black text-slate-950">STEAM</h2>
            <span className="mt-1 h-1 w-12 rounded-full bg-brand-blue" />
          </div>

          {learningNodes.map((node) => {
            const Icon = node.icon;
            return (
              <div
                key={node.title}
                className={`login-node absolute z-20 ${node.position} flex h-30 w-30 flex-col items-center justify-center rounded-full border border-white/70 bg-white/55 p-4 text-center shadow-xl shadow-slate-900/10 backdrop-blur-md transition duration-500 hover:-translate-y-2 hover:bg-white/75`}
                style={{ animation: `loginNodeFloat 7s ease-in-out ${node.delay} infinite` }}
              >
                <span
                  className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg text-white shadow-lg"
                  style={{ backgroundColor: node.accent, boxShadow: `0 12px 26px ${node.accent}33` }}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <span className="text-sm font-black text-slate-950">{node.title}</span>
                <span className="mt-0.5 text-[10px] font-bold uppercase text-slate-500">{node.subtitle}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT COLUMN: Static Outer Height Container, Content-Driven Internal Height Card Layout */}
      <div className="relative z-20 flex min-h-dvh w-full items-start justify-center overflow-visible px-4 pb-6 pt-24 sm:px-6 sm:pb-8 sm:pt-28 lg:items-center lg:px-8 lg:py-12 xl:px-10">
        <div className="relative flex w-full max-w-[760px] flex-col justify-center">
          {/* Subtle Ambient Radial Backlight */}
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[480px] w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(5,150,105,0.18)_0%,rgba(167,243,208,0.08)_44%,transparent_74%)] blur-3xl"
            aria-hidden="true"
          />

          {/* Top Wizard Steps (Pinned Outward) */}
          <div className="no-scrollbar relative z-10 mb-4 flex max-w-full shrink-0 items-center justify-start gap-1.5 overflow-x-auto px-1 pb-1">
            {registerSections.map((section, index) => (
              <React.Fragment key={section.id}>
                <span className={`inline-flex h-7 items-center rounded-lg border px-2.5 text-[9px] font-black uppercase shadow-xs backdrop-blur ${
                  index === currentStep
                    ? "border-orange-200 bg-orange-50 text-orange-700"
                    : "border-white/50 bg-white/40 text-slate-500"
                } whitespace-nowrap`}>
                  {section.title}
                </span>
                {index < registerSections.length - 1 && <ArrowRight className="h-3 w-3 shrink-0 text-slate-400" />}
              </React.Fragment>
            ))}
          </div>

          {/* The Unified Form Container: Max available bound, but snaps height exactly to inner fields */}
          <RegisterForm currentStep={currentStep} onStepChange={setCurrentStep} />

        </div>
      </div>
    </section>
  );
}
