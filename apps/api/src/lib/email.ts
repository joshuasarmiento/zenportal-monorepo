import { Resend } from 'resend';
import 'dotenv/config';

const resend = new Resend(process.env.RESEND_API_KEY);

const escapeHtml = (unsafe: string) => {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

// 1. Existing: Notify Client of New Work
interface SendLogEmailProps {
  to: string;
  clientName: string;
  vaName: string;
  summary: string;
  link: string;
}

export const sendLogEmail = async ({ to, clientName, vaName, summary, link }: SendLogEmailProps) => {
  if (!process.env.RESEND_API_KEY) return;

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

// 2. New: Notify User when Client Views Report
export const sendClientViewedEmail = async (userEmail: string, clientName: string) => {
  if (!process.env.RESEND_API_KEY) return;

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

// 3. New: Weekly Recap Email
export const sendWeeklyRecapEmail = async (userEmail: string, userName: string, totalHours: number, totalEarnings: number) => {
  if (!process.env.RESEND_API_KEY) return;

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
        <a href="${process.env.FRONTEND_URL}/dashboard" style="color: #4F46E5;">Go to Dashboard</a>
      </div>
    `
  });
};