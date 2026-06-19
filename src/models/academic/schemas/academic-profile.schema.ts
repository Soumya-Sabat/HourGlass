import { model, models } from "mongoose";
import { createProfileSchema } from "@/models/profile/schemas/generic-profile.schema";

export const AcademicProfileModel =
  models.AcademicProfile || model("AcademicProfile", createProfileSchema());
