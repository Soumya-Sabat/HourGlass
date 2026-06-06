import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Steps from "@/components/landing/Steps";
import Features from "@/components/landing/Features";
import Stakeholders from "@/components/landing/Stakeholders";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  return (  
    <div className="min-h-screen bg-[linear-gradient(135deg,#e0ebff_0%,#e8e7ff_45%,#fae8ff_100%)] text-slate-800 selection:bg-indigo-600 selection:text-white overflow-x-hidden antialiased">
      <Navbar />
      <main>
        <Hero />
        <Steps />
        <Features />
        <Stakeholders />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}