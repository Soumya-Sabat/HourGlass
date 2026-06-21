import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Steps from "@/components/landing/Steps";
import Features from "@/components/landing/Features";
import Stakeholders from "@/components/landing/Stakeholders";
import CTA from "@/components/landing/CTA";
import ContactSection from "@/components/landing/ContactUs";
import Footer from "@/components/landing/Footer";
import Testimonials from "@/components/landing/Testimonials";

export default function LandingPage() {
  return (  
    <div className="min-h-screen bg-[#f4ebd0] text-[#1a1a14] selection:bg-[#e28774] selection:text-[#1a1a14] overflow-x-hidden antialiased font-mono">
      {/* Flat top navigation bar wrapper */}
      <Navbar />
      
      <main className="relative z-10 flex flex-col">
        <Hero />
        <Steps />
        <Features />
        <Stakeholders />
        <CTA />
        <ContactSection />
        <Testimonials />
      </main>
      
      {/* Heavy-bordered flat baseline layout footer block */}
      <Footer />
    </div>
  );
}