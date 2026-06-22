import { model, models, Schema, type HydratedDocument, type InferSchemaType } from "mongoose";

const PricingPlanSchema = new Schema(
  {
    name: { type: String, required: true },
    priceMonthly: { type: Number, required: true },
    priceYearly: { type: Number, required: true },
    features: [{ type: String }],
    maxUsers: { type: Number, default: 100 },
    maxTimetablesPerMonth: { type: Number, default: 10 },
    trialPeriodDays: { type: Number, default: 14 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

type PricingPlan = InferSchemaType<typeof PricingPlanSchema>;
export type PricingPlanDocument = HydratedDocument<PricingPlan>;
export const PricingPlanModel = models.PricingPlan || model("PricingPlan", PricingPlanSchema);
