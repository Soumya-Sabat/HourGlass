import type { ReactNode } from "react";
import type { FormState, ProfileField } from "@/components/forms/auth-form.types";

export function FieldLabel({ children }: { children: ReactNode }) {
  return <label className="block break-words text-xs font-black uppercase tracking-wider text-slate-500">{children}</label>;
}

export function Message({ state }: { state: FormState }) {
  if (!state.error && !state.success) {
    return null;
  }

  return (
    <div
      className={`break-words rounded-lg border px-4 py-3 text-sm font-semibold ${
        state.error
          ? "border-red-200 bg-red-50 text-red-700"
          : "border-emerald-200 bg-emerald-50 text-emerald-700"
      }`}
    >
      {state.error ?? state.success}
    </div>
  );
}

export function TextInput({
  name,
  label,
  placeholder,
  type = "text",
  required,
  min,
  max,
  minLength,
  maxLength,
  pattern,
  title,
  inputMode,
  autoComplete,
}: {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  min?: string | number;
  max?: string | number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  title?: string;
  inputMode?: "none" | "text" | "tel" | "url" | "email" | "numeric" | "decimal" | "search";
  autoComplete?: string;
}) {
  return (
    <div className="min-w-0 space-y-2">
      <FieldLabel>{label}</FieldLabel>
      <input
        name={name}
        type={type}
        required={required}
        min={min ?? (type === "number" ? 0 : undefined)}
        max={max}
        minLength={minLength}
        maxLength={maxLength}
        pattern={pattern}
        title={title}
        inputMode={inputMode}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className="h-12 w-full min-w-0 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 outline-none transition focus:border-brand-sky focus:ring-4 focus:ring-brand-sky/10"
      />
    </div>
  );
}

export function ProfileFieldInput({ field }: { field: ProfileField }) {
  if (field.type === "select") {
    return (
      <div className="min-w-0 space-y-2">
        <FieldLabel>{field.label}</FieldLabel>
        <select
          name={`profile.${field.name}`}
          required={field.required}
          defaultValue=""
          className="h-12 w-full min-w-0 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 outline-none transition focus:border-brand-sky focus:ring-4 focus:ring-brand-sky/10"
        >
          <option value="" disabled>
            Select
          </option>
          {field.options?.map((option) => (
            <option key={option} value={option.toLowerCase()}>
              {option}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (field.type === "textarea") {
    return (
      <div className="min-w-0 space-y-2 sm:col-span-2">
        <FieldLabel>{field.label}</FieldLabel>
        <textarea
          name={`profile.${field.name}`}
          required={field.required}
          rows={4}
          placeholder={field.placeholder}
          className="w-full min-w-0 resize-none rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-brand-sky focus:ring-4 focus:ring-brand-sky/10"
        />
      </div>
    );
  }

  return (
    <TextInput
      name={`profile.${field.name}`}
      label={field.label}
      type={field.type === "number" ? "number" : field.type === "url" ? "url" : "text"}
      required={field.required}
      placeholder={field.placeholder}
    />
  );
}
