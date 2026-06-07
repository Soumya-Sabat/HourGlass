import { NextResponse } from "next/server";
import type { ZodError, ZodType } from "zod";

export function ok<T>(data: T) {
  return NextResponse.json({ success: true, data });
}

export function fail(error: unknown, status = 400) {
  const message = error instanceof Error ? error.message : "Something went wrong.";

  return NextResponse.json({ success: false, error: message }, { status });
}

export async function readValidatedJson<T>(request: Request, schema: ZodType<T>) {
  const payload = await request.json();
  const parsed = schema.safeParse(payload);

  if (!parsed.success) {
    throw new Error(formatZodError(parsed.error));
  }

  return parsed.data;
}

function formatZodError(error: ZodError) {
  return error.issues.map((issue) => issue.message).join(" ");
}
