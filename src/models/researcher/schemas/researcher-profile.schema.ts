import { model, models } from "mongoose";
import { createProfileSchema } from "@/models/profile/schemas/generic-profile.schema";

export const ResearcherProfileModel =
  models.ResearcherProfile || model("ResearcherProfile", createProfileSchema());
