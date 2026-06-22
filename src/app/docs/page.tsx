import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import Link from "next/link";
import { BookOpen, Webhook, Rss, ArrowLeft } from "lucide-react";


const sections = [
  {
    title: "Blogs",
    desc: "What we do and friction topics.",
    href: "/docs/blogs",
    icon: Rss,
  },
  // {
  //   title: "API Docs",
  //   desc: "Integrate HourGlass with your applications.",
  //   href: "/docs/api",
  //   icon: Webhook,
  // },
];

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-[#f4ebd0] text-[#1a1a14] font-mono">
      <Navbar />

      <main className="pt-32 pb-20 px-4 sm:px-6 max-w-7xl mx-auto">
        <Link
                  href="/"
                  className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider mb-6 hover:underline"
                >
                  <ArrowLeft className="h-3 w-3 stroke-[2.5]" />
                  Back to Page
        </Link>       
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-[#eae3cb] border-2 border-black px-3 py-1 mb-4">
            <BookOpen className="h-4 w-4 stroke-[2.5]" />
            <span className="text-[10px] font-black uppercase tracking-wider">Documentation</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight">Resources</h1>
          <p className="mt-3 text-sm font-bold text-[#1a1a14]/70 max-w-xl mx-auto">
            Everything you need to get the most out of HourGlass.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <Link
                key={section.href}
                href={section.href}
                className="border-2 border-black bg-white shadow-[4px_4px_0px_0px_#1a1a14] p-6 hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_0px_#1a1a14] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all group"
              >
                <div className="bg-[#eae3cb] border-2 border-black p-3 w-fit mb-4 group-hover:bg-[#e28774] transition-colors">
                  <Icon className="h-6 w-6 stroke-[2.5]" />
                </div>
                <h2 className="text-sm font-black uppercase tracking-tight mb-1">{section.title}</h2>
                <p className="text-[11px] font-bold text-[#1a1a14]/70">{section.desc}</p>
              </Link>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
