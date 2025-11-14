import { Logger } from '../config/logger';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendPasswordResetEmail = async (email: string, resetToken: string) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  
  const mailOptions = {
    from: process.env.SMTP_FROM || 'noreply@upticklms.com',
    to: email,
    subject: 'Password Reset Request - Uptick Talent LMS',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Password Reset Request</h2>
        <p>You requested to reset your password for your Uptick Talent LMS account.</p>
        <p>Click the button below to reset your password:</p>
        <a href="${resetUrl}" 
           style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 4px; margin: 16px 0;">
          Reset Password
        </a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <hr style="margin: 24px 0;">
        <p style="color: #6b7280; font-size: 14px;">
          Uptick Talent LMS Team
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    Logger.log(`Password reset email sent to ${email}`);
  } catch (error) {
    Logger.error('Error sending email:', error);
    throw new Error('Failed to send password reset email');
  }
};

export const sendPasswordChangedEmail = async (email: string) => {
  const mailOptions = {
    from: process.env.SMTP_FROM || 'noreply@upticklms.com',
    to: email,
    subject: 'Password Changed - Uptick Talent LMS',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Password Changed Successfully</h2>
        <p>Your Uptick Talent LMS password has been changed successfully.</p>
        <p>If you did not make this change, please contact support immediately.</p>
        <hr style="margin: 24px 0;">
        <p style="color: #6b7280; font-size: 14px;">
          Uptick Talent LMS Team
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    Logger.log(`Password changed notification sent to ${email}`);
  } catch (error) {
    Logger.error('Error sending email:', error);
  }
};