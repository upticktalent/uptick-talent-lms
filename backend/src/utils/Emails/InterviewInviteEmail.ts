import { Resend } from 'resend';
import { env } from '../../config/dynamicEnv';

const resend = new Resend(env.RESEND_API_KEY);

export const sendInterviewInvitationEmail = async ({
  to,
  name,
}: {
  to: string;
  name: string;
}) => {
  if (!env.RESEND_API_KEY) {
    console.log('DEV MODE: Interview invitation →', to);
    return true;
  }

  const firstName = name.split(' ')[0];

  const { error } = await resend.emails.send({
    from: "Uptick Talent <no-reply@upticktalent.africa>",
    to,
    subject: "You're In! Schedule Your Uptick Talent Interview 🎉",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; background: #f8f9fb; margin: 0; padding: 20px; color: #1a1a1a; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.08); }
          .header { background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 60px 30px; text-align: center; color: white; }
          .header h1 { margin: 0; font-size: 36px; font-weight: 700; }
          .header p { margin: 12px 0 0; font-size: 20px; opacity: 0.95; }
          .content { padding: 50px 40px; line-height: 1.8; text-align: center; }
          .greeting { font-size: 26px; font-weight: 600; margin-bottom: 24px; color: #1e293b; }
          .highlight { background: #f0f4ff; padding: 30px; border-radius: 16px; margin: 32px 0; font-size: 17px; color: #1e40af; }
          .calendly-button { 
            display: inline-block; 
            background: #6366f1; 
            color: white; 
            padding: 20px 40px; 
            font-size: 20px; 
            font-weight: bold; 
            border-radius: 16px; 
            text-decoration: none; 
            margin: 32px 0; 
            box-shadow: 0 12px 30px rgba(99,102,241,0.4);
            transition: all 0.3s;
          }
          .calendly-button:hover { 
            background: #4f46e5; 
            transform: translateY(-4px); 
            box-shadow: 0 16px 40px rgba(99,102,241,0.5);
          }
          .footer { background: #f8f9fa; padding: 40px 30px; text-align: center; color: #64748b; font-size: 14px; }
          .footer a { color: #6366f1; text-decoration: none; font-weight: 500; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Uptick Talent</h1>
            <p>Congratulations — You're Moving Forward!</p>
          </div>

          <div class="content">
            <div class="greeting">Hey ${firstName}!</div>
            
            <p>We loved your assessment submission and we would love to meet you!</p>

            <div class="highlight">
              <strong>You're officially invited to interview for the Uptick Talent program.</strong>
            </div>

            <p>Pick a time that works best for you ${firstName}.</p>

            <a href="https://calendly.com/peacedejiweb/30min" 
               class="calendly-button" 
               target="_blank">
               Schedule My Interview
            </a>

            <p style="color:#64748b; margin-top: 32px;">
              Takes 30 minutes • No prep needed • Just be yourself
            </p>

            <p>Can't wait to speak with you!<br><strong>— The Uptick Talent Team</strong></p>
          </div>

          <div class="footer">
            <p>Need to reschedule? Just reply to this email.</p>
            <p><a href="mailto:hello@upticktalent.africa">hello@upticktalent.africa</a> • <a href="https://upticktalent.africa">upticktalent.africa</a></p>
          </div>
        </div>
      </body>
      </html>
    `,
  });

  if (error) {
    console.error('Failed to send interview invitation:', error);
    return false;
  }

  console.log('Interview invitation sent →', to);
  return true;
};