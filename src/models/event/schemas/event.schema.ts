import { model, models, Schema, type HydratedDocument, type InferSchemaType } from "mongoose";

const EventSchema = new Schema(
  {
    institutionId: { type: String, required: true, index: true },
    department: { type: String, default: "", index: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    eventDate: { type: Date },
    terminationDate: { type: Date, default: null },
    eventType: { type: String, enum: ["academic", "cultural", "sports", "meeting", "holiday", "general"], default: "general" },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    alertSent: { type: Boolean, default: false },
  },
  { timestamps: true },
);

type Event = InferSchemaType<typeof EventSchema>;
export type EventDocument = HydratedDocument<Event>;
export const EventModel = models.Event || model("Event", EventSchema);
