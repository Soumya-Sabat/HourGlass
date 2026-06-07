import {
  BadgeCheck,
  BookOpen,
  BriefcaseBusiness,
  Building2,
  GraduationCap,
  Microscope,
  ShieldCheck,
} from "lucide-react";
import type { RoleOption } from "@/components/forms/auth-form.types";

export const roleOptions: RoleOption[] = [
  { value: "professor", label: "Professor", icon: BookOpen },
  { value: "researcher", label: "Researcher", icon: Microscope },
  { value: "industry", label: "Industrialist", icon: BriefcaseBusiness },
  { value: "founder", label: "Founder", icon: Building2 },
  { value: "incubator", label: "Incubation Head", icon: ShieldCheck },
  { value: "investor", label: "Investor", icon: BadgeCheck },
  { value: "student", label: "Student", icon: GraduationCap },
];
