// src/utils/email/assessmentEmail.ts
import { Resend } from 'resend';
import { env } from "../../config/dynamicEnv";

const resend = new Resend(env.RESEND_API_KEY);

interface SendAssessmentEmailParams {
  to: string;
  name: string;
  track: string;
  assessmentLink: string;
  // githubUrl: string,
  dueDate?: string;
  instructions?: string;
}

export const sendAssessmentEmail = async ({
  to,
  name,
  track,
  assessmentLink,
  dueDate,
  instructions,
}: SendAssessmentEmailParams): Promise<boolean> => {
  // Safety check (same as your other emails)
  if (!env.RESEND_API_KEY) {
    console.log('RESEND not configured – simulating assessment email to:', to);
    console.log('Link:', assessmentLink);
    return true;
  }

  const formattedDueDate = dueDate
    ? new Date(dueDate).toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        timeZoneName: 'short',
      })
    : null;

  const { error } = await resend.emails.send({
    from:"Uptick Talent <no-reply@upticktalent.africa>",
    to,
    subject: `Your Uptick Talent ${track} Assessment Task`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; background: #f8f9fa; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 30px; text-align: center; }
          .header h1 { margin: 0; font-size: 28px; }
          .content { padding: 40px 30px; color: #333; line-height: 1.7; }
          .highlight { background: #f0f4ff; padding: 20px; border-radius: 10px; border-left: 4px solid #667eea; margin: 25px 0; }
          .link-box { background: #e8f4fd; padding: 18px; border-radius: 8px; text-align: center; font-size: 16px; margin: 25px 0; }
          .link-box a { color: #1a73e8; font-weight: bold; text-decoration: none; word-break: break-all; }
          .due-date { background: #fff8e1; padding: 12px 18px; border-radius: 8px; display: inline-block; font-weight: bold; color: #ff8f00; }
          .footer { background: #f8f9fa; padding: 30px; text-align: center; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Uptick Talent</h1>
            <p style="font-size: 18px; margin: 10px 0 0;">Assessment Task</p>
          </div>
          
          <div class="content">
            <h2>Hello ${name.split(' ')[0]},</h2>
            <p>Congratulations! You're one step closer to joining Uptick Talent.</p>
            
            <p>You've been shortlisted for the <strong>${track}</strong> track. Please complete the assessment task below:</p>

            ${instructions ? `<div class="highlight"><p><strong>Instructions:</strong></p><p>${instructions.replace(/\n/g, '<br>')}</p></div>` : ''}

            <p><strong>Submission Link:</strong></p>
            <div class="link-box">
              <a href="${assessmentLink}" target="_blank">${assessmentLink}</a>
            </div>

            ${formattedDueDate ? `<p>Due Date: <span class="due-date">${formattedDueDate}</span></p>` : ''}

            <p>We can't wait to see what you build!</p>
            <p>Good luck! You've got this!</p>
          </div>
          
          <div class="footer">
            <p>— The Uptick Talent Team</p>
            <p><small>This is an automated message. Please do not reply.</small></p>
          </div>
        </div>
      </body>
      </html>
    `,
  });

  if (error) {
    console.error('Failed to send assessment email to', to, error);
    return false;
  }

  console.log('Assessment email sent successfully to:', to);
  return true;
};