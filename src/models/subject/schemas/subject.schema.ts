import { model, models, Schema, type HydratedDocument, type InferSchemaType } from "mongoose";

const SubjectSchema = new Schema(
  {
    institutionId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    code: { type: String, required: true },
    credits: { type: Number, default: 0 },
    semester: { type: Number, default: 1 },
    department: { type: String, default: "" },
    syllabus: { type: String, default: "" },
    syllabusFile: { type: String, default: "" },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

export type SubjectDocument = HydratedDocument<InferSchemaType<typeof SubjectSchema>>;
export const SubjectModel = models.Subject || model("Subject", SubjectSchema);
