import { model, models, Schema, type HydratedDocument, type InferSchemaType } from "mongoose";

const CouponSchema = new Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true },
    discountPercent: { type: Number, default: 0 },
    discountAmount: { type: Number, default: 0 },
    validityStart: { type: Date, required: true },
    validityEnd: { type: Date, required: true },
    maxUses: { type: Number, default: 100 },
    usedCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

type Coupon = InferSchemaType<typeof CouponSchema>;
export type CouponDocument = HydratedDocument<Coupon>;
export const CouponModel = models.Coupon || model("Coupon", CouponSchema);
