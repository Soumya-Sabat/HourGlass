import { model, models, Schema, type HydratedDocument, type InferSchemaType } from "mongoose";

const ClusterMessageSchema = new Schema(
  {
    clusterId: { type: Schema.Types.ObjectId, ref: "Cluster", required: true, index: true },
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    senderName: { type: String, default: "" },
    content: { type: String, required: true },
  },
  { timestamps: true },
);

ClusterMessageSchema.index({ clusterId: 1, createdAt: 1 });

export type ClusterMessageDocument = HydratedDocument<InferSchemaType<typeof ClusterMessageSchema>>;
export const ClusterMessageModel = models.ClusterMessage || model("ClusterMessage", ClusterMessageSchema);
