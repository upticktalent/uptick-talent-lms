// src/utils/email/assessment/assessmentReceivedEmail.ts
import { Resend } from 'resend';
import { env } from '../../config/dynamicEnv';

const resend = new Resend(env.RESEND_API_KEY);

interface SendAssessmentReceivedParams {
  to: string;
  name: string;
  githubUrl: string;
  liveDemoUrl?: string;
}

export const sendAssessmentReceivedEmail = async ({
  to,
  name,
  githubUrl,
  liveDemoUrl,
}: SendAssessmentReceivedParams): Promise<boolean> => {
  if (!env.RESEND_API_KEY) {
    console.log('DEV: Assessment received email →', to);
    return true;
  }

  const { error } = await resend.emails.send({
    from: "Uptick Talent <no-reply@upticktalent.africa>",
    to,
    subject: 'We Received Your Assessment Submission!',
    html: `
      <h2>Hi ${name.split(' ')[0]},</h2>
      <p>Thank you for submitting your assessment!</p>
      <p>We’ve received your work and our team will review it within 48 hours.</p>
      <p><strong>Submitted:</strong><br>
      GitHub: <a href="${githubUrl}">${githubUrl}</a><br>
      ${liveDemoUrl ? `Live Demo: <a href="${liveDemoUrl}">${liveDemoUrl}</a>` : ''}
      </p>
      <p>You’ll hear from us soon — keep an eye on your email!</p>
      <p>— The Uptick Talent Team</p>
    `,
  });

  if (error) {
    console.error('Failed to send submission confirmation:', error);
    return false;
  }
  return true;
};