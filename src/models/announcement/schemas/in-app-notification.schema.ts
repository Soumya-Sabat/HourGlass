import { model, models, Schema, type HydratedDocument, type InferSchemaType } from "mongoose";

const InAppNotificationSchema = new Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    targetUserIds: [{ type: Schema.Types.ObjectId, ref: "User" }],
    targetRole: { type: String },
    priority: { type: String, enum: ["Low", "Medium", "High", "Urgent"], default: "Medium" },
    isRead: { type: Boolean, default: false },
    readBy: [{ userId: { type: Schema.Types.ObjectId, ref: "User" }, readAt: { type: Date } }],
    expiryDate: { type: Date },
    link: { type: String },
  },
  { timestamps: true },
);

type InAppNotification = InferSchemaType<typeof InAppNotificationSchema>;
export type InAppNotificationDocument = HydratedDocument<InAppNotification>;
export const InAppNotificationModel = models.InAppNotification || model("InAppNotification", InAppNotificationSchema);
