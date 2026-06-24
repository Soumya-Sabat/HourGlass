import { model, models, Schema, type HydratedDocument, type InferSchemaType } from "mongoose";

const NoticeSchema = new Schema(
  {
    institutionId: { type: String, required: true, index: true },
    department: { type: String, default: "", index: true },
    issuerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    issuerName: { type: String, default: "" },
    issuerRole: { type: String, default: "" },
    title: { type: String, required: true },
    content: { type: String, required: true },
    tags: { type: [String], default: [] },
    priority: { type: String, enum: ["low", "normal", "high", "urgent"], default: "normal" },
    expiresAt: { type: Date, default: null },
  },
  { timestamps: true },
);

export type NoticeDocument = HydratedDocument<InferSchemaType<typeof NoticeSchema>>;
export const NoticeModel = models.Notice || model("Notice", NoticeSchema);
