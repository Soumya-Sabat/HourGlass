import { model, models, Schema, type HydratedDocument, type InferSchemaType } from "mongoose";

const RefundSchema = new Schema(
  {
    institutionId: { type: Schema.Types.ObjectId, ref: "Institution", required: true },
    institutionName: { type: String },
    billingRecordId: { type: Schema.Types.ObjectId, ref: "BillingRecord" },
    amount: { type: Number, required: true },
    reason: { type: String, required: true },
    status: { type: String, enum: ["Pending", "Processed", "Rejected"], default: "Pending" },
    processedAt: { type: Date },
    rejectedReason: { type: String },
  },
  { timestamps: true },
);

type Refund = InferSchemaType<typeof RefundSchema>;
export type RefundDocument = HydratedDocument<Refund>;
export const RefundModel = models.Refund || model("Refund", RefundSchema);
