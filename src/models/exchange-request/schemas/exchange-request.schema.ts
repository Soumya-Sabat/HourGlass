import { model, models, Schema, type HydratedDocument, type InferSchemaType } from "mongoose";

const ExchangeRequestSchema = new Schema(
  {
    institutionId: { type: String, required: true, index: true },
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    senderName: { type: String, default: "" },
    targetFacultyId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    targetFacultyName: { type: String, default: "" },
    fromSlot: { type: String, required: true },
    toSlot: { type: String, required: true },
    reason: { type: String, default: "" },
    status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
  },
  { timestamps: true },
);

ExchangeRequestSchema.index({ senderId: 1, createdAt: -1 });
ExchangeRequestSchema.index({ targetFacultyId: 1, createdAt: -1 });

export type ExchangeRequestDocument = HydratedDocument<InferSchemaType<typeof ExchangeRequestSchema>>;
export const ExchangeRequestModel = models.ExchangeRequest || model("ExchangeRequest", ExchangeRequestSchema);
