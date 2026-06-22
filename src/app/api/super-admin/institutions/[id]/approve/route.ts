import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongoose";
import { InstitutionModel } from "@/models/institution/schemas/institution.schema";
import { UserModel } from "@/models/user/schemas/user.schema";
import { decryptValue, type EncryptedValue } from "@/helpers/crypto/encryption";
import nodemailer from "nodemailer";
export const runtime = "nodejs";

function abbreviate(name: string): string {
  const words = name.split(/[\s,.\-&()/]+/).filter(Boolean);
  const letters: string[] = [];
  const skip = new Set(["of", "the", "and", "for", "in", "at", "by", "a", "an"]);
  for (const w of words) {
    const c = w.replace(/[^A-Za-z0-9]/g, "");
    if (!c) continue;
    if (letters.length && skip.has(c.toLowerCase())) continue;
    letters.push(c[0].toUpperCase());
    if (letters.length >= 2) break;
  }
  if (letters.length < 2 && words.length) {
    const first = words[0].replace(/[^A-Za-z0-9]/g, "").toUpperCase();
    for (const ch of first) { if (letters.length < 2) letters.push(ch); }
  }
  while (letters.length < 2) letters.push("X");
  return letters.join("");
}

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectToDatabase();

    const doc = await InstitutionModel.findById(id).lean();
    if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const d = doc as Record<string, unknown>;

    function dec<T>(val: EncryptedValue | undefined, fallback: T): T {
      if (!val) return fallback;
      try { return decryptValue<T>(val); } catch { return fallback; }
    }

    const name = dec<string>(d.name as EncryptedValue, "Unknown");
    const contactEmail = dec<string>(d.contactEmail as EncryptedValue, "");
    const shortYear = String(new Date().getFullYear()).slice(-2);
    const code = `INST${shortYear}${abbreviate(name)}`;

    await InstitutionModel.updateOne(
      { _id: id },
      { $set: { institutionId: code, isVerified: true, verifiedAt: new Date() } },
    );

    // Update the institution admin user's institutionId so they can access their dashboard
    const ownerUserId = d.ownerUserId;
    if (ownerUserId) {
      await UserModel.updateOne(
        { _id: ownerUserId },
        { $set: { institutionId: code } },
      );
    }

    const smtpHost = process.env.SMTP_HOST?.trim();
    const smtpUser = process.env.SMTP_USER?.trim();
    const smtpPass = process.env.SMTP_PASS?.trim();

    let emailSent = false;
    if (smtpHost && smtpUser && smtpPass && contactEmail) {
      try {
        const smtpPort = Number(process.env.SMTP_PORT ?? 587);
        const fromEmail = process.env.SMTP_FROM_EMAIL?.trim() ?? `HourGlass <${smtpUser}>`;
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: smtpPort === 465,
          auth: { user: smtpUser, pass: smtpPass },
        });
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
        const loginUrl = `${baseUrl}/login?email=${encodeURIComponent(contactEmail)}`;

        await transporter.sendMail({
          from: fromEmail,
          to: contactEmail,
          subject: `Institution Registration Approved — ${name}`,
          html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="margin:0;padding:0;font-family:Arial,sans-serif;">
<div style="max-width:560px;margin:40px auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;">
<div style="background:#1a1a14;padding:28px;text-align:center;">
<h1 style="margin:0;color:#f4ebd0;font-size:22px;font-weight:900;">Registration Approved</h1>
</div>
<div style="padding:32px;">
<p style="font-size:15px;color:#0f172a;font-weight:600;">Hello,</p>
<p style="font-size:14px;color:#334155;line-height:1.6;">
Your institution <strong>${name}</strong> has been approved by the HourGlass Super Admin.
</p>
<div style="background:#f4ebd0;border:2px solid #1a1a14;padding:20px;margin:20px 0;text-align:center;">
<p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:#1a1a14;margin:0 0 8px;">
Your Institution Code
</p>
<p style="font-size:32px;font-weight:900;color:#1a1a14;margin:0;letter-spacing:2px;">${code}</p>
</div>
<p style="font-size:14px;color:#334155;line-height:1.6;">
Use this code to register users under your institution.
</p>
<div style="margin:24px 0;text-align:center;">
<a href="${loginUrl}" style="display:inline-block;background:#1a1a14;color:#f4ebd0;padding:14px 32px;font-size:14px;font-weight:900;text-decoration:none;border-radius:6px;">
Login to Your Dashboard
</a>
</div>
<p style="font-size:13px;color:#64748b;line-height:1.5;">
Or copy this link into your browser:<br>
<a href="${loginUrl}" style="color:#1a1a14;">${loginUrl}</a>
</p>
<p style="font-size:14px;color:#334155;line-height:1.6;margin-top:16px;">
Regards,<br><strong>HourGlass Team</strong>
</p>
</div>
</div>
</body>
</html>`,
        });
        emailSent = true;
      } catch (e) {
        console.error("Approval email failed:", e);
      }
    }

    return NextResponse.json({ message: "Approved", institutionId: code, emailSent });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
