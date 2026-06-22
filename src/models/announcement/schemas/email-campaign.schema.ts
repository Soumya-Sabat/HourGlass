import { model, models, Schema, type HydratedDocument, type InferSchemaType } from "mongoose";

const EmailCampaignSchema = new Schema(
  {
    name: { type: String, required: true },
    subject: { type: String, required: true },
    body: { type: String, required: true },
    recipientFilter: { type: String, enum: ["All", "By Role", "By Institution"], default: "All" },
    recipientRoles: [{ type: String }],
    recipientInstitutionIds: [{ type: String }],
    sentCount: { type: Number, default: 0 },
    totalRecipients: { type: Number, default: 0 },
    status: { type: String, enum: ["Draft", "Sent", "Scheduled"], default: "Draft" },
    sentAt: { type: Date },
    scheduledAt: { type: Date },
  },
  { timestamps: true },
);

type EmailCampaign = InferSchemaType<typeof EmailCampaignSchema>;
export type EmailCampaignDocument = HydratedDocument<EmailCampaign>;
export const EmailCampaignModel = models.EmailCampaign || model("EmailCampaign", EmailCampaignSchema);
