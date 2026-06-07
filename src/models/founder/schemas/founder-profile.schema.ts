import { model, models } from "mongoose";
import { createProfileSchema } from "@/models/profile/schemas/generic-profile.schema";

export const FounderProfileModel =
  models.FounderProfile || model("FounderProfile", createProfileSchema());
