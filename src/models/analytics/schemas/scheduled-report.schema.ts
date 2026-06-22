import { model, models, Schema, type HydratedDocument, type InferSchemaType } from "mongoose";

const ScheduledReportSchema = new Schema(
  {
    name: { type: String, required: true },
    frequency: { type: String, enum: ["Daily", "Weekly", "Monthly"], required: true },
    recipients: [{ type: String }],
    filters: { type: Schema.Types.Mixed },
    columns: [{ type: String }],
    lastSentAt: { type: Date },
    isActive: { type: Boolean, default: true },
    format: { type: String, enum: ["CSV", "PDF", "Excel"], default: "CSV" },
  },
  { timestamps: true },
);

type ScheduledReport = InferSchemaType<typeof ScheduledReportSchema>;
export type ScheduledReportDocument = HydratedDocument<ScheduledReport>;
export const ScheduledReportModel = models.ScheduledReport || model("ScheduledReport", ScheduledReportSchema);
