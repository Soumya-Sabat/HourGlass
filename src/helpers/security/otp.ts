import crypto from "crypto";

export function generateOtp() {
  return String(crypto.randomInt(0, 1_000_000)).padStart(6, "0");
}

export function hashOtp(otp: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(otp, salt, 64).toString("hex");

  return { hash, salt };
}

export function verifyOtp(otp: string, hash: string, salt: string) {
  const hashedInput = crypto.scryptSync(otp, salt, 64);
  const storedHash = Buffer.from(hash, "hex");

  return storedHash.length === hashedInput.length && crypto.timingSafeEqual(storedHash, hashedInput);
}
