import { model, models, Schema, type HydratedDocument, type InferSchemaType } from "mongoose";

const MarksheetEntrySchema = new Schema(
  {
    institutionId: { type: String, required: true, index: true },
    studentId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    subjectId: { type: Schema.Types.ObjectId, ref: "Subject" },
    subjectName: { type: String, default: "" },
    examType: { type: String, required: true },
    examName: { type: String, required: true },
    marksObtained: { type: Number, default: 0 },
    totalMarks: { type: Number, default: 100 },
    gradedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

export type MarksheetEntryDocument = HydratedDocument<InferSchemaType<typeof MarksheetEntrySchema>>;
export const MarksheetEntryModel = models.MarksheetEntry || model("MarksheetEntry", MarksheetEntrySchema);
