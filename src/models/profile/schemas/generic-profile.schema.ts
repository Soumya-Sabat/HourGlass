import { Schema } from "mongoose";
import { EncryptedValueSchema } from "@/models/user/schemas/encrypted-value.schema";

export function createProfileSchema() {
  return new Schema(
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
        index: true,
      },
    },
    {
      strict: false,
      timestamps: true,
    },
  ).add({
    metadata: { type: EncryptedValueSchema },
  });
}
