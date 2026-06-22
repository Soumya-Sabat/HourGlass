import { model, models, Schema, type HydratedDocument, type InferSchemaType } from "mongoose";

const FeedbackSchema = new Schema(
  {
    institutionId: { type: Schema.Types.ObjectId, ref: "Institution" },
    institutionName: { type: String },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    userName: { type: String },
    feedbackType: { type: String, enum: ["Bug", "Suggestion", "Praise"], required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ["New", "Reviewed", "Implemented"], default: "New" },
  },
  { timestamps: true },
);

type Feedback = InferSchemaType<typeof FeedbackSchema>;
export type FeedbackDocument = HydratedDocument<Feedback>;
export const FeedbackModel = models.Feedback || model("Feedback", FeedbackSchema);
