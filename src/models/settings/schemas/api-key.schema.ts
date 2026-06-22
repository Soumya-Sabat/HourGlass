import { model, models, Schema, type HydratedDocument, type InferSchemaType } from "mongoose";

const APIKeySchema = new Schema(
  {
    serviceName: { type: String, required: true },
    apiKey: { type: String, required: true },
    apiSecret: { type: String },
    isActive: { type: Boolean, default: true },
    lastUsedAt: { type: Date },
    rateLimitPerMinute: { type: Number, default: 100 },
  },
  { timestamps: true },
);

type APIKey = InferSchemaType<typeof APIKeySchema>;
export type APIKeyDocument = HydratedDocument<APIKey>;
export const APIKeyModel = models.APIKey || model("APIKey", APIKeySchema);
