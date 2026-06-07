import { fail, ok, readValidatedJson } from "@/app/api/auth/_utils";
import { UserService } from "@/models/user/services/user.service";
import { emailSchema } from "@/models/user/validators/user.validator";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const input = await readValidatedJson(request, emailSchema);
    const result = await UserService.requestLoginOtp(input);

    return ok(result);
  } catch (error) {
    return fail(error);
  }
}
