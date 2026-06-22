import { connectToDatabase } from "@/lib/db/mongoose";
import { PricingPlanModel } from "@/models/pricing/schemas/pricing-plan.schema";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Check } from "lucide-react";

async function getPlans() {
  try {
    await connectToDatabase();
    const plans = await PricingPlanModel.find({ isActive: true }).sort({ priceMonthly: 1 }).lean();
    return plans.map((p) => ({
      _id: String(p._id),
      name: p.name,
      priceMonthly: p.priceMonthly,
      priceYearly: p.priceYearly,
      features: p.features ?? [],
      maxUsers: p.maxUsers ?? 100,
      maxTimetablesPerMonth: p.maxTimetablesPerMonth ?? 10,
      trialPeriodDays: p.trialPeriodDays ?? 14,
    }));
  } catch {
    return [];
  }
}

export default async function PricingPage() {
  const plans = await getPlans();

  return (
    <div className="min-h-screen bg-[#f4ebd0] text-[#1a1a14] font-mono">
      <Navbar />

      <main className="pt-32 pb-20 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight">Pricing Plans</h1>
          <p className="mt-3 text-sm font-bold text-[#1a1a14]/70 max-w-xl mx-auto">
            Choose the plan that fits your institution. All plans include a {plans[0]?.trialPeriodDays ?? 14}-day free trial.
          </p>
        </div>

        {plans.length === 0 ? (
          <div className="text-center py-20 border-2 border-black bg-white shadow-[4px_4px_0px_0px_#1a1a14]">
            <p className="text-sm font-bold text-[#1a1a14]/50">No pricing plans available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan._id}
                className="border-2 border-black bg-white shadow-[4px_4px_0px_0px_#1a1a14] flex flex-col"
              >
                <div className="border-b-2 border-black bg-[#1a1a14] px-5 py-3">
                  <h2 className="text-sm font-black uppercase tracking-wider text-[#f4ebd0]">{plan.name}</h2>
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <div className="mb-5">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black">${plan.priceMonthly}</span>
                      <span className="text-[10px] font-bold text-[#1a1a14]/50">/mo</span>
                    </div>
                    <p className="text-[10px] font-bold text-[#1a1a14]/50 mt-0.5">
                      ${plan.priceYearly}/year (${Math.round(plan.priceYearly / 12)}/mo billed yearly)
                    </p>
                  </div>

                  <div className="text-[10px] font-bold text-[#1a1a14]/60 mb-4 space-y-1">
                    <p>Up to {plan.maxUsers} users</p>
                    <p>{plan.maxTimetablesPerMonth} timetables/mo</p>
                    <p>{plan.trialPeriodDays}-day free trial</p>
                  </div>

                  <ul className="space-y-2 mb-6 flex-1">
                    {plan.features.map((feature: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-[11px] font-bold">
                        <Check className="h-3.5 w-3.5 mt-0.5 shrink-0 stroke-[3] text-green-700" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href="/register"
                    className="block w-full text-center bg-[#e28774] border-2 border-black py-2.5 text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_#1a1a14] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#1a1a14] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
                  >
                    Get Started
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-16 border-2 border-black bg-[#eae3cb] shadow-[4px_4px_0px_0px_#1a1a14] p-6 text-center">
          <h3 className="text-sm font-black uppercase tracking-wider mb-2">Need a custom plan?</h3>
          <p className="text-[11px] font-bold text-[#1a1a14]/70 mb-4">
            Contact our sales team for enterprise pricing and custom requirements.
          </p>
          <a
            href="#contact"
            className="inline-block bg-white border-2 border-black px-6 py-2 text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_#1a1a14] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#1a1a14] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
          >
            Contact Sales
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}
