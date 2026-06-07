import nodemailer from "nodemailer";

type SendOtpEmailInput = {
  to: string;
  otp: string;
  purpose: "email-verification" | "login";
};

export async function sendOtpEmail({ to, otp, purpose }: SendOtpEmailInput) {
  const smtpHost = process.env.SMTP_HOST?.trim();
  const smtpUser = process.env.SMTP_USER?.trim();
  const smtpPass = process.env.SMTP_PASS?.trim();

  if (!smtpHost || !smtpUser || !smtpPass) {
    console.warn("SMTP is not configured; OTP was generated but not sent.");
    return { sent: false };
  }

  const smtpPort = Number(process.env.SMTP_PORT ?? 587);
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
    from: process.env.SMTP_FROM_EMAIL?.trim() ?? `HourGlass <${smtpUser}>`,
    to,
    subject: purpose === "login" ? "Your HourGlass login OTP" : "Verify your HourGlass email",
    text: `Your HourGlass OTP is ${otp}. It expires in 10 minutes.`,
  });

  return { sent: true };
}
