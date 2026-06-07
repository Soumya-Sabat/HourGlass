import { model, models } from "mongoose";
import { createProfileSchema } from "@/models/profile/schemas/generic-profile.schema";

export const IncubatorProfileModel =
  models.IncubatorProfile || model("IncubatorProfile", createProfileSchema());
