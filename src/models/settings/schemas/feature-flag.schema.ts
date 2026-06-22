import { model, models, Schema, type HydratedDocument, type InferSchemaType } from "mongoose";

const FeatureFlagSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    isEnabled: { type: Boolean, default: false },
    category: { type: String, default: "general" },
  },
  { timestamps: true },
);

type FeatureFlag = InferSchemaType<typeof FeatureFlagSchema>;
export type FeatureFlagDocument = HydratedDocument<FeatureFlag>;
export const FeatureFlagModel = models.FeatureFlag || model("FeatureFlag", FeatureFlagSchema);
