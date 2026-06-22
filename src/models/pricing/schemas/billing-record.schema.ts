import { model, models, Schema, type HydratedDocument, type InferSchemaType } from "mongoose";

const BillingRecordSchema = new Schema(
  {
    institutionId: { type: Schema.Types.ObjectId, ref: "Institution", required: true },
    institutionName: { type: String },
    invoiceNumber: { type: String, unique: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    paymentMethod: { type: String, enum: ["Razorpay", "Stripe", "Manual", "Bank Transfer"], default: "Manual" },
    status: { type: String, enum: ["Paid", "Failed", "Refunded", "Pending"], default: "Pending" },
    description: { type: String },
    paidAt: { type: Date },
    refundedAt: { type: Date },
  },
  { timestamps: true },
);

type BillingRecord = InferSchemaType<typeof BillingRecordSchema>;
export type BillingRecordDocument = HydratedDocument<BillingRecord>;
export const BillingRecordModel = models.BillingRecord || model("BillingRecord", BillingRecordSchema);
