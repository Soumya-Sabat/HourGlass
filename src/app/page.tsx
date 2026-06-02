import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Stats from "@/components/landing/Stats";
import Steps from "@/components/landing/Steps";
import Features from "@/components/landing/Features";
import Roles from "@/components/landing/Roles";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";
import ContactSection from "@/components/landing/Contact";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <Steps />
        <Features />
        <Roles />
        <CTA />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}