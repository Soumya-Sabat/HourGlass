import {
  BookOpen,
  Building2,
  ClipboardCheck,
  GraduationCap,
  Landmark,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import type { RoleOption } from "@/components/forms/auth-form.types";

export const roleOptions: RoleOption[] = [
  { value: "institution_admin", label: "Institution Admin", icon: Landmark },
  { value: "department_admin", label: "Department Admin", icon: Building2 },
  { value: "department_head", label: "Department Head", icon: ShieldCheck },
  { value: "faculty", label: "Faculty / Teacher", icon: BookOpen },
  { value: "reviewer", label: "Reviewer", icon: ClipboardCheck },
  { value: "student", label: "Student", icon: GraduationCap },
  { value: "admin", label: "System Admin", icon: UsersRound },
];
