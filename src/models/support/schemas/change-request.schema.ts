import { model, models, Schema, type HydratedDocument, type InferSchemaType } from "mongoose";

const ChangeRequestSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    institutionId: {
      type: String,
      required: true,
      index: true,
    },
    fieldName: {
      type: String,
      required: true,
    },
    currentValue: {
      type: String,
      default: "",
    },
    requestedValue: {
      type: String,
      default: "",
    },
    reason: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },
    adminNote: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

type ChangeRequest = InferSchemaType<typeof ChangeRequestSchema>;

export type ChangeRequestDocument = HydratedDocument<ChangeRequest>;

export const ChangeRequestModel =
  models.ChangeRequest || model("ChangeRequest", ChangeRequestSchema);
