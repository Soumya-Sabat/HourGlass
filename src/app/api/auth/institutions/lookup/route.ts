import { z } from "zod";
import { fail, ok, readValidatedJson } from "@/app/api/auth/_utils";
import { UserService } from "@/models/user/services/user.service";

export const runtime = "nodejs";

const lookupSchema = z.object({
  institutionId: z.string().trim().min(3).max(20),
});

export async function POST(request: Request) {
  try {
    const input = await readValidatedJson(request, lookupSchema);
    const result = await UserService.lookupInstitution(input.institutionId);

    return ok(result);
  } catch (error) {
    return fail(error);
  }
}
