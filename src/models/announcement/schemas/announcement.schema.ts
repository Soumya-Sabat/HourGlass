import { model, models, Schema, type HydratedDocument, type InferSchemaType } from "mongoose";

const AnnouncementSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    targetAudience: { type: String, enum: ["All", "Institution", "Specific Users"], default: "All" },
    targetInstitutionIds: [{ type: String }],
    targetUserIds: [{ type: Schema.Types.ObjectId, ref: "User" }],
    scheduledDate: { type: Date },
    expiryDate: { type: Date },
    status: { type: String, enum: ["Draft", "Published", "Archived"], default: "Draft" },
    publishedAt: { type: Date },
    createdBy: { type: String },
  },
  { timestamps: true },
);

type Announcement = InferSchemaType<typeof AnnouncementSchema>;
export type AnnouncementDocument = HydratedDocument<Announcement>;
export const AnnouncementModel = models.Announcement || model("Announcement", AnnouncementSchema);
