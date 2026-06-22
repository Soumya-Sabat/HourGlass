import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import Link from "next/link";
import { ArrowLeft, Webhook, Key, Database, Lock, Server, Code, Shield } from "lucide-react";

const endpoints = [
  {
    method: "POST",
    path: "/api/auth/register",
    desc: "Register a new user or institution.",
    auth: "No",
    body: "fullName, email, role, accountType, institution",
  },
  {
    method: "POST",
    path: "/api/auth/login",
    desc: "Request an OTP for login.",
    auth: "No",
    body: "email",
  },
  {
    method: "POST",
    path: "/api/auth/verify-login",
    desc: "Verify OTP and receive a JWT session token.",
    auth: "No",
    body: "email, otp",
  },
  {
    method: "POST",
    path: "/api/auth/verify-email",
    desc: "Verify email address during registration.",
    auth: "No",
    body: "email, otp",
  },
  {
    method: "POST",
    path: "/api/auth/resend-otp",
    desc: "Resend a verification or login OTP.",
    auth: "No",
    body: "email, purpose",
  },
  {
    method: "GET",
    path: "/api/super-admin/stats",
    desc: "Get dashboard overview statistics (super admin only).",
    auth: "Super Admin",
  },
  {
    method: "GET",
    path: "/api/super-admin/institutions",
    desc: "List institutions with status/search filters.",
    auth: "Super Admin",
    query: "status, type, search",
  },
  {
    method: "POST",
    path: "/api/super-admin/institutions/:id/approve",
    desc: "Approve a pending institution and generate code.",
    auth: "Super Admin",
  },
  {
    method: "POST",
    path: "/api/super-admin/institutions/:id/reject",
    desc: "Reject a pending institution.",
    auth: "Super Admin",
  },
  {
    method: "GET",
    path: "/api/super-admin/users",
    desc: "List all registered users (super admin only).",
    auth: "Super Admin",
    query: "role, search",
  },
  {
    method: "GET",
    path: "/api/super-admin/pricing/plans",
    desc: "List all pricing plans.",
    auth: "Super Admin",
  },
  {
    method: "POST",
    path: "/api/contact",
    desc: "Submit a contact form inquiry.",
    auth: "No",
    body: "name, email, message",
  },
];

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-[#f4ebd0] text-[#1a1a14] font-mono">
      <Navbar />

      <main className="pt-32 pb-20 px-4 sm:px-6 max-w-5xl mx-auto">
        <Link
          href="/docs"
          className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider mb-6 hover:underline"
        >
          <ArrowLeft className="h-3 w-3 stroke-[2.5]" />
          Back to Docs
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="bg-[#eae3cb] border-2 border-black p-2">
            <Webhook className="h-5 w-5 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">API Docs</h1>
            <p className="text-xs font-bold text-[#1a1a14]/70 mt-0.5">Integrate HourGlass with your applications.</p>
          </div>
        </div>

        <div className="border-2 border-black bg-white shadow-[4px_4px_0px_0px_#1a1a14] p-6 mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Key className="h-4 w-4 stroke-[2.5]" />
            <h2 className="text-xs font-black uppercase">Authentication</h2>
          </div>
          <p className="text-[11px] font-bold text-[#1a1a14]/70 leading-relaxed">
            HourGlass uses OTP-based authentication. Users request an OTP via email, then verify it to receive a session token
            (JWT). The token is stored in an HTTP-only cookie and sent automatically with subsequent requests.
            Protected endpoints require a valid super admin session.
          </p>
        </div>

        <div className="border-2 border-black bg-white shadow-[4px_4px_0px_0px_#1a1a14] overflow-hidden">
          <div className="bg-[#1a1a14] px-5 py-3">
            <h2 className="text-xs font-black uppercase tracking-wider text-[#f4ebd0]">Endpoints</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px]">
              <thead>
                <tr className="border-b-2 border-black bg-[#eae3cb]">
                  <th className="px-4 py-2.5 text-[10px] font-black uppercase">Method</th>
                  <th className="px-4 py-2.5 text-[10px] font-black uppercase">Path</th>
                  <th className="px-4 py-2.5 text-[10px] font-black uppercase">Description</th>
                  <th className="px-4 py-2.5 text-[10px] font-black uppercase">Auth</th>
                  <th className="px-4 py-2.5 text-[10px] font-black uppercase">Params</th>
                </tr>
              </thead>
              <tbody>
                {endpoints.map((ep, i) => (
                  <tr key={i} className="border-b border-black/10 hover:bg-[#f4ebd0]/50 transition-colors">
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block text-[10px] font-black px-2 py-0.5 border border-black ${
                          ep.method === "GET"
                            ? "bg-green-200 text-green-900"
                            : "bg-blue-200 text-blue-900"
                        }`}
                      >
                        {ep.method}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-[10px] font-bold">{ep.path}</td>
                    <td className="px-4 py-3 text-[10px] font-bold">{ep.desc}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-[9px] font-black px-1.5 py-0.5 border border-black ${
                          ep.auth === "No" ? "bg-gray-100" : "bg-yellow-200 text-yellow-900"
                        }`}
                      >
                        {ep.auth}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[10px] font-bold text-[#1a1a14]/60">{ep.body || ep.query || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "RESTful", desc: "Standard REST API with JSON responses.", icon: Server },
            { label: "JWT Auth", desc: "Secure HTTP-only cookie sessions.", icon: Shield },
            { label: "Encrypted", desc: "Sensitive data encrypted at rest.", icon: Lock },
            { label: "MongoDB", desc: "Real-time data from MongoDB.", icon: Database },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="border-2 border-black bg-white p-4 shadow-[2px_2px_0px_0px_#1a1a14]">
                <Icon className="h-4 w-4 stroke-[2.5] mb-2" />
                <h3 className="text-[10px] font-black uppercase">{item.label}</h3>
                <p className="text-[9px] font-bold text-[#1a1a14]/70 mt-0.5">{item.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-8 border-2 border-black bg-[#eae3cb] shadow-[4px_4px_0px_0px_#1a1a14] p-6">
          <Code className="h-4 w-4 stroke-[2.5] mb-2" />
          <h2 className="text-xs font-black uppercase mb-3">Example Request</h2>
          <pre className="bg-[#1a1a14] text-[#f4ebd0] p-4 text-[10px] font-mono overflow-x-auto leading-relaxed">
{`POST /api/auth/register
Content-Type: application/json

{
  "accountType": "institution",
  "fullName": "Rajesh Kumar",
  "email": "admin@institution.edu",
  "role": "institution_admin",
  "institution": {
    "name": "Example School",
    "type": "School",
    "academicMode": "school",
    "contactPerson": "Rajesh Kumar",
    "contactEmail": "admin@institution.edu"
  }
}`}
          </pre>
        </div>
      </main>

      <Footer />
    </div>
  );
}
