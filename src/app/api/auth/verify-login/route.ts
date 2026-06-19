import { cookies } from "next/headers";
import { fail, ok, readValidatedJson } from "@/app/api/auth/_utils";
import { AUTH_COOKIE_NAME, getDashboardPathForRole, issueAuthToken } from "@/helpers/security/jwt";
import { UserService } from "@/models/user/services/user.service";
import { verifyEmailSchema } from "@/models/user/validators/user.validator";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const input = await readValidatedJson(request, verifyEmailSchema);
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

    return ok({
      message: "Login verified.",
      user,
      redirectTo: getDashboardPathForRole(user.role),
    });
  } catch (error) {
    return fail(error);
  }
}
