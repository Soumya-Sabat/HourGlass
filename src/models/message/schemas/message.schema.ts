import { model, models, Schema, type HydratedDocument, type InferSchemaType } from "mongoose";

const MessageSchema = new Schema(
  {
    institutionId: { type: String, required: true, index: true },
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    senderName: { type: String, default: "" },
    senderRole: { type: String, default: "" },
    receiverId: { type: Schema.Types.ObjectId, ref: "User", default: null },
    receiverName: { type: String, default: "" },
    subject: { type: String, default: "" },
    content: { type: String, required: true },
    read: { type: Boolean, default: false, index: true },
  },
  { timestamps: true },
);

export type MessageDocument = HydratedDocument<InferSchemaType<typeof MessageSchema>>;
export const MessageModel = models.Message || model("Message", MessageSchema);
