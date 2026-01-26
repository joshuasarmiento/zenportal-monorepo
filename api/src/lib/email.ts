import { Resend } from 'resend';
import { config } from '../config';

const resend = new Resend(config.resend.apiKey);

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

// --- 1. SUBSCRIPTION NOTIFICATIONS (New) ---
export async function sendSubscriptionEmail(
  toEmail: string, 
  userName: string, 
  action: SubscriptionAction,
  tier: string = 'Pro'
) {
  if (!config.resend.apiKey) return;

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

  try {
    await resend.emails.send({
      from: 'ZenPortal <androekolokoy@gmail.com>', // UPDATED: Matches your verified sender
      to: toEmail,
      subject: subject,
      html: html,
    });
    console.log(`📧 Email sent to ${toEmail} for action: ${action}`);
  } catch (error) {
    console.error(`❌ Failed to send email:`, error);
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
  if (!config.resend.apiKey) return;

  const safeSummary = escapeHtml(summary);

  await resend.emails.send({
    from: 'ZenPortal <androekolokoy@gmail.com>',
    to: [to],
    subject: `New Update from ${vaName} - ${new Date().toLocaleDateString()}`,
    html: `
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
    `,
  });
};

// --- 3. CLIENT VIEW NOTIFICATIONS ---
export const sendClientViewedEmail = async (userEmail: string, clientName: string) => {
  if (!config.resend.apiKey) return;

  await resend.emails.send({
    from: 'ZenPortal <androekolokoy@gmail.com>',
    to: [userEmail],
    subject: `👀 ${clientName} just viewed your report`,
    html: `
      <div style="font-family: sans-serif; padding: 20px;">
        <h2>Heads up!</h2>
        <p><strong>${clientName}</strong> just opened their client portal using their magic link.</p>
        <p style="color: #666; font-size: 14px;">This is a good sign they are checking your progress.</p>
      </div>
    `
  });
};

// --- 4. WEEKLY RECAP ---
export const sendWeeklyRecapEmail = async (userEmail: string, userName: string, totalHours: number, totalEarnings: number) => {
  if (!config.resend.apiKey) return;

  await resend.emails.send({
    from: 'ZenPortal <androekolokoy@gmail.com>',
    to: [userEmail],
    subject: `Weekly Recap: $${totalEarnings} Earned 💰`,
    html: `
      <div style="font-family: sans-serif; padding: 20px;">
        <h2>Happy Sunday, ${userName}!</h2>
        <p>Here is how you performed this week:</p>
        <ul>
            <li><strong>Hours Logged:</strong> ${totalHours} hrs</li>
            <li><strong>Est. Earnings:</strong> $${totalEarnings}</li>
        </ul>
        <a href="${config.app.frontendUrl}/dashboard" style="color: #4F46E5;">Go to Dashboard</a>
      </div>
    `
  });
};