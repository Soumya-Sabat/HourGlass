import { NextRequest, NextResponse } from "next/server";
import { canRoleAccessRoute, UserRole } from "@/config/rbac";

const AUTH_COOKIE_NAME = "hourglass-token";
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

  // 1. Unauthenticated users trying to access dashboard paths get deflected to login
  if (isDashboardRoute && !payload) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (payload) {
    // 2. Route Check Guard: Intercept URL tampering if user attempts unauthorized directory jumping
    if (pathname.startsWith("/dashboard/")) {
      const parsedRole = payload.role as UserRole;
      const possessesAccessPrivilege = canRoleAccessRoute(parsedRole, pathname);

      if (!possessesAccessPrivilege) {
        // Drop them back straight to their home dashboard root console
        const dynamicBaseFallback = getDashboardPathForRole(payload.role);
        return NextResponse.redirect(new URL(dynamicBaseFallback, request.url));
      }
    }

    // 3. Authenticated user hitting absolute dashboard base root path `/dashboard`
    if (pathname === "/dashboard") {
      return NextResponse.redirect(new URL(getDashboardPathForRole(payload.role), request.url));
    }

    // 4. Authenticated user trying to visit sign-in/registration forms gets pushed inside
    if (isAuthRoute) {
      return NextResponse.redirect(new URL(getDashboardPathForRole(payload.role), request.url));
    }

    // 5. SECURITY ENHANCEMENT: Forward authenticated safe metadata via Request Headers downstream
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-role", payload.role);
    requestHeaders.set("x-user-name", encodeURIComponent(payload.name));

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  // Screens all sub-routes including messages, timetables, and user authentication points
  matcher: ["/dashboard/:path*", "/login", "/register", "/verify-email"],
};