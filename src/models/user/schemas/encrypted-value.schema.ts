import { Schema } from "mongoose";

export const EncryptedValueSchema = new Schema(
  {
    cipherText: { type: String, required: true },
    iv: { type: String, required: true },
    salt: { type: String, required: true },
    tag: { type: String, required: true },
  },
  { _id: false },
);
