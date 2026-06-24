import { model, models, Schema, type HydratedDocument, type InferSchemaType } from "mongoose";

const ClusterMemberSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, default: "" },
    joinedAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const ClusterSchema = new Schema(
  {
    institutionId: { type: String, required: true, index: true },
    department: { type: String, default: "", index: true },
    name: { type: String, required: true },
    subjectId: { type: Schema.Types.ObjectId, ref: "Subject" },
    subjectName: { type: String, default: "" },
    leadId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    leadName: { type: String, default: "" },
    members: [ClusterMemberSchema],
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

ClusterSchema.index({ institutionId: 1, "members.userId": 1 });
ClusterSchema.index({ institutionId: 1, leadId: 1 });

export type ClusterDocument = HydratedDocument<InferSchemaType<typeof ClusterSchema>>;
export const ClusterModel = models.Cluster || model("Cluster", ClusterSchema);
