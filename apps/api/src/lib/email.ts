import { Resend } from 'resend';
import 'dotenv/config';

// Ensure RESEND_API_KEY is in your .env file
const resend = new Resend(process.env.RESEND_API_KEY);

interface SendLogEmailProps {
  to: string;
  clientName: string;
  vaName: string;
  summary: string;
  link: string;
}

export const sendLogEmail = async ({ to, clientName, vaName, summary, link }: SendLogEmailProps) => {
  if (!process.env.RESEND_API_KEY) {
    console.warn('⚠️ RESEND_API_KEY missing. Skipping email.');
    return;
  }

  try {
    await resend.emails.send({
      from: 'ZenPortal <updates@yourdomain.com>', // You need to verify domain in Resend
      to: [to],
      subject: `New Update from ${vaName} - ${new Date().toLocaleDateString()}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>Hi ${clientName},</h2>
          <p>${vaName} just logged new work:</p>
          <blockquote style="border-left: 4px solid #4F46E5; padding-left: 10px; color: #555;">
            ${summary}
          </blockquote>
          <a href="${link}" style="background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;">
            View Full Report & Video
          </a>
        </div>
      `,
    });
    console.log(`✅ Email sent to ${to}`);
  } catch (error) {
    console.error('❌ Failed to send email:', error);
  }
};