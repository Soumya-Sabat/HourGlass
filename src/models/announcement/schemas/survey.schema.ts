import { model, models, Schema, type HydratedDocument, type InferSchemaType } from "mongoose";

const SurveySchema = new Schema(
  {
    name: { type: String, required: true },
    questions: [{ question: { type: String }, type: { type: String, enum: ["text", "rating", "choice"], default: "text" }, options: [{ type: String }] }],
    targetAudience: { type: String, enum: ["All", "By Institution", "By Role"], default: "All" },
    targetRoles: [{ type: String }],
    targetInstitutionIds: [{ type: String }],
    startDate: { type: Date },
    endDate: { type: Date },
    status: { type: String, enum: ["Draft", "Active", "Closed"], default: "Draft" },
    responses: { type: Number, default: 0 },
  },
  { timestamps: true },
);

type Survey = InferSchemaType<typeof SurveySchema>;
export type SurveyDocument = HydratedDocument<Survey>;
export const SurveyModel = models.Survey || model("Survey", SurveySchema);
