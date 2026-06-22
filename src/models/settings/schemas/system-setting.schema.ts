import { model, models, Schema, type HydratedDocument, type InferSchemaType } from "mongoose";

const SystemSettingSchema = new Schema(
  {
    key: { type: String, required: true, unique: true },
    value: { type: Schema.Types.Mixed, required: true },
    description: { type: String },
    category: { type: String, default: "general" },
  },
  { timestamps: true },
);

type SystemSetting = InferSchemaType<typeof SystemSettingSchema>;
export type SystemSettingDocument = HydratedDocument<SystemSetting>;
export const SystemSettingModel = models.SystemSetting || model("SystemSetting", SystemSettingSchema);
