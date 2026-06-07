import type { LucideIcon } from "lucide-react";

export type FormState = {
  error?: string;
  success?: string;
};

export type RoleOption = {
  value: string;
  label: string;
  icon: LucideIcon;
};

export type ProfileField = {
  name: string;
  label: string;
  placeholder?: string;
  type?: "text" | "number" | "url" | "textarea" | "tags" | "select";
  required?: boolean;
  options?: string[];
};
