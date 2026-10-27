import nodemailer from "nodemailer";
import { getSiteSettings } from "./settings";

export interface SendInquiryEmailPayload {
  name: string;
  email: string;
  phone: string;
  company?: string;
  quantity?: string;
  subject: string;
  message: string;
  productName?: string;
  productSku?: string;
  brandName?: string;
  categoryName?: string;
  source?: string;
}

export async function sendInquiryEmail(payload: SendInquiryEmailPayload): Promise<{
  sent: boolean;
  error?: string;
  recipient: string;
}> {
  const settings = await getSiteSettings();
  const recipient = settings.adminEmail || "sales@mustansirenterprises.com";

  const smtpHost = settings.smtpHost || process.env.SMTP_HOST || "smtp.gmail.com";
  const smtpPort = Number(settings.smtpPort || process.env.SMTP_PORT || 465);
  const smtpUser = settings.smtpUser || process.env.SMTP_USER || "";
  const smtpPass = settings.smtpPass || process.env.SMTP_PASS || "";
  const fromName = settings.smtpFromName || settings.companyName || "Mustansir Enterprises";

  if (!smtpUser || !smtpPass) {
    return {
      sent: false,
      recipient,
      error:
        "Inquiry logged in database. (Gmail SMTP credentials not yet added in Admin -> Site Settings; once configured, emails dispatch via Gmail SMTP automatically.)",
    };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const htmlBody = `
      <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 640px; margin: 0 auto; border: 1px solid #cbd5e1; border-radius: 8px; overflow: hidden;">
        <div style="background: #0f172a; color: #ffffff; padding: 20px 24px; border-bottom: 4px solid #ea580c;">
          <div style="font-size: 11px; color: #38bdf8; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700;">
            ${settings.companyName} • Technical Inquiry Desk
          </div>
          <h2 style="margin: 6px 0 0; font-size: 20px;">${payload.subject}</h2>
        </div>
        <div style="padding: 24px; background: #ffffff; color: #0f172a;">
          ${
            payload.productName
              ? `
          <div style="background: #f0f9ff; border-left: 4px solid #0284c7; padding: 14px 16px; margin-bottom: 20px; border-radius: 4px;">
            <div style="font-size: 11px; font-weight: 700; color: #0284c7; text-transform: uppercase;">Prefilled Product Reference</div>
            <div style="font-size: 16px; font-weight: 700; margin-top: 4px;">${payload.productName}</div>
            <div style="font-size: 13px; color: #334155; margin-top: 4px;">
              <strong>SKU:</strong> ${payload.productSku || "N/A"} &nbsp;|&nbsp;
              <strong>Brand:</strong> ${payload.brandName || "N/A"} &nbsp;|&nbsp;
              <strong>Category:</strong> ${payload.categoryName || "N/A"}
            </div>
          </div>`
              : ""
          }
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
            <tr>
              <td style="padding: 8px 12px; border: 1px solid #e2e8f0; background: #f8fafc; font-weight: 600; width: 35%;">Customer Name</td>
              <td style="padding: 8px 12px; border: 1px solid #e2e8f0;">${payload.name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; border: 1px solid #e2e8f0; background: #f8fafc; font-weight: 600;">Email Address</td>
              <td style="padding: 8px 12px; border: 1px solid #e2e8f0;"><a href="mailto:${payload.email}">${payload.email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; border: 1px solid #e2e8f0; background: #f8fafc; font-weight: 600;">Phone / Mobile</td>
              <td style="padding: 8px 12px; border: 1px solid #e2e8f0;">${payload.phone}</td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; border: 1px solid #e2e8f0; background: #f8fafc; font-weight: 600;">Company / Firm</td>
              <td style="padding: 8px 12px; border: 1px solid #e2e8f0;">${payload.company || "Not specified"}</td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; border: 1px solid #e2e8f0; background: #f8fafc; font-weight: 600;">Required Quantity / Specs</td>
              <td style="padding: 8px 12px; border: 1px solid #e2e8f0;">${payload.quantity || "Standard"}</td>
            </tr>
          </table>
          <div style="font-size: 13px; font-weight: 700; text-transform: uppercase; color: #475569; margin-bottom: 6px;">Inquiry Details</div>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 14px; white-space: pre-wrap; font-size: 14px; line-height: 1.6;">${payload.message}</div>
        </div>
        <div style="background: #f1f5f9; padding: 12px 24px; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0;">
          Sent via ${settings.companyName} Portal (${payload.source || "Website Inquiry"}) • Receiver: ${recipient}
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"${fromName}" <${smtpUser}>`,
      to: recipient,
      replyTo: payload.email,
      subject: payload.subject,
      html: htmlBody,
    });

    return {
      sent: true,
      recipient,
    };
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : "Failed to send SMTP email";
    return {
      sent: false,
      recipient,
      error: errMsg,
    };
  }
}
