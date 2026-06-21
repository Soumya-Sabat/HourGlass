import { model, models, Schema, type HydratedDocument, type InferSchemaType } from "mongoose";

const TimetableEntrySchema = new Schema(
  {
    institutionId: { type: String, required: true, index: true },
    batch: { type: String, required: true, index: true },
    subjectId: { type: Schema.Types.ObjectId, ref: "Subject" },
    subjectName: { type: String, default: "" },
    facultyId: { type: Schema.Types.ObjectId, ref: "User" },
    facultyName: { type: String, default: "" },
    dayOfWeek: { type: Number, required: true, min: 0, max: 6 },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    room: { type: String, default: "" },
    type: { type: String, enum: ["lecture", "lab", "tutorial", "free"], default: "lecture" },
  },
  { timestamps: true },
);

export type TimetableEntryDocument = HydratedDocument<InferSchemaType<typeof TimetableEntrySchema>>;
export const TimetableEntryModel = models.TimetableEntry || model("TimetableEntry", TimetableEntrySchema);
