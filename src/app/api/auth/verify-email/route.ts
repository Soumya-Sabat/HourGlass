import { fail, ok, readValidatedJson } from "@/app/api/auth/_utils";
import { UserService } from "@/models/user/services/user.service";
import { verifyEmailSchema } from "@/models/user/validators/user.validator";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const input = await readValidatedJson(request, verifyEmailSchema);
    const result = await UserService.verifyEmail(input);

    return ok(result);
  } catch (error) {
    return fail(error);
  }
}
