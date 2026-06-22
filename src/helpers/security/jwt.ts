import crypto from "crypto";
import { UserRole } from "@/models/user/types/user-role.enum";

export const AUTH_COOKIE_NAME = "hourglass-token";

export type AuthTokenPayload = {
  sub: string;
  role: UserRole;
  name: string;
  email: string;
  isEmailVerified: boolean;
  iat: number;
  exp: number;
};

const TOKEN_TTL_SECONDS = 60 * 60 * 24 ; //1 day

function getJwtSecret() {
  return process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || "hourglass-local-development-secret";
}

function base64UrlEncode(value: string | Buffer) {
  return Buffer.from(value).toString("base64url");
}

function sign(data: string) {
  return crypto.createHmac("sha256", getJwtSecret()).update(data).digest("base64url");
}

export function getDashboardPathForRole(role: string) {
  const paths: Record<string, string> = {
    [UserRole.InstitutionAdmin]: "/dashboard/institution",
    [UserRole.DepartmentAdmin]: "/dashboard/department",
    [UserRole.DepartmentHead]: "/dashboard/head",
    [UserRole.Faculty]: "/dashboard/faculty",
    [UserRole.Reviewer]: "/dashboard/review",
    [UserRole.Student]: "/dashboard/student",
    [UserRole.SuperAdmin]: "/dashboard/super-admin",
  };

  return paths[role] ?? "/dashboard";
}

export function issueAuthToken(input: {
  id: string;
  role: string;
  name: string;
  email: string;
  isEmailVerified: boolean;
}) {
  const now = Math.floor(Date.now() / 1_000);
  const payload: AuthTokenPayload = {
    sub: input.id,
    role: input.role as UserRole,
    name: input.name,
    email: input.email,
    isEmailVerified: input.isEmailVerified,
    iat: now,
    exp: now + TOKEN_TTL_SECONDS,
  };
  const header = { alg: "HS256", typ: "JWT" };
  const unsignedToken = `${base64UrlEncode(JSON.stringify(header))}.${base64UrlEncode(JSON.stringify(payload))}`;

  return {
    token: `${unsignedToken}.${sign(unsignedToken)}`,
    expiresAt: new Date(payload.exp * 1_000),
    payload,
  };
}

export function verifyAuthToken(token: string | undefined): AuthTokenPayload | null {
  if (!token) return null;

  const parts = token.split(".");
  if (parts.length !== 3) return null;

  const [encodedHeader, encodedPayload, signature] = parts;
  const unsignedToken = `${encodedHeader}.${encodedPayload}`;
  const expectedSignature = sign(unsignedToken);
  const signatureBuffer = Buffer.from(signature);
  const expectedSignatureBuffer = Buffer.from(expectedSignature);

  if (
    signatureBuffer.length !== expectedSignatureBuffer.length ||
    !crypto.timingSafeEqual(signatureBuffer, expectedSignatureBuffer)
  ) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8")) as AuthTokenPayload;

    if (!payload.exp || payload.exp * 1_000 < Date.now()) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}
