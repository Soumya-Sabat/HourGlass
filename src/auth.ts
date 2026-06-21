import { cookies } from "next/headers";
import {
  AUTH_COOKIE_NAME,
  getDashboardPathForRole,
  issueAuthToken,
  verifyAuthToken,
  type AuthTokenPayload,
} from "@/helpers/security/jwt";
import { UserService } from "@/models/user/services/user.service";
import type { LoginDto } from "@/models/user/dto/login.dto";
import type { VerifyEmailDto } from "@/models/user/dto/verify-email.dto";

export async function requestLoginOtp(input: LoginDto) {
  return UserService.requestLoginOtp(input);
}

export async function verifyLoginOtp(input: VerifyEmailDto) {
  const user = await UserService.authorizeOtpSignIn(input);

  if (!user) {
    throw new Error("Invalid or expired OTP. Request a fresh code and try again.");
  }

  const { token, expiresAt } = issueAuthToken(user);
  const cookieStore = await cookies();

  cookieStore.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });

  return {
    message: "Login verified.",
    user,
    redirectTo: getDashboardPathForRole(user.role),
  };
}

export async function getCurrentUser(): Promise<AuthTokenPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  return verifyAuthToken(token);
}

// export async function signOut() {
//   const cookieStore = await cookies();
  
//   cookieStore.delete(AUTH_COOKIE_NAME);
// }