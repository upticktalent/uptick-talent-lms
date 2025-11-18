import { Resend } from 'resend';
import { env } from '../../config/dynamicEnv';

const resend = new Resend(env.RESEND_API_KEY);

export const sendAssessmentPassedEmail = async (to: string, name: string) => {
   if (!env.RESEND_API_KEY) {
     throw new Error("RESEND_API_KEY is required");
  }

  const { error } = await resend.emails.send({
    from: "Uptick Talent <no-reply@upticktalent.africa>",
    to,
    subject: 'You Passed the Assessment! Next Step: Interview',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #1a73e8;">Hi ${name.split(' ')[0]},</h2>
        <p><strong>Congratulations!</strong> You’ve successfully passed the assessment.</p>
        <p>We loved your submission and are excited to move forward.</p>
        <p><strong>Next step:</strong> We’ll send you an interview invitation within 48 hours.</p>
        <p>Keep an eye on your email (and spam folder just in case).</p>
        <p>Well done!</p>
        <p>— The Uptick Talent Team</p>
      </div>
    `,
  });

  if (error) console.error('Failed to send passed email:', error);
  return !error;
};