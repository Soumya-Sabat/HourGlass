import { model, models, Schema, type HydratedDocument, type InferSchemaType } from "mongoose";
import { EncryptedValueSchema } from "@/models/user/schemas/encrypted-value.schema";

const InstitutionSchema = new Schema(
  {
    institutionId: {
      type: String,
      unique: true,
      sparse: true,
      match: /^[A-Z0-9]{7}$/,
      index: true,
    },
    ownerUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    nameHash: { type: String, required: true, index: true },
    name: { type: EncryptedValueSchema, required: true },
    type: { type: EncryptedValueSchema, required: true },
    affiliation: { type: EncryptedValueSchema },
    establishedYear: { type: EncryptedValueSchema },
    website: { type: EncryptedValueSchema },
    contactPerson: { type: EncryptedValueSchema, required: true },
    contactEmail: { type: EncryptedValueSchema, required: true },
    contactPhone: { type: EncryptedValueSchema },
    address: { type: EncryptedValueSchema },
    isVerified: { type: Boolean, default: false, index: true },
    verifiedAt: { type: Date },
    institutionIdGeneratedAt: { type: Date },
  },
  { timestamps: true },
);

type Institution = InferSchemaType<typeof InstitutionSchema>;

export type InstitutionDocument = HydratedDocument<Institution>;

export const InstitutionModel = models.Institution || model("Institution", InstitutionSchema);
