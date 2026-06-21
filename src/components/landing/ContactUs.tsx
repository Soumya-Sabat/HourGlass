"use client";

import { FormEvent, useState } from "react";
import { Mail, Phone, MapPin, Rocket } from "lucide-react";

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

      const payload = await readContactResponse(response);

      if (!response.ok) {
        setState("error");
        setMessage(payload.message ?? "Something went wrong. Try again.");
        return;
      }

      form.reset();
      setState("success");
      setMessage(payload.message ?? "Message received. We will reply soon.");
    } catch {
      setState("error");
      setMessage("Failed to submit form. Please check your network connectivity.");
    }
  }

  return (
    <section id="contact" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-mono text-[#1a1a14]">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 p-4 border-2 border-[#1a1a14] bg-[#eae3cb] shadow-[4px_4px_0px_0px_#1a1a14]">
        <h2 className="text-xs uppercase font-black tracking-widest bg-[#1a1a14] text-[#f4ebd0] inline-block px-2 py-0.5 mb-3">
          Connect With Us
        </h2>
        <p className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#1a1a14]">
          Request an enterprise deployment briefing
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Column: Info Cards with Heavy Borders and Shadows */}
        <div className="lg:col-span-5 flex flex-col gap-4 justify-between">
          {[
            { icon: <Mail />, title: "Email Support", text: "deployment@hourglass.edu" },
            { icon: <Phone />, title: "Contact Phone", text: "+91 (800) 555-0199" },
            { icon: <MapPin />, title: "Institutional HQ", text: "Sector 62, Noida, UP, India" },
          ].map((item, idx) => (
            <div 
              key={idx} 
              className="bg-[#f4ebd0]/30 p-6 border-2 border-[#1a1a14] shadow-[4px_4px_0px_0px_#1a1a14] flex items-center gap-4 transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_#1a1a14]"
            >
              <div className="bg-[#eae3cb] p-3 border-2 border-[#1a1a14] shadow-[2px_2px_0px_0px_#1a1a14] [&_svg]:h-5 [&_svg]:w-5 [&_svg]:text-[#1a1a14] [&_svg]:stroke-[2.5]">
                {item.icon}
              </div>
              <div>
                <div className="text-[10px] font-black text-[#1a1a14]/60 uppercase tracking-wider">{item.title}</div>
                <div className="text-base font-black uppercase text-[#1a1a14] mt-0.5">{item.text}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Input Form Box */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 border-2 border-[#1a1a14] shadow-[6px_6px_0px_0px_#1a1a14]">
          <form onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2">
            
            <label className="grid gap-2 text-left text-xs font-black text-[#1a1a14] uppercase">
              Name
              <input
                required
                name="name"
                type="text"
                className="w-full px-4 py-3 bg-[#f4ebd0]/20 border-2 border-[#1a1a14] text-sm font-bold text-[#1a1a14] outline-none transition placeholder:text-[#1a1a14]/40 focus:bg-white focus:shadow-[2px_2px_0px_0px_#1a1a14] normal-case"
                placeholder="Your Name"
              />
            </label>

            <label className="grid gap-2 text-left text-xs font-black text-[#1a1a14] uppercase">
              Institutional Email
              <input
                required
                name="email"
                type="email"
                className="w-full px-4 py-3 bg-[#f4ebd0]/20 border-2 border-[#1a1a14] text-sm font-bold text-[#1a1a14] outline-none transition placeholder:text-[#1a1a14]/40 focus:bg-white focus:shadow-[2px_2px_0px_0px_#1a1a14] normal-case"
                placeholder="Your Email"
              />
            </label>

            <label className="grid gap-2 text-left text-xs font-black text-[#1a1a14] uppercase sm:col-span-2">
              Message
              <textarea
                required
                name="message"
                rows={4}
                minLength={10}
                className="w-full px-4 py-3 bg-[#f4ebd0]/20 border-2 border-[#1a1a14] text-sm font-bold text-[#1a1a14] outline-none transition placeholder:text-[#1a1a14]/40 focus:bg-white focus:shadow-[2px_2px_0px_0px_#1a1a14] resize-none normal-case"
                placeholder="Tell us about your system requirements, timeline, and multi-department constraints."
              />
            </label>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:col-span-2 pt-2">
              <button
                disabled={state === "loading"}
                type="submit"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#e28774] text-[#1a1a14] border-2 border-[#1a1a14] font-black uppercase px-6 py-3.5 shadow-[4px_4px_0px_0px_#1a1a14] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#1a1a14] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0px_0px_#1a1a14] transition-all text-xs tracking-wider"
              >
                <Rocket className="h-4 w-4 stroke-[2.5]"/> {state === "loading" ? "Sending..." : "Dispatch"}
              </button>

              {message ? (
                <p
                  className={`text-xs font-black uppercase px-3 py-2 border border-black inline-block ${
                    state === "error" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
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

async function readContactResponse(response: Response) {
  const text = await response.text();

  if (!text) {
    return {} as { message?: string };
  }

  try {
    return JSON.parse(text) as { message?: string };
  } catch {
    return {
      message: response.ok
        ? "The server returned an invalid response."
        : "The server returned an error page instead of JSON.",
    };
  }
}