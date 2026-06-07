import { fail, ok, readValidatedJson } from "@/app/api/auth/_utils";
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

    // Session-based auth scaffold for later DB/session wiring:
    // cookies().set("hourglass-session", signedSessionToken, {
    //   httpOnly: true,
    //   sameSite: "lax",
    //   secure: process.env.NODE_ENV === "production",
    // });

    return ok({ message: "Login verified.", user });
  } catch (error) {
    return fail(error);
  }
}
