import {
  BookOpen,
  Building2,
  ClipboardCheck,
  GraduationCap,
  ShieldCheck,
} from "lucide-react";
import type { RoleOption } from "@/components/forms/auth-form.types";

export const roleOptions: RoleOption[] = [
  { value: "department_admin", label: "Department Admin", icon: Building2 },
  { value: "department_head", label: "Department Head", icon: ShieldCheck },
  { value: "faculty", label: "Faculty / Teacher", icon: BookOpen },
  { value: "reviewer", label: "Reviewer", icon: ClipboardCheck },
  { value: "student", label: "Student", icon: GraduationCap },

];
