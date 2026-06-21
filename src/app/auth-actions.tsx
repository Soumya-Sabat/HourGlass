// this is created since the auth.ts completely wraps up the server side and do not allow for the client side rendering since it is in the src folder, so this file will handle the signOut section for the client side 
"use server";

import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME } from "@/helpers/security/jwt";

export async function handleSignOut() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
}