import { model, models, Schema, type HydratedDocument, type InferSchemaType } from "mongoose";

const EmailTemplateSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    subject: { type: String, required: true },
    body: { type: String, required: true },
    variables: [{ type: String }],
    category: { type: String, default: "general" },
  },
  { timestamps: true },
);

type EmailTemplate = InferSchemaType<typeof EmailTemplateSchema>;
export type EmailTemplateDocument = HydratedDocument<EmailTemplate>;
export const EmailTemplateModel = models.EmailTemplate || model("EmailTemplate", EmailTemplateSchema);
