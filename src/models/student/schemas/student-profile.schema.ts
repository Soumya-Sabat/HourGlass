import { model, models } from "mongoose";
import { createProfileSchema } from "@/models/profile/schemas/generic-profile.schema";

export const StudentProfileModel =
  models.StudentProfile || model("StudentProfile", createProfileSchema());
