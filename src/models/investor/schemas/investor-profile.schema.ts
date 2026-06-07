import { model, models } from "mongoose";
import { createProfileSchema } from "@/models/profile/schemas/generic-profile.schema";

export const InvestorProfileModel =
  models.InvestorProfile || model("InvestorProfile", createProfileSchema());
