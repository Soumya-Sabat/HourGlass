import { model, models, Schema, type HydratedDocument, type InferSchemaType } from "mongoose";

const MaintenanceLogSchema = new Schema(
  {
    isActive: { type: Boolean, default: false },
    message: { type: String, default: "System is under maintenance. Please check back later." },
    startTime: { type: Date },
    endTime: { type: Date },
    enabledBy: { type: String },
  },
  { timestamps: true },
);

type MaintenanceLog = InferSchemaType<typeof MaintenanceLogSchema>;
export type MaintenanceLogDocument = HydratedDocument<MaintenanceLog>;
export const MaintenanceLogModel = models.MaintenanceLog || model("MaintenanceLog", MaintenanceLogSchema);
