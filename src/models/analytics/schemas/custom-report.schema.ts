import { model, models, Schema, type HydratedDocument, type InferSchemaType } from "mongoose";

const CustomReportSchema = new Schema(
  {
    name: { type: String, required: true },
    filters: { type: Schema.Types.Mixed },
    columns: [{ type: String }],
    createdBy: { type: String },
    lastRunAt: { type: Date },
    isSaved: { type: Boolean, default: true },
  },
  { timestamps: true },
);

type CustomReport = InferSchemaType<typeof CustomReportSchema>;
export type CustomReportDocument = HydratedDocument<CustomReport>;
export const CustomReportModel = models.CustomReport || model("CustomReport", CustomReportSchema);
