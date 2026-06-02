import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  message?: unknown;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getContactPayload(payload: ContactPayload) {
  const name = clean(payload.name);
  const email = clean(payload.email).toLowerCase();
  const message = clean(payload.message);

  if (name.length < 4) {
    return { error: "Please enter your name." };
  }

  if (!emailPattern.test(email)) {
    return { error: "Please enter a valid email address." };
  }

  if (message.length < 10) {
    return { error: "Please include at least 10 characters in your message." };
  }

  return { data: { name, email, message } };
}

function getRequiredEnv(name: string) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing ${name}.`);
  }

  return value;
}

async function sendMail({
  name,
  email,
  message,
}: {
  name: string;
  email: string;
  message: string;
}) {
  const smtpHost = getRequiredEnv("SMTP_HOST");
  const smtpPort = Number(process.env.SMTP_PORT ?? 587);
  const smtpUser = getRequiredEnv("SMTP_USER");
  const smtpPass = getRequiredEnv("SMTP_PASS");
  const fromEmail = process.env.SMTP_FROM_EMAIL?.trim() ?? `CodeCluster <${smtpUser}>`;
  const toEmail = getRequiredEnv("CONTACT_TO_EMAIL");

  if (!Number.isInteger(smtpPort)) {
    throw new Error("SMTP_PORT must be a valid number.");
  }

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message);

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  await transporter.sendMail({
    from: fromEmail,
    to: toEmail,
    replyTo: email,
    subject: "HourGlass Query Contact",
    html: `
        <!DOCTYPE html>
        <html>
        <head>
        <meta charset="utf-8" />
        </head>
        <body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,sans-serif;">
          <div style="max-width:600px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 8px 30px rgba(0,0,0,0.08);">
            <div style="background:linear-gradient(135deg,#2563eb,#7c3aed);padding:32px;text-align:center;">
              <h1 style="margin:0;color:white;font-size:24px;">
                New Message Inquiry
              </h1>
              <p style="margin-top:8px;color:rgba(255,255,255,.85);">
                Someone contacted you through your website
              </p>
            </div>

            <div style="padding:32px;">
              <h2 style="margin-top:0;color:#18181b;">
                Contact Information
              </h2>

              <table style="width:100%;border-collapse:collapse;">
                <tr>
                  <td style="padding:12px 0;font-weight:bold;color:#52525b;">Name</td>
                  <td style="padding:12px 0;color:#18181b;">${safeName}</td>
                </tr>

                <tr>
                  <td style="padding:12px 0;font-weight:bold;color:#52525b;">Email</td>
                  <td style="padding:12px 0;color:#18181b;">${safeEmail}</td>
                </tr>

                <tr>
                  <td style="padding:12px 0;font-weight:bold;color:#52525b;">Received</td>
                  <td style="padding:12px 0;color:#18181b;">
                    ${new Date().toLocaleString()}
                  </td>
                </tr>
              </table>

              <div style="
                margin-top:24px;
                background:#f8fafc;
                border-left:4px solid #2563eb;
                padding:20px;
                border-radius:8px;
              ">

                <h3 style="color:#18181b;">
                  Message
                </h3>

                <p style="
                  white-space:pre-wrap;
                  line-height:1.7;
                  color:#3f3f46;
                  margin-bottom:0;
                ">
                  ${safeMessage}
                </p>
              </div>

              <div style="margin-top:30px;text-align:center;">
                <a
                  href="mailto:${safeEmail}"
                  style="
                    display:inline-block;
                    background:#2563eb;
                    color:white;
                    text-decoration:none;
                    padding:12px 24px;
                    border-radius:9999px;
                    font-weight:600;
                  "
                >
                  Reply to ${safeName}
                </a>
              </div>
            </div>

            <div style="
              padding:20px;
              background:#fafafa;
              text-align:center;
              color:#71717a;
              font-size:12px;
            ">
              Generated automatically from your CodeCluster contact form.
            </div>
          </div>
        </body>
        </html>
`,
  });
}

export async function POST(request: NextRequest) {
  let payload: ContactPayload;

  try {
    payload = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json(
      { message: "Request body must be valid JSON." },
      { status: 400 },
    );
  }

  const contact = getContactPayload(payload);

  if ("error" in contact) {
    return NextResponse.json({ message: contact.error }, { status: 400 });
  }

  try {
    await sendMail(contact.data);
    return NextResponse.json({ message: "Message sent. We will get back soon." });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "The email service could not send this message right now." },
      { status: 502 },
    );
  }
}
