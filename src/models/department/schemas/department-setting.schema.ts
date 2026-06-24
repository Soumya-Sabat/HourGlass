import { model, models, Schema, type HydratedDocument, type InferSchemaType } from "mongoose";

const DepartmentSettingSchema = new Schema(
  {
    institutionId: { type: String, required: true, index: true },
    department: { type: String, required: true, index: true },
    displayName: { type: String, default: "" },
    code: { type: String, default: "" },
    description: { type: String, default: "" },
  },
  { timestamps: true },
);

type DepartmentSetting = InferSchemaType<typeof DepartmentSettingSchema>;
export type DepartmentSettingDocument = HydratedDocument<DepartmentSetting>;
export const DepartmentSettingModel = models.DepartmentSetting || model("DepartmentSetting", DepartmentSettingSchema);
