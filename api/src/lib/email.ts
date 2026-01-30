import { Resend } from 'resend';
import { config } from '../config';

const resend = new Resend(config.resend.apiKey);

const DEFAULT_SENDER = 'ZenPortal <support@zenportal.com.ph>';

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
  let html = '';

  switch (action) {
    case 'created':
      subject = `Welcome to ${tier}!`;
      html = `
        <div style="font-family: sans-serif; padding: 20px;">
          <h1>Welcome aboard, ${userName}!</h1>
          <p>Your subscription to <strong>${tier}</strong> is now active.</p>
          <p>You now have access to all premium features. We are excited to see what you build!</p>
          <p>Best,<br/>The Team</p>
        </div>
      `;
      break;

    case 'updated':
      subject = 'Your Subscription has been Updated';
      html = `
        <div style="font-family: sans-serif; padding: 20px;">
          <h1>Hello ${userName},</h1>
          <p>Your subscription status has been updated to: <strong>${tier}</strong>.</p>
          <p>If you did not make this change, please contact support immediately.</p>
          <a href="${config.app.frontendUrl}/settings" style="color: #4F46E5;">Manage Billing</a>
        </div>
      `;
      break;

    case 'deleted':
      subject = 'Subscription Cancelled';
      html = `
        <div style="font-family: sans-serif; padding: 20px;">
          <h1>Goodbye for now, ${userName}</h1>
          <p>Your subscription has been cancelled. You will retain access until the end of your current billing period.</p>
          <p>We're sorry to see you go! You can resubscribe at any time.</p>
          <a href="${config.app.frontendUrl}/settings" style="color: #4F46E5;">Resubscribe</a>
        </div>
      `;
      break;
  }

  await sendEmail({ to: toEmail, subject, html });
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
  const subject = `New Update from ${vaName} - ${new Date().toLocaleDateString()}`;
  const html = `
    <div style="font-family: sans-serif; padding: 20px;">
      <h2>Hi ${clientName},</h2>
      <p>${vaName} just logged new work:</p>
      <blockquote style="border-left: 4px solid #4F46E5; padding-left: 10px; color: #555;">
        ${safeSummary}
      </blockquote>
      <a href="${link}" style="background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;">
        View Full Report
      </a>
    </div>
  `;

  await sendEmail({ to, subject, html });
};

// --- 3. CLIENT VIEW NOTIFICATIONS ---
export const sendClientViewedEmail = async (userEmail: string, clientName: string) => {
  const subject = `👀 ${clientName} just viewed your report`;
  const html = `
    <div style="font-family: sans-serif; padding: 20px;">
      <h2>Heads up!</h2>
      <p><strong>${clientName}</strong> just opened their client portal using their magic link.</p>
      <p style="color: #666; font-size: 14px;">This is a good sign they are checking your progress.</p>
    </div>
  `;

  await sendEmail({ to: userEmail, subject, html });
};

// --- 4. WEEKLY RECAP ---
export const sendWeeklyRecapEmail = async (userEmail: string, userName: string, totalHours: number, totalEarnings: number) => {
  const subject = `Weekly Recap: $${totalEarnings} Earned 💰`;
  const html = `
    <div style="font-family: sans-serif; padding: 20px;">
      <h2>Happy Sunday, ${userName}!</h2>
      <p>Here is how you performed this week:</p>
      <ul>
          <li><strong>Hours Logged:</strong> ${totalHours} hrs</li>
          <li><strong>Est. Earnings:</strong> $${totalEarnings}</li>
      </ul>
      <a href="${config.app.frontendUrl}/dashboard" style="color: #4F46E5;">Go to Dashboard</a>
    </div>
  `;

  await sendEmail({ to: userEmail, subject, html });
};

// --- 5. AUTH NOTIFICATIONS ---
export const sendAuthEmail = async (to: string, subject: string, html: string) => {
  await sendEmail({ to, subject, html });
};