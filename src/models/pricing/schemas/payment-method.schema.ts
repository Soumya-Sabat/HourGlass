import { model, models, Schema, type HydratedDocument, type InferSchemaType } from "mongoose";

const PaymentMethodSchema = new Schema(
  {
    gateway: { type: String, required: true, unique: true },
    displayName: { type: String, required: true },
    isEnabled: { type: Boolean, default: true },
    apiKey: { type: String },
    apiSecret: { type: String },
    webhookSecret: { type: String },
    config: { type: Schema.Types.Mixed },
  },
  { timestamps: true },
);

type PaymentMethod = InferSchemaType<typeof PaymentMethodSchema>;
export type PaymentMethodDocument = HydratedDocument<PaymentMethod>;
export const PaymentMethodModel = models.PaymentMethod || model("PaymentMethod", PaymentMethodSchema);
