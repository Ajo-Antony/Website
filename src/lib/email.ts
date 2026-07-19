import nodemailer from "nodemailer";
import QRCode from "qrcode";

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
  const isEnquiry = slot === "General enquiry";

  try {
    await transporter.sendMail({
      from: `"${FROM_NAME}" <${GMAIL_USER}>`,
      to: email,
      subject: isEnquiry ? "We got your message — StrixMind" : `You're booked — StrixMind demo, ${slot}`,
      html: `
        <div style="font-family: Inter, Arial, sans-serif; max-width: 480px; margin: 0 auto; color: #1a1333;">
          <div style="height: 4px; background: linear-gradient(90deg,#6c63ff,#a78bfa); border-radius: 4px; margin-bottom: 28px;"></div>
          <h2 style="font-size: 20px; margin-bottom: 8px;">${isEnquiry ? `Thanks for reaching out, ${escapeHtml(name)}! 👋` : `You're booked, ${escapeHtml(name)}! 🎉`}</h2>
          <p style="font-size: 14px; line-height: 1.6; color: #5b5478;">
            ${isEnquiry ? "We've received your message and our team in Kerala will get back to you within 2 business hours." : "Thanks for booking a StrixMind demo. Here are your details:"}
          </p>
          ${isEnquiry ? "" : `
          <table style="width: 100%; font-size: 14px; margin: 20px 0; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #8a84a8;">Time slot</td>
              <td style="padding: 8px 0; font-weight: 600;">${escapeHtml(slot)}</td>
            </tr>
          </table>`}
          <p style="font-size: 14px; line-height: 1.6; color: #5b5478;">
            ${isEnquiry ? "If it's urgent, just reply to this email and we'll pick it up directly." : "We'll be in touch shortly to confirm the meeting link. If you need to reschedule, just reply to this email."}
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
  const isEnquiry = slot === "General enquiry";

  try {
    await transporter.sendMail({
      from: `"${FROM_NAME}" <${GMAIL_USER}>`,
      to: NOTIFY_ADDRESS,
      subject: isEnquiry ? `New enquiry: ${name}` : `New booking: ${name} — ${slot}`,
      html: `
        <div style="font-family: Inter, Arial, sans-serif; font-size: 14px; color: #1a1333;">
          <p><strong>${escapeHtml(name)}</strong> (${escapeHtml(email)}) ${isEnquiry ? "just sent an enquiry via the contact form." : "just booked a demo."}</p>
          <ul>
            ${isEnquiry ? "" : `<li><strong>Slot:</strong> ${escapeHtml(slot)}</li>`}
            <li><strong>Company:</strong> ${escapeHtml(company || "—")}</li>
            <li><strong>Size:</strong> ${escapeHtml(size || "—")}</li>
            <li><strong>${isEnquiry ? "Message" : "Goal"}:</strong> ${escapeHtml(goal || "—")}</li>
          </ul>
        </div>
      `,
    });
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Failed to send notification." };
  }
}

export async function sendCertificateEmail(
  toEmail: string,
  studentName: string,
  courseName: string,
  certCode: string,
  verificationUrl: string
) {
  const transporter = getTransporter();
  if (!transporter) {
    return { ok: false, error: "GMAIL_USER / GMAIL_APP_PASSWORD are not configured." };
  }

  try {
    const qrBuffer = await QRCode.toBuffer(verificationUrl, {
      margin: 1,
      width: 250,
      color: {
        dark: "#003e8f",
        light: "#ffffff",
      },
    });

    await transporter.sendMail({
      from: `"${FROM_NAME}" <${GMAIL_USER}>`,
      to: toEmail,
      subject: `Your Internship Certificate — ${studentName} (${certCode})`,
      html: `
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #15140f; background-color: #fcfcf9; border: 1px solid #e5e5e0; border-radius: 16px;">
          <div style="height: 6px; background: linear-gradient(90deg, #003e8f, #00d4aa); border-radius: 6px; margin-bottom: 24px;"></div>
          
          <h2 style="font-size: 22px; font-weight: 800; color: #003e8f; margin-top: 0; margin-bottom: 8px;">Congratulations, ${escapeHtml(studentName)}! 🎉</h2>
          <p style="font-size: 15px; line-height: 1.6; color: #4b5563; margin-bottom: 20px;">
            We are pleased to share that your official certificate of internship completion for <strong>${escapeHtml(courseName)}</strong> is now available and verified.
          </p>

          <div style="background-color: #ffffff; border: 1px solid #e5e5e0; border-radius: 12px; padding: 20px; margin-bottom: 24px; text-align: center;">
            <p style="font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #4b5563; margin-top: 0; margin-bottom: 8px;">Verification Code</p>
            <code style="font-family: monospace; font-size: 18px; font-weight: bold; color: #003e8f; background-color: #f1f5f9; padding: 6px 12px; border-radius: 6px; border: 1px dashed #cbd5e1; display: inline-block;">
              ${escapeHtml(certCode)}
            </code>
            
            <div style="margin: 24px 0 16px 0;">
              <a href="${verificationUrl}" target="_blank" style="background-color: #003e8f; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 700; padding: 12px 24px; border-radius: 8px; display: inline-block;">
                Verify & View Certificate Online
              </a>
            </div>
            
            <p style="font-size: 13px; color: #6b7280; margin-bottom: 0;">
              You can also scan the QR code attached or displayed below to verify directly on your mobile device.
            </p>
          </div>

          <div style="text-align: center; margin-bottom: 24px;">
            <img src="cid:qr_code_image" alt="Verification QR Code" style="width: 150px; height: 150px; border: 1px solid #cbd5e1; padding: 4px; border-radius: 8px; background-color: #ffffff;" />
          </div>

          <p style="font-size: 14px; line-height: 1.6; color: #4b5563; margin-bottom: 24px;">
            This certificate is secure and permanently recorded. You can add this verification link to your LinkedIn profile, resume, or portfolio to share with potential employers.
          </p>

          <p style="font-size: 13px; color: #9ca3af; border-top: 1px solid #e5e5e0; padding-top: 16px; margin-top: 24px; margin-bottom: 0;">
            Best regards,<br/>
            <strong>The StrixMind Team</strong>
          </p>
        </div>
      `,
      attachments: [
        {
          filename: `verification_qr_${certCode}.png`,
          content: qrBuffer,
          cid: "qr_code_image",
        },
      ],
    });
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Failed to send certificate email." };
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
