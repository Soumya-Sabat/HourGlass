import { model, models, Schema, type HydratedDocument, type InferSchemaType } from "mongoose";

const FAQSchema = new Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    category: { type: String, enum: ["Billing", "Technical", "General"], default: "General" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

type FAQ = InferSchemaType<typeof FAQSchema>;
export type FAQDocument = HydratedDocument<FAQ>;
export const FAQModel = models.FAQ || model("FAQ", FAQSchema);
