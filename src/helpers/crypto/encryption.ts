import crypto from "crypto";

export type EncryptedValue = {
  cipherText: string;
  iv: string;
  salt: string;
  tag: string;
};

const ALGORITHM = "aes-256-gcm";

function getSecret() {
  return process.env.ENCRYPTION_SECRET || process.env.NEXTAUTH_SECRET || "hourglass-local-development-secret";
}

function getKey(salt: Buffer) {
  return crypto.scryptSync(getSecret(), salt, 32);
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function createLookupHash(value: string, scope: string) {
  return crypto
    .createHmac("sha256", getSecret())
    .update(`${scope}:${value.trim().toLowerCase()}`)
    .digest("hex");
}

export function encryptValue(value: unknown): EncryptedValue {
  const salt = crypto.randomBytes(16);
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, getKey(salt), iv);
  const plainText = JSON.stringify(value);
  const cipherText = Buffer.concat([cipher.update(plainText, "utf8"), cipher.final()]);

  return {
    cipherText: cipherText.toString("base64"),
    iv: iv.toString("base64"),
    salt: salt.toString("base64"),
    tag: cipher.getAuthTag().toString("base64"),
  };
}

export function decryptValue<T>(value: EncryptedValue): T {
  const salt = Buffer.from(value.salt, "base64");
  const iv = Buffer.from(value.iv, "base64");
  const decipher = crypto.createDecipheriv(ALGORITHM, getKey(salt), iv);

  decipher.setAuthTag(Buffer.from(value.tag, "base64"));
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(value.cipherText, "base64")),
    decipher.final(),
  ]).toString("utf8");

  return JSON.parse(decrypted) as T;
}
