import { model, models, Schema, type HydratedDocument, type InferSchemaType } from "mongoose";

const AttendanceRecordSchema = new Schema(
  {
    institutionId: { type: String, required: true, index: true },
    studentId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    subjectId: { type: Schema.Types.ObjectId, ref: "Subject", required: true },
    subjectName: { type: String, default: "" },
    date: { type: Date, required: true },
    status: { type: String, enum: ["present", "absent", "leave"], required: true },
    markedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

export type AttendanceRecordDocument = HydratedDocument<InferSchemaType<typeof AttendanceRecordSchema>>;
export const AttendanceRecordModel = models.AttendanceRecord || model("AttendanceRecord", AttendanceRecordSchema);
