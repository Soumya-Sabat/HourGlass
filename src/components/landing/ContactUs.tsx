"use client";

import { FormEvent, useState } from "react";
import { Mail, Phone, MapPin, Send, Rocket } from "lucide-react";

type FormState = "idle" | "loading" | "success" | "error";

export default function ContactSection() {
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("loading");
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          message: formData.get("message"),
        }),
      });

      const payload = (await response.json()) as { message?: string };

      if (!response.ok) {
        setState("error");
        setMessage(payload.message ?? "Something went wrong. Try again.");
        return;
      }

      form.reset();
      setState("success");
      setMessage(payload.message ?? "Message received. We will reply soon.");
    } catch (err) {
      setState("error");
      setMessage("Failed to submit form. Please check your network connectivity.");
    }
  }

  return (
    <section id="contact" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-xs uppercase font-extrabold tracking-widest text-indigo-600 mb-2">Connect With Us</h2>
        <p className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Request an enterprise deployment briefing
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Column: Direct Info Cards */}
        <div className="lg:col-span-5 flex flex-col gap-4 justify-between">
          {[
            { icon: <Mail />, title: "Email Support", text: "deployment@hourglass.edu" },
            { icon: <Phone />, title: "Contact Phone", text: "+91 (800) 555-0199" },
            { icon: <MapPin />, title: "Institutional HQ", text: "Sector 62, Noida, UP, India" },
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex items-center gap-4">
              <div className="bg-indigo-50 p-3 rounded-xl border border-indigo-100 [&_svg]:h-5 [&_svg]:w-5 [&_svg]:text-indigo-600">
                {item.icon}
              </div>
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">{item.title}</div>
                <div className="text-base font-bold text-slate-800 mt-0.5">{item.text}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Functional Input Form Deck */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/60 shadow-sm">
          <form onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2">
            
            <label className="grid gap-2 text-left text-xs font-bold text-slate-500 uppercase">
              Name
              <input
                required
                name="name"
                type="text"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 normal-case font-medium"
                placeholder="Your Name"
              />
            </label>

            <label className="grid gap-2 text-left text-xs font-bold text-slate-500 uppercase">
              Institutional Email
              <input
                required
                name="email"
                type="email"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 normal-case font-medium"
                placeholder="Your Email"
              />
            </label>

            <label className="grid gap-2 text-left text-xs font-bold text-slate-500 uppercase sm:col-span-2">
              Message
              <textarea
                required
                name="message"
                rows={4}
                minLength={10}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 resize-none normal-case font-medium"
                placeholder="Tell us about your system requirements, timeline, and multi-department constraints."
              />
            </label>

            <div className="flex flex-wrap items-center gap-4 sm:col-span-2 pt-2">
              <button
                disabled={state === "loading"}
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-extrabold px-5 py-3.5 rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-600/10 text-sm tracking-wide disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Rocket className="h-4 w-4"/> {state === "loading" ? "Sending..." : "Dispatch"}
              </button>

              {message ? (
                <p
                  className={`text-sm font-semibold ${
                    state === "error" ? "text-rose-600" : "text-emerald-600"
                  }`}
                >
                  {message}
                </p>
              ) : null}
            </div>

          </form>
        </div>

      </div>
    </section>
  );
}