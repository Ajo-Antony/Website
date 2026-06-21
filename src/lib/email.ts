import nodemailer from "nodemailer";

/**
 * Gmail SMTP setup using an App Password (not the normal Gmail password).
 * Generate one at: https://myaccount.google.com/apppasswords
 * (requires 2-Step Verification to be enabled on the Google account)
 *
 * Required env vars (set in Vercel → Project Settings → Environment Variables):
 *   GMAIL_USER          = the full Gmail address sending the email
 *   GMAIL_APP_PASSWORD  = the 16-character App Password (spaces are fine, stripped below)
 *
 * Optional:
 *   BOOKING_FROM_NAME        = display name on outgoing mail (default "StrixMind")
 *   TEAM_NOTIFICATION_EMAIL  = internal address to notify on each new booking
 */
const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD?.replace(/\s+/g, "");
const FROM_NAME = process.env.BOOKING_FROM_NAME || "StrixMind";
const NOTIFY_ADDRESS = process.env.TEAM_NOTIFICATION_EMAIL;

function getTransporter() {
  if (!GMAIL_USER || !GMAIL_APP_PASSWORD) return null;
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for port 465
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_APP_PASSWORD,
    },
  });
}

export interface BookingEmailDetails {
  name: string;
  email: string;
  slot: string;
  company?: string | null;
  size?: string | null;
  goal?: string | null;
}

/**
 * Sends the "you're booked" confirmation email to the person who booked.
 * Fails silently (returns ok:false) if GMAIL_USER/GMAIL_APP_PASSWORD aren't
 * configured — the booking itself still succeeds even if email isn't set up.
 */
export async function sendBookingConfirmationEmail(details: BookingEmailDetails) {
  const transporter = getTransporter();
  if (!transporter) {
    return { ok: false, error: "GMAIL_USER / GMAIL_APP_PASSWORD are not configured." };
  }

  const { name, email, slot } = details;

  try {
    await transporter.sendMail({
      from: `"${FROM_NAME}" <${GMAIL_USER}>`,
      to: email,
      subject: `You're booked — StrixMind demo, ${slot}`,
      html: `
        <div style="font-family: Inter, Arial, sans-serif; max-width: 480px; margin: 0 auto; color: #1a1333;">
          <div style="height: 4px; background: linear-gradient(90deg,#6c63ff,#a78bfa); border-radius: 4px; margin-bottom: 28px;"></div>
          <h2 style="font-size: 20px; margin-bottom: 8px;">You're booked, ${escapeHtml(name)}! 🎉</h2>
          <p style="font-size: 14px; line-height: 1.6; color: #5b5478;">
            Thanks for booking a StrixMind demo. Here are your details:
          </p>
          <table style="width: 100%; font-size: 14px; margin: 20px 0; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #8a84a8;">Time slot</td>
              <td style="padding: 8px 0; font-weight: 600;">${escapeHtml(slot)}</td>
            </tr>
          </table>
          <p style="font-size: 14px; line-height: 1.6; color: #5b5478;">
            We'll be in touch shortly to confirm the meeting link. If you need to reschedule,
            just reply to this email.
          </p>
          <p style="font-size: 13px; color: #a39ecf; margin-top: 32px;">— The StrixMind team</p>
        </div>
      `,
    });
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Failed to send email." };
  }
}

/**
 * Notifies the internal team that a new booking came in.
 * Only sends if TEAM_NOTIFICATION_EMAIL is configured.
 */
export async function sendBookingNotificationEmail(details: BookingEmailDetails) {
  const transporter = getTransporter();
  if (!transporter || !NOTIFY_ADDRESS) return { ok: false };

  const { name, email, slot, company, size, goal } = details;

  try {
    await transporter.sendMail({
      from: `"${FROM_NAME}" <${GMAIL_USER}>`,
      to: NOTIFY_ADDRESS,
      subject: `New booking: ${name} — ${slot}`,
      html: `
        <div style="font-family: Inter, Arial, sans-serif; font-size: 14px; color: #1a1333;">
          <p><strong>${escapeHtml(name)}</strong> (${escapeHtml(email)}) just booked a demo.</p>
          <ul>
            <li><strong>Slot:</strong> ${escapeHtml(slot)}</li>
            <li><strong>Company:</strong> ${escapeHtml(company || "—")}</li>
            <li><strong>Size:</strong> ${escapeHtml(size || "—")}</li>
            <li><strong>Goal:</strong> ${escapeHtml(goal || "—")}</li>
          </ul>
        </div>
      `,
    });
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Failed to send notification." };
  }
}

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
