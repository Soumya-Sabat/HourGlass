import { model, models } from "mongoose";
import { createProfileSchema } from "@/models/profile/schemas/generic-profile.schema";

export const ProfessorProfileModel =
  models.ProfessorProfile || model("ProfessorProfile", createProfileSchema());
