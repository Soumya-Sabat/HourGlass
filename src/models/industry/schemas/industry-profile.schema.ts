import { model, models } from "mongoose";
import { createProfileSchema } from "@/models/profile/schemas/generic-profile.schema";

export const IndustryProfileModel =
  models.IndustryProfile || model("IndustryProfile", createProfileSchema());
