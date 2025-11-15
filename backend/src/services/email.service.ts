import { Resend } from 'resend';
import { getMessage } from '../utils/i188n';
import { Logger } from '../config/logger';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
}

export class EmailService {
  private from: string;

  constructor() {
    this.from = process.env.RESEND_FROM_EMAIL || getMessage('EMAIL.FROM_DEFAULT');
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      const { data, error } = await resend.emails.send({
        from: options.from || this.from,
        to: options.to,
        subject: options.subject,
        html: options.html,
      });

      if (error) {
        console.error('Resend error:', error);
        return false;
      }

      Logger.log('Email sent successfully:', data?.id);
      return true;
    } catch (error) {
      Logger.error('Email sending failed:', error);
      return false;
    }
  }

  async sendCredentialsEmail(
    email: string,
    firstName: string,
    temporaryPassword: string,
    role: 'STUDENT' | 'MENTOR'
  ): Promise<boolean> {
    const roleText = role === 'STUDENT' 
      ? getMessage('EMAIL.ROLES.STUDENT') 
      : getMessage('EMAIL.ROLES.MENTOR');
    
    const loginUrl = `${process.env.FRONTEND_URL}/login`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
          .content { background: #f9fafb; padding: 30px; }
          .credentials { background: #e0f2fe; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; }
          .button { background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${getMessage('EMAIL.CREDENTIALS.TITLE')}</h1>
          </div>
          <div class="content">
            <p>${getMessage('EMAIL.GREETING', { firstName })}</p>
            <p>${getMessage('EMAIL.CREDENTIALS.ACCOUNT_CREATED', { role: roleText })}</p>
            
            <div class="credentials">
              <p><strong>${getMessage('EMAIL.CREDENTIALS.EMAIL_LABEL')}:</strong> ${email}</p>
              <p><strong>${getMessage('EMAIL.CREDENTIALS.TEMP_PASSWORD_LABEL')}:</strong> ${temporaryPassword}</p>
              <p><strong>${getMessage('EMAIL.CREDENTIALS.ROLE_LABEL')}:</strong> ${roleText}</p>
            </div>

            <p>${getMessage('EMAIL.CREDENTIALS.CHANGE_PASSWORD')}</p>
            
            <p>
              <a href="${loginUrl}" class="button">
                ${getMessage('EMAIL.CREDENTIALS.LOGIN_BUTTON')}
              </a>
            </p>

            <p><strong>${getMessage('EMAIL.CREDENTIALS.SECURITY_NOTICE')}</strong></p>
          </div>
          <div class="footer">
            <p>${getMessage('EMAIL.FOOTER.COPYRIGHT')}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: email,
      subject: getMessage('EMAIL.CREDENTIALS.SUBJECT', { role: roleText }),
      html,
    });
  }

  async sendApplicationStatusEmail(
    email: string,
    firstName: string,
    status: string,
    notes?: string
  ): Promise<boolean> {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
          .content { background: #f9fafb; padding: 30px; }
          .status { background: #e0f2fe; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${getMessage('EMAIL.APPLICATION_STATUS.TITLE')}</h1>
          </div>
          <div class="content">
            <p>${getMessage('EMAIL.GREETING', { firstName })}</p>
            <p>${getMessage('EMAIL.APPLICATION_STATUS.STATUS_UPDATED')}</p>
            
            <div class="status">
              <h3>${getMessage('EMAIL.APPLICATION_STATUS.CURRENT_STATUS', { status })}</h3>
              ${notes ? `<p><strong>${getMessage('EMAIL.APPLICATION_STATUS.NOTES_LABEL')}:</strong> ${notes}</p>` : ''}
            </div>

            <p>${getMessage('EMAIL.APPLICATION_STATUS.FOLLOW_UP')}</p>
            <p>${getMessage('EMAIL.APPLICATION_STATUS.THANK_YOU')}</p>
          </div>
          <div class="footer">
            <p>${getMessage('EMAIL.FOOTER.COPYRIGHT')}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: email,
      subject: getMessage('EMAIL.APPLICATION_STATUS.SUBJECT'),
      html,
    });
  }

  async sendBulkEmail(
    recipients: string[],
    subject: string,
    message: string
  ): Promise<{ success: string[]; failed: string[] }> {
    const success: string[] = [];
    const failed: string[] = [];

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
          .content { background: #f9fafb; padding: 30px; }
          .footer { text-align: center; padding: 20px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${getMessage('EMAIL.BULK.TITLE')}</h1>
          </div>
          <div class="content">
            ${message}
          </div>
          <div class="footer">
            <p>${getMessage('EMAIL.FOOTER.COPYRIGHT')}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send emails in batches to avoid rate limits
    const batchSize = 10;
    for (let i = 0; i < recipients.length; i += batchSize) {
      const batch = recipients.slice(i, i + batchSize);
      
      const promises = batch.map(async (email) => {
        const sent = await this.sendEmail({
          to: email,
          subject,
          html,
        });
        
        if (sent) {
          success.push(email);
        } else {
          failed.push(email);
        }
      });

      await Promise.all(promises);
      
      // Small delay between batches
      if (i + batchSize < recipients.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return { success, failed };
  }

  // Additional email methods
  async sendPasswordResetEmail(email: string, resetToken: string): Promise<boolean> {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
          .content { background: #f9fafb; padding: 30px; }
          .button { background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; }
          .footer { text-align: center; padding: 20px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${getMessage('EMAIL.PASSWORD_RESET.TITLE')}</h1>
          </div>
          <div class="content">
            <p>${getMessage('EMAIL.PASSWORD_RESET.INSTRUCTIONS')}</p>
            
            <p>
              <a href="${resetUrl}" class="button">
                ${getMessage('EMAIL.PASSWORD_RESET.RESET_BUTTON')}
              </a>
            </p>

            <p>${getMessage('EMAIL.PASSWORD_RESET.EXPIRY_NOTICE')}</p>
            <p>${getMessage('EMAIL.PASSWORD_RESET.IGNORE_IF_NOT_REQUESTED')}</p>
          </div>
          <div class="footer">
            <p>${getMessage('EMAIL.FOOTER.COPYRIGHT')}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: email,
      subject: getMessage('EMAIL.PASSWORD_RESET.SUBJECT'),
      html,
    });
  }

  async sendPasswordChangedEmail(email: string): Promise<boolean> {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
          .content { background: #f9fafb; padding: 30px; }
          .footer { text-align: center; padding: 20px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${getMessage('EMAIL.PASSWORD_CHANGED.TITLE')}</h1>
          </div>
          <div class="content">
            <p>${getMessage('EMAIL.PASSWORD_CHANGED.CONFIRMATION')}</p>
            <p>${getMessage('EMAIL.PASSWORD_CHANGED.SECURITY_NOTICE')}</p>
            <p>${getMessage('EMAIL.PASSWORD_CHANGED.CONTACT_SUPPORT_IF_NEEDED')}</p>
          </div>
          <div class="footer">
            <p>${getMessage('EMAIL.FOOTER.COPYRIGHT')}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: email,
      subject: getMessage('EMAIL.PASSWORD_CHANGED.SUBJECT'),
      html,
    });
  }
  async sendInterviewInvitation(
  email: string,
  firstName: string,
  interviewDate: string | Date,
  notes?: string,
  interviewLink?: string,
  interviewer?: string
): Promise<boolean> {
  const formattedDate = new Date(interviewDate).toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2563eb; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .interview-details { background: #e0f2fe; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb; }
        .detail-item { margin: 10px 0; }
        .detail-label { font-weight: bold; color: #1e40af; }
        .button { background: #2563eb; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold; margin: 15px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        .instructions { background: #fef3c7; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #d97706; }
        .important { color: #dc2626; font-weight: bold; }
        .contact-info { background: #f0fdf4; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #16a34a; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Interview Invitation</h1>
          <p>Uptick Talent Program</p>
        </div>
        <div class="content">
          <p>${getMessage('EMAIL.GREETING', { firstName })}</p>
          
          <p>Congratulations! After reviewing your application, we're excited to invite you to an interview for the Uptick Talent Program.</p>

          <div class="interview-details">
            <h3 style="margin-top: 0; color: #1e40af;">📅 Interview Details</h3>
            <div class="detail-item">
              <span class="detail-label">Date & Time:</span> ${formattedDate}
            </div>
            ${interviewer ? `
            <div class="detail-item">
              <span class="detail-label">Interviewer:</span> ${interviewer}
            </div>
            ` : ''}
            ${interviewLink ? `
            <div class="detail-item">
              <span class="detail-label">Meeting Link:</span> 
              <a href="${interviewLink}" target="_blank">${interviewLink}</a>
            </div>
            ` : ''}
            ${notes ? `
            <div class="detail-item">
              <span class="detail-label">Additional Notes:</span> ${notes}
            </div>
            ` : ''}
          </div>

          ${interviewLink ? `
          <div style="text-align: center;">
            <a href="${interviewLink}" class="button">
              🔗 Join Interview Meeting
            </a>
          </div>
          ` : ''}

          <div class="instructions">
            <h4 style="margin-top: 0; color: #d97706;">📋 Preparation Instructions</h4>
            <ul>
              <li>Please join 5 minutes before the scheduled time</li>
              <li>Ensure you have a stable internet connection</li>
              <li>Prepare to discuss your background and interests</li>
              <li>Have any questions ready for our team</li>
              <li>Test your audio and video equipment beforehand</li>
            </ul>
          </div>

          <div class="contact-info">
            <h4 style="margin-top: 0; color: #16a34a;">💼 Need to Reschedule?</h4>
            <p>If you need to reschedule or have any questions, please reply to this email at least 24 hours before your scheduled interview.</p>
            <p class="important">Late cancellations or no-shows may affect your application status.</p>
          </div>

          <p>We're looking forward to learning more about you and your potential fit for our program!</p>

          <p>Best regards,<br>
          <strong>The Uptick Talent Team</strong></p>
        </div>
        <div class="footer">
          <p>${getMessage('EMAIL.FOOTER.COPYRIGHT')}</p>
          <p>Uptick Talent - Empowering the next generation of tech professionals</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return this.sendEmail({
    to: email,
    subject: `🎯 Interview Invitation - Uptick Talent Program - ${formattedDate}`,
    html,
  });
}
}

export const emailService = new EmailService();