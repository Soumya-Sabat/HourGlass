import { fail, ok, readValidatedJson } from "@/app/api/auth/_utils";
import { UserService } from "@/models/user/services/user.service";
import { resendOtpSchema } from "@/models/user/validators/user.validator";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const input = await readValidatedJson(request, resendOtpSchema);
    const result =
      input.purpose === "login"
        ? await UserService.resendLoginOtp(input)
        : await UserService.resendVerificationOtp(input);

    return ok(result);
  } catch (error) {
    return fail(error);
  }
}
