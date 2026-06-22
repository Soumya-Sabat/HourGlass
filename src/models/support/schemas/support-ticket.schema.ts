import { model, models, Schema, type HydratedDocument, type InferSchemaType } from "mongoose";

const SupportTicketSchema = new Schema(
  {
    ticketId: { type: String, unique: true, index: true },
    institutionId: { type: String, index: true },
    institutionName: { type: String },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    userName: { type: String },
    userEmail: { type: String },
    subject: { type: String, required: true },
    description: { type: String, required: true },
    priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
    status: { type: String, enum: ["Open", "In Progress", "Resolved", "Closed"], default: "Open" },
    assignedTo: { type: String },
    resolution: { type: String },
    attachments: [{ type: String }],
    resolvedAt: { type: Date },
    escalatedAt: { type: Date },
  },
  { timestamps: true },
);

type SupportTicket = InferSchemaType<typeof SupportTicketSchema>;
export type SupportTicketDocument = HydratedDocument<SupportTicket>;
export const SupportTicketModel = models.SupportTicket || model("SupportTicket", SupportTicketSchema);
