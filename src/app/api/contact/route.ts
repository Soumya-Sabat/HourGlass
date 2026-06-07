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
        <body style="margin:0;padding:0;background:[linear-gradient(135deg,#e0ebff_0%,#e8e7ff_45%,#fae8ff_100%)];font-family:Arial,sans-serif;">
          <div style="max-width:600px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 8px 30px rgba(79,70,229,0.08);border:1px solid #e2e8f0;">
            
            <!-- Header: Match the exact 135deg angle gradient from image_d7ebe3.jpg with sharp dark branding text -->
            <div style="background:linear-gradient(135deg,#e0ebff 0%,#e8e7ff 45%,#fae8ff 100%);padding:32px;text-align:center;border-bottom:1px solid #e2e8f0;">
              <h1 style="margin:0;color:#0f172a;font-size:24px;font-weight:900;letter-spacing:-0.025em;">
                New Message Inquiry
              </h1>
              <p style="margin-top:8px;color:#475569;font-weight:500;font-size:14px;">
                Someone contacted you through your website
              </p>
            </div>

            <div style="padding:32px;">
              <h2 style="margin-top:0;color:#0f172a;font-size:18px;font-weight:800;letter-spacing:-0.025em;">
                Contact Information
              </h2>

              <table style="width:100%;border-collapse:collapse;margin-top:16px;">
                <tr>
                  <td style="padding:12px 0;font-weight:700;color:#64748b;font-size:13px;text-transform:uppercase;letter-spacing:0.05em;width:30%;">Name</td>
                  <td style="padding:12px 0;color:#0f172a;font-weight:600;">${safeName}</td>
                </tr>

                <tr>
                  <td style="padding:12px 0;font-weight:700;color:#64748b;font-size:13px;text-transform:uppercase;letter-spacing:0.05em;">Email</td>
                  <td style="padding:12px 0;color:#4f46e5;font-weight:600;">${safeEmail}</td>
                </tr>

                <tr>
                  <td style="padding:12px 0;font-weight:700;color:#64748b;font-size:13px;text-transform:uppercase;letter-spacing:0.05em;">Received</td>
                  <td style="padding:12px 0;color:#334155;font-weight:500;">
                    ${new Date().toLocaleString()}
                  </td>
                </tr>
              </table>

              <!-- Message Container: Sharp card block resting beautifully on top of the flow -->
              <div style="
                margin-top:28px;
                background:#f8fafc;
                border:1px solid #e2e8f0;
                border-left:4px solid #4f46e5;
                padding:20px;
                border-radius:12px;
              ">
                <h3 style="margin-top:0;margin-bottom:8px;color:#0f172a;font-size:14px;font-weight:800;text-transform:uppercase;letter-spacing:0.05em;">
                  Message
                </h3>

                <p style="
                  white-space:pre-wrap;
                  line-height:1.7;
                  color:#334155;
                  margin-bottom:0;
                  font-size:14px;
                  font-weight:500;
                ">
                  ${safeMessage}
                </p>
              </div>

              <!-- Action Button: Indigo implementation -->
              <div style="margin-top:32px;text-align:center;">
                <a
                  href="mailto:${safeEmail}"
                  style="
                    display:inline-block;
                    background:#4f46e5;
                    color:white;
                    text-decoration:none;
                    padding:14px 28px;
                    border-radius:12px;
                    font-weight:800;
                    font-size:14px;
                    box-shadow:0 4px 14px rgba(79,70,229,0.2);
                  "
                >
                  Reply to ${safeName}
                </a>
              </div>
            </div>

            <!-- Big & Dark grounded layout segment for footer styling -->
            <div style="
              padding:24px;
              background:#020617;
              text-align:center;
              color:#94a3b8;
              font-size:12px;
              font-weight:500;
              border-top:1px solid #0f172a;
            ">
              Generated automatically from your SchedulAI contact form.
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
