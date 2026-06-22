import { model, models, Schema, type HydratedDocument, type InferSchemaType } from "mongoose";

const BackupRecordSchema = new Schema(
  {
    fileName: { type: String, required: true },
    fileSize: { type: Number },
    status: { type: String, enum: ["In Progress", "Completed", "Failed"], default: "In Progress" },
    type: { type: String, enum: ["Manual", "Scheduled"], default: "Manual" },
    retentionDays: { type: Number, default: 30 },
    completedAt: { type: Date },
    errorMessage: { type: String },
  },
  { timestamps: true },
);

type BackupRecord = InferSchemaType<typeof BackupRecordSchema>;
export type BackupRecordDocument = HydratedDocument<BackupRecord>;
export const BackupRecordModel = models.BackupRecord || model("BackupRecord", BackupRecordSchema);
