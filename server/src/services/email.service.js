import nodemailer from 'nodemailer';

let transporter;
let warnedAboutConfiguration = false;

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function relatedName(value) {
  if (!value) return 'Not specified';
  if (typeof value === 'string') return value;
  return value.name || value.title || 'Not specified';
}

export function emailNotificationsConfigured() {
  return Boolean(process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASSWORD && process.env.ADMIN_EMAIL);
}

function getTransporter() {
  if (!emailNotificationsConfigured()) return null;
  if (!transporter) {
    const port = Number(process.env.EMAIL_PORT) || 587;
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port,
      secure: process.env.EMAIL_SECURE === 'true' || port === 465,
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASSWORD },
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 15_000,
    });
  }
  return transporter;
}

export function buildLeadNotification(lead) {
  const name = `${lead.firstName || ''} ${lead.lastName || ''}`.trim() || 'Not provided';
  const date = lead.createdAt ? new Date(lead.createdAt) : new Date();
  const dashboardUrl = process.env.ADMIN_DASHBOARD_URL || `${process.env.CLIENT_URL || 'http://localhost:5173'}/admin/leads`;
  const fields = [
    ['Name', name],
    ['Email', lead.email || 'Not provided'],
    ['Phone', lead.phone || 'Not provided'],
    ['Interested service', relatedName(lead.interestedService)],
    ['Country', relatedName(lead.interestedCountry)],
    ['Message', lead.message || 'No message provided'],
    ['Date', date.toLocaleString('en-GB', { dateStyle: 'long', timeStyle: 'short', timeZone: process.env.EMAIL_TIMEZONE || 'Asia/Karachi' })],
  ];
  const rows = fields.map(([label, value]) => `<tr><th style="padding:12px 16px;text-align:left;vertical-align:top;color:#64748b;font-size:12px;text-transform:uppercase;letter-spacing:.06em;border-bottom:1px solid #e2e8f0">${escapeHtml(label)}</th><td style="padding:12px 16px;color:#0B1F3A;border-bottom:1px solid #e2e8f0">${escapeHtml(value)}</td></tr>`).join('');
  return {
    subject: 'New Immigration Lead Received - Nestway Immigration',
    text: `${fields.map(([label, value]) => `${label}: ${value}`).join('\n')}\n\nOpen lead in Nestway CRM: ${dashboardUrl}`,
    html: `<div style="margin:0;background:#f4f6f8;padding:32px 16px;font-family:Arial,sans-serif;color:#0B1F3A">
      <div style="max-width:680px;margin:auto;overflow:hidden;border:1px solid #e2e8f0;border-radius:18px;background:#fff;box-shadow:0 12px 30px rgba(11,31,58,.08)">
        <div style="background:#0B1F3A;padding:30px 32px">
          <p style="margin:0;color:#D4AF37;font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase">Nestway Immigration</p>
          <h1 style="margin:10px 0 0;color:#fff;font-size:26px;line-height:1.25">New Immigration Lead Received</h1>
          <p style="margin:10px 0 0;color:#cbd5e1;font-size:14px;line-height:1.6">A new website enquiry has been saved to the CRM and is ready for review.</p>
        </div>
        <div style="padding:26px 32px 10px"><p style="margin:0 0 12px;color:#64748b;font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase">Lead information</p></div>
        <table role="presentation" style="width:100%;border-collapse:collapse">${rows}</table>
        <div style="padding:28px 32px 32px">
          <a href="${escapeHtml(dashboardUrl)}" style="display:inline-block;border-radius:999px;background:#0B1F3A;padding:14px 22px;color:#fff;font-size:13px;font-weight:700;text-decoration:none">Open lead in admin dashboard</a>
          <p style="margin:20px 0 0;color:#64748b;font-size:12px;line-height:1.6">Please assign the enquiry and record the next follow-up action in the Nestway CRM.</p>
        </div>
      </div>
    </div>`,
  };
}

export async function sendNewLeadNotification(lead, customTransporter) {
  const activeTransporter = customTransporter || getTransporter();
  if (!activeTransporter) {
    if (!warnedAboutConfiguration) {
      console.warn('Lead email notifications are disabled: configure EMAIL_HOST, EMAIL_USER, EMAIL_PASSWORD and ADMIN_EMAIL');
      warnedAboutConfiguration = true;
    }
    return { sent: false, reason: 'not_configured' };
  }
  const message = buildLeadNotification(lead);
  const info = await activeTransporter.sendMail({
    from: process.env.EMAIL_FROM || `Nestway Immigration <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL,
    replyTo: lead.email,
    disableFileAccess: true,
    disableUrlAccess: true,
    ...message,
  });
  return { sent: true, messageId: info.messageId };
}
