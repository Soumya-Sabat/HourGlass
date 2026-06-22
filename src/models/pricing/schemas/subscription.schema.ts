import { model, models, Schema, type HydratedDocument, type InferSchemaType } from "mongoose";

const SubscriptionSchema = new Schema(
  {
    institutionId: { type: Schema.Types.ObjectId, ref: "Institution", required: true },
    institutionName: { type: String },
    institutionCode: { type: String },
    planId: { type: Schema.Types.ObjectId, ref: "PricingPlan", required: true },
    planName: { type: String },
    billingCycle: { type: String, enum: ["Monthly", "Yearly"], default: "Monthly" },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: { type: String, enum: ["Active", "Expired", "Cancelled", "Trial"], default: "Trial" },
    paymentStatus: { type: String, enum: ["Paid", "Pending", "Failed"], default: "Pending" },
    autoRenew: { type: Boolean, default: true },
    cancelledAt: { type: Date },
  },
  { timestamps: true },
);

type Subscription = InferSchemaType<typeof SubscriptionSchema>;
export type SubscriptionDocument = HydratedDocument<Subscription>;
export const SubscriptionModel = models.Subscription || model("Subscription", SubscriptionSchema);
