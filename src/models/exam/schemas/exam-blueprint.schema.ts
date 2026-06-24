import { model, models, Schema, type HydratedDocument, type InferSchemaType } from "mongoose";

const ExamBlueprintSchema = new Schema(
  {
    institutionId: { type: String, required: true, index: true },
    subjectId: { type: Schema.Types.ObjectId, ref: "Subject" },
    subjectName: { type: String, default: "" },
    title: { type: String, default: "" },
    subject: { type: String, default: "" },
    examDate: { type: Date },
    startTime: { type: String, default: "" },
    endTime: { type: String, default: "" },
    maxMarks: { type: Number, default: 100 },
    semester: { type: Number, default: 1 },
    department: { type: String, default: "" },
    academicYear: { type: String, default: "" },
    exams: [
      {
        name: { type: String, required: true },
        totalMarks: { type: Number, required: true },
        order: { type: Number, required: true },
        scheduledDate: { type: Date },
      },
    ],
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

ExamBlueprintSchema.index({ institutionId: 1, department: 1 });

export type ExamBlueprintDocument = HydratedDocument<InferSchemaType<typeof ExamBlueprintSchema>>;
export const ExamBlueprintModel = models.ExamBlueprint || model("ExamBlueprint", ExamBlueprintSchema);
