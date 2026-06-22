import { model, models, Schema, type HydratedDocument, type InferSchemaType } from "mongoose";

const GDPRRequestSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    userName: { type: String },
    userEmail: { type: String },
    institutionId: { type: String },
    requestType: { type: String, enum: ["Access", "Delete", "Rectify"], required: true },
    status: { type: String, enum: ["Pending", "Completed", "Rejected"], default: "Pending" },
    details: { type: String },
    completedAt: { type: Date },
  },
  { timestamps: true },
);

type GDPRRequest = InferSchemaType<typeof GDPRRequestSchema>;
export type GDPRRequestDocument = HydratedDocument<GDPRRequest>;
export const GDPRRequestModel = models.GDPRRequest || model("GDPRRequest", GDPRRequestSchema);
