import { Resend } from 'resend';
import { env } from '../../config/dynamicEnv';

const resend = new Resend(env.RESEND_API_KEY);

interface SendInterviewInvitationParams {
  to: string;
  name: string;
  date: Date | string;
  notes?: string;
  googleMeet: string;
}

export const sendInterviewInvitationEmail = async ({
  to,
  name,
  date,
  notes,
  googleMeet
}: SendInterviewInvitationParams): Promise<boolean> => {
  if (!env.RESEND_API_KEY) {
    console.log('DEV MODE: Interview invitation →', to, new Date(date).toLocaleString());
    return true;
  }

  const interviewDate = new Date(date);
  const formattedDate = interviewDate.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  });

  const { error } = await resend.emails.send({
    from:"Uptick Talent <no-reply@upticktalent.africa>",
    to,
    subject: 'Your Uptick Talent Interview is Scheduled! 🎉',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; background: #f9f9fb; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.08); }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 30px; text-align: center; }
          .content { padding: 40px 30px; color: #333; line-height: 1.7; }
          .date-box { background: #e8f5e8; padding: 25px; border-radius: 12px; text-align: center; font-size: 20px; font-weight: bold; color: #2e7d32; margin: 30px 0; }
          .notes { background: #fff8e1; padding: 25px; border-radius: 10px; border-left: 5px solid #ff8f00; margin: 30px 0; white-space: pre-wrap; }
          .footer { background: #f8f9fa; padding: 30px; text-align: center; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Uptick Talent</h1>
            <p style="font-size: 20px; margin: 10px 0 0;">Interview Invitation</p>
          </div>

          <div class="content">
            <h2>Hi ${name.split(' ')[0]},</h2>
            <p><strong>Congratulations!</strong> You’ve been selected for an interview.</p>
            <p>We were really impressed with your assessment and want to meet you!</p>

            <div class="date-box">
              Your Interview<br/>
              ${formattedDate}
            </div>
            
            <div style="margin: 20px 0; padding: 20px; background: #e3f2fd; border-radius: 10px;">
              <strong>Google Meet Link:</strong><br/>
              <a href="${googleMeet}" style="color: #1a73e8;">${googleMeet}</a>
            </div>

            ${notes ? `
              <div class="notes">
                <strong>Important Notes:</strong><br/><br/>
                ${notes.replace(/\n/g, '<br>')}
              </div>
            ` : ''}

            <p>We’re excited to speak with you!</p>
            <p>If you need to reschedule, just reply to this email.</p>
          </div>

          <div class="footer">
            <p>— The Uptick Talent Team</p>
          </div>
        </div>
      </body>
      </html>
    `,
  });

  if (error) {
    console.error('Failed to send interview email:', error);
    return false;
  }

  console.log('Interview invitation sent →', to);
  return true;
};