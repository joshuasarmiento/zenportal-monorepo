import { Resend } from 'resend';
import { config } from '../config.js';

const resend = new Resend(config.resend.apiKey);

const DEFAULT_SENDER = 'ZenPortal <support@zenportal.com.ph>';
const BRAND_COLOR = '#18181b'; // Zinc-950 for premium look
const LOGO_URL = `${config.app.frontendUrl}/logo.png`; // Assuming logo file exists, or use text

type SubscriptionAction = 'created' | 'updated' | 'deleted';

// Helper to sanitize inputs
const escapeHtml = (unsafe: string) => {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

/**
 * Standard Email Wrapper
 * Provides a professional SaaS-style responsive layout.
 */
const wrapEmail = (title: string, bodyContent: string, ctaLink?: string, ctaText?: string) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <title>${title}</title>
  <style>
    /* Reset & Basics */
    body { margin: 0; padding: 0; background-color: #f4f4f5; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; }
    table { border-collapse: collapse; width: 100%; }
    
    /* Layout */
    .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
    .content { background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
    .header { padding: 32px; text-align: center; border-bottom: 1px solid #f4f4f5; }
    .body { padding: 32px; color: #3f3f46; line-height: 1.6; font-size: 16px; }
    .footer { padding: 32px; text-align: center; color: #a1a1aa; font-size: 12px; }
    
    /* Typography */
    h1 { margin: 0; color: #18181b; font-size: 24px; font-weight: 700; letter-spacing: -0.5px; }
    h2 { margin-top: 0; color: #18181b; font-size: 20px; font-weight: 600; }
    p { margin: 0 0 16px 0; }
    strong { color: #18181b; font-weight: 600; }
    
    /* Elements */
    .btn { display: inline-block; background-color: ${BRAND_COLOR}; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; text-align: center; margin-top: 16px; transition: background-color 0.2s; }
    .btn:hover { background-color: #27272a; }
    .divider { margin: 24px 0; border: 0; border-top: 1px solid #e4e4e7; }
    .info-box { background: #f4f4f5; border-radius: 8px; padding: 16px; font-size: 14px; margin-bottom: 24px; color: #52525b; }
    
    /* Links */
    a { color: ${BRAND_COLOR}; text-decoration: underline; }
    .footer a { color: #a1a1aa; text-decoration: none; margin: 0 8px; }
    .footer a:hover { color: #71717a; }
  </style>
</head>
<body>
  <div class="container">
    <!-- Main Content Card -->
    <div class="content">
      <!-- Header / Logo -->
      <div class="header">
        <!-- Replace Text with Logo Image if available e.g. <img src="${LOGO_URL}" height="32" alt="ZenPortal" /> -->
        <span style="font-size: 20px; font-weight: 800; color: ${BRAND_COLOR}; letter-spacing: -1px;">ZenPortal</span>
      </div>
      
      <!-- Content Body -->
      <div class="body">
        ${bodyContent}
        
        ${ctaLink && ctaText ? `
          <div style="text-align: center; margin-top: 24px;">
            <a href="${ctaLink}" class="btn">${ctaText}</a>
          </div>
        ` : ''}
      </div>
    </div>
    
    <!-- Footer -->
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} ZenPortal. All rights reserved.</p>
      <p>
        <a href="${config.app.frontendUrl}/privacy">Privacy Policy</a> • 
        <a href="${config.app.frontendUrl}/support">Support</a>
      </p>
    </div>
  </div>
</body>
</html>
  `;
};

/**
 * Shared helper to send emails via Resend.
 * Handles API key checking and error logging.
 */
async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string | string[];
  subject: string;
  html: string;
}) {
  if (!config.resend.apiKey) {
    console.warn("⚠️ Resend API Key missing. Skipping email.");
    return;
  }

  try {
    const recipients = Array.isArray(to) ? to : [to];
    await resend.emails.send({
      from: DEFAULT_SENDER,
      to: recipients,
      subject,
      html,
    });
    console.log(`📧 Email sent to ${recipients.join(', ')} | Subject: ${subject}`);
  } catch (error) {
    console.error(`❌ Failed to send email to ${to}:`, error);
  }
}

// --- 1. SUBSCRIPTION NOTIFICATIONS ---
export async function sendSubscriptionEmail(
  toEmail: string,
  userName: string,
  action: SubscriptionAction,
  tier: string = 'Pro'
) {
  let subject = '';
  let content = '';

  switch (action) {
    case 'created':
      subject = `Welcome to ${tier}!`;
      content = `
        <h1>Welcome aboard, ${userName}! 🚀</h1>
        <p>Your subscription to <strong>${tier}</strong> is now active.</p>
        <p>You now have access to all premium features. We are excited to see what you build!</p>
      `;
      await sendEmail({
        to: toEmail,
        subject,
        html: wrapEmail(subject, content, `${config.app.frontendUrl}/dashboard`, "Go to Dashboard")
      });
      break;

    case 'updated':
      subject = 'Your Subscription has been Updated';
      content = `
        <h1>Hello ${userName},</h1>
        <p>Your subscription status has been updated to: <strong>${tier}</strong>.</p>
        <p>If you did not make this change, please contact support immediately.</p>
      `;
      await sendEmail({
        to: toEmail,
        subject,
        html: wrapEmail(subject, content, `${config.app.frontendUrl}/settings`, "Manage Billing")
      });
      break;

    case 'deleted':
      subject = 'Subscription Cancelled';
      content = `
        <h1>Goodbye for now, ${userName}</h1>
        <p>Your subscription has been cancelled. You will retain access until the end of your current billing period.</p>
        <p>We're sorry to see you go! You can resubscribe at any time.</p>
      `;
      await sendEmail({
        to: toEmail,
        subject,
        html: wrapEmail(subject, content, `${config.app.frontendUrl}/settings`, "Resubscribe")
      });
      break;
  }
}

// --- 2. WORK LOG NOTIFICATIONS ---
interface SendLogEmailProps {
  to: string;
  clientName: string;
  vaName: string;
  summary: string;
  link: string;
}

export const sendLogEmail = async ({ to, clientName, vaName, summary, link }: SendLogEmailProps) => {
  const safeSummary = escapeHtml(summary);
  const subject = `Update from ${vaName}`;
  const content = `
    <h2>Hi ${clientName},</h2>
    <p><strong>${vaName}</strong> just logged new work:</p>
    <div class="info-box">
      ${safeSummary}
    </div>
  `;

  await sendEmail({
    to,
    subject,
    html: wrapEmail(subject, content, link, "View Full Report")
  });
};

// --- 3. CLIENT VIEW NOTIFICATIONS ---
export const sendClientViewedEmail = async (userEmail: string, clientName: string) => {
  const subject = `👀 ${clientName} just viewed your report`;
  const content = `
    <h2>Heads up!</h2>
    <p><strong>${clientName}</strong> just opened their client portal using their magic link.</p>
    <p style="color: #52525b;">This is a good sign they are checking your progress.</p>
  `;

  await sendEmail({
    to: userEmail,
    subject,
    html: wrapEmail(subject, content)
  });
};

// --- 4. WEEKLY RECAP ---
export const sendWeeklyRecapEmail = async (userEmail: string, userName: string, totalHours: number, totalEarnings: number) => {
  const subject = `Weekly Recap: $${totalEarnings} Earned 💰`;
  const content = `
    <h2>Happy Sunday, ${userName}!</h2>
    <p>Here is how you performed this week:</p>
    <div class="info-box">
      <ul style="padding-left: 20px; margin: 0;">
          <li style="margin-bottom: 8px;"><strong>Hours Logged:</strong> ${totalHours} hrs</li>
          <li><strong>Est. Earnings:</strong> $${totalEarnings}</li>
      </ul>
    </div>
  `;

  await sendEmail({
    to: userEmail,
    subject,
    html: wrapEmail(subject, content, `${config.app.frontendUrl}/dashboard`, "View Dashboard")
  });
};

// --- 5. AUTH NOTIFICATIONS ---
export const sendAuthEmail = async (to: string, subject: string, html: string) => {
  // If the incoming html is simple text/paragraphs, wrap it
  // If it's a code block (like OTP), we might want to style it

  // Simple heuristic: if it contains <h1> or <html>, assume custom structure.
  // Otherwise wrap it.

  let content = html;

  // Basic content enhancement for Auth emails
  content = content.replace(/<strong>(.*?)<\/strong>/g, '<strong style="font-size: 24px; letter-spacing: 5px; color: #18181b;">$1</strong>');

  await sendEmail({
    to,
    subject,
    html: wrapEmail(subject, content)
  });
};