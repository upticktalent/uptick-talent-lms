import { Resend } from 'resend';
import { env } from '../../config/dynamicEnv';

const resend = new Resend(env.RESEND_API_KEY);

export const sendAssessmentFailedEmail = async (to: string, name: string, feedback?: string) => {
  if (!env.RESEND_API_KEY) {
    console.log('RESEND not configured – simulating assessment email to:', to);
    return true;
  }

  const { error } = await resend.emails.send({
    from: "Uptick Talent <no-reply@upticktalent.africa>",
    to,
    subject: 'Thank You for Your Assessment Submission',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #333;">Hi ${name.split(' ')[0]},</h2>
        <p>Thank you for submitting your assessment and for your interest in Uptick Talent.</p>
        <p>After careful review, we’ve decided not to move forward with your application at this time.</p>
        ${feedback ? `<p><strong>Feedback:</strong> ${feedback.replace(/\n/g, '<br>')}</p>` : ''}
        <p>We truly appreciate the effort you put in and encourage you to apply again in the future.</p>
        <p>Wishing you the very best in your journey!</p>
        <p>— The Uptick Talent Team</p>
      </div>
    `,
  });

  if (error) console.error('Failed to send failed email:', error);
  return !error;
};