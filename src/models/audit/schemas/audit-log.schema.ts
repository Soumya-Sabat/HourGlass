import { model, models, Schema, type HydratedDocument, type InferSchemaType } from "mongoose";

const AuditLogSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    userName: { type: String },
    action: { type: String, required: true },
    resource: { type: String, required: true },
    resourceId: { type: String },
    details: { type: Schema.Types.Mixed },
    institutionId: { type: String },
    ipAddress: { type: String },
    userAgent: { type: String },
  },
  { timestamps: true },
);

type AuditLog = InferSchemaType<typeof AuditLogSchema>;
export type AuditLogDocument = HydratedDocument<AuditLog>;
export const AuditLogModel = models.AuditLog || model("AuditLog", AuditLogSchema);
