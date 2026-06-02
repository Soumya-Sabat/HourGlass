"use client";

import { useState, FormEvent } from "react";
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export default function ContactSection() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !message) return;

    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, message }),
      });

      if (!response.ok) {
        throw new Error("Failed to forward communication. Please try again.");
      }

      setStatus("success");
      setEmail("");
      setMessage("");
    } catch (err: unknown) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  return (
    <section id="contact" className="py-16 md:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <h2 className="text-xs uppercase font-bold tracking-widest text-indigo-600 mb-2">Get in Touch</h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Ready to streamline your scheduling?
          </p>
        </div>

        {/* Form & Info Wrapper */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Info Panels */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl space-y-6">
              <h3 className="text-lg font-bold text-slate-900">Contact Information</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Have specific institutional constraints or deployment configurations to discuss? Reach out to our systems engineering team.
              </p>
              
              <div className="space-y-4 font-medium text-slate-700 text-sm">
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-50 p-2.5 rounded-xl text-indigo-600">
                    <Mail className="h-5 w-5" />
                  </div>
                  <span>support@hourglass.in</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-50 p-2.5 rounded-xl text-indigo-600">
                    <Phone className="h-5 w-5" />
                  </div>
                  <span>+91 (800) 555-0199</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-50 p-2.5 rounded-xl text-indigo-600">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <span>Virtual , India</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Form */}
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="space-y-5 bg-slate-50 border border-slate-200 p-6 sm:p-8 rounded-2xl">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Institutional Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="dean@university.edu"
                  disabled={status === "loading"}
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition disabled:opacity-60"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-slate-700 mb-1.5">
                  How can we help your institution?
                </label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us about your department count, faculty constraints, or system challenges..."
                  disabled={status === "loading"}
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition resize-none disabled:opacity-60"
                />
              </div>

              {/* Status Alert Windows */}
              {status === "success" && (
                <div className="flex items-center gap-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 p-3.5 rounded-xl text-sm">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                  <span>Inquiry processed successfully. Our engineering team will follow up within 24 hours.</span>
                </div>
              )}

              {status === "error" && (
                <div className="flex items-center gap-2.5 bg-rose-50 border border-rose-200 text-rose-800 p-3.5 rounded-xl text-sm">
                  <AlertCircle className="h-5 w-5 text-rose-600 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-medium px-5 py-3.5 rounded-xl hover:bg-indigo-700 transition disabled:bg-indigo-400 shadow-md"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Dispatching Transmission...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Submit Request
                  </>
                )}
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}
