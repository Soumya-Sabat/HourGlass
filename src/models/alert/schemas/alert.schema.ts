import { model, models, Schema, type HydratedDocument, type InferSchemaType } from "mongoose";

const AlertSchema = new Schema(
  {
    institutionId: { type: String, required: true, index: true },
    department: { type: String, default: "", index: true },
    targetUserId: { type: Schema.Types.ObjectId, ref: "User", default: null, index: true },
    targetRole: { type: String, default: "" },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ["event", "exam", "notice", "announcement", "general"], default: "general" },
    link: { type: String, default: "" },
    read: { type: Boolean, default: false, index: true },
  },
  { timestamps: true },
);

type Alert = InferSchemaType<typeof AlertSchema>;
export type AlertDocument = HydratedDocument<Alert>;
export const AlertModel = models.Alert || model("Alert", AlertSchema);
