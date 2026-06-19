import { NextRequest, NextResponse } from "next/server";

const AUTH_COOKIE_NAME = "hourglass-token"
const AUTH_PAGES = new Set(["/login", "/register", "/verify-email"]);

type AuthTokenPayload = {
  sub: string;
  role: string;
  name: string;
  isEmailVerified: boolean;
  iat: number;
  exp: number;
};

function getDashboardPathForRole(role: string) {
  const paths: Record<string, string> = {
    institution_admin: "/dashboard/institution",
    department_admin: "/dashboard/department",
    department_head: "/dashboard/approvals",
    faculty: "/dashboard/faculty",
    reviewer: "/dashboard/review",
    student: "/dashboard/student",
    admin: "/dashboard/admin",
    super_admin: "/dashboard/super-admin",
  };

  return paths[role] ?? "/dashboard";
}

function getJwtSecret() {
  return process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || "hourglass-local-development-secret";
}

function decodeBase64Url(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=");

  return atob(padded);
}

async function sign(unsignedToken: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(getJwtSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(unsignedToken));

  return btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

async function verifyToken(token: string | undefined): Promise<AuthTokenPayload | null> {
  if (!token) return null;

  const [header, payload, signature] = token.split(".");
  if (!header || !payload || !signature) return null;

  const expectedSignature = await sign(`${header}.${payload}`);
  if (signature !== expectedSignature) return null;

  try {
    const parsed = JSON.parse(decodeBase64Url(payload)) as AuthTokenPayload;

    if (!parsed.exp || parsed.exp * 1_000 < Date.now()) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const payload = await verifyToken(request.cookies.get(AUTH_COOKIE_NAME)?.value);
  const isDashboardRoute = pathname === "/dashboard" || pathname.startsWith("/dashboard/");
  const isAuthRoute = AUTH_PAGES.has(pathname);

  if (isDashboardRoute && !payload) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (payload && pathname === "/dashboard") {
    return NextResponse.redirect(new URL(getDashboardPathForRole(payload.role), request.url));
  }

  if (payload && isAuthRoute) {
    return NextResponse.redirect(new URL(getDashboardPathForRole(payload.role), request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register", "/verify-email"],
};
