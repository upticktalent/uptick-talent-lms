import { Resend } from 'resend';
import { Logger } from '../constants/logger';

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

export const sendPasswordResetEmail = async (email: string, resetToken: string): Promise<void> => {
  try {
    console.log('📧 Preparing to send reset email to:', email);
    
    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.warn('⚠️ RESEND_API_KEY not configured - simulating email send');
      console.log('🔑 Password reset token for development:', resetToken);
      return; 
    }

    if (!process.env.RESEND_FROM_EMAIL) {
      throw new Error('RESEND_FROM_EMAIL environment variable is not set');
    }

    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: email,
      subject: 'Reset Your Password - Uptick Talent LMS',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    line-height: 1.6; 
                    color: #333; 
                    max-width: 600px; 
                    margin: 0 auto; 
                    padding: 20px; 
                }
                .header { 
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                    color: white; 
                    padding: 30px; 
                    text-align: center; 
                    border-radius: 10px 10px 0 0; 
                }
                .content { 
                    background: #f9f9f9; 
                    padding: 30px; 
                    border-radius: 0 0 10px 10px; 
                }
                .token-box { 
                    background: white; 
                    border: 2px dashed #667eea; 
                    padding: 15px; 
                    text-align: center; 
                    margin: 20px 0; 
                    border-radius: 5px; 
                    font-family: monospace; 
                }
                .button { 
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                    color: white; 
                    padding: 12px 30px; 
                    text-decoration: none; 
                    border-radius: 5px; 
                    display: inline-block; 
                    margin: 10px 0; 
                }
                .footer { 
                    text-align: center; 
                    margin-top: 20px; 
                    padding-top: 20px; 
                    border-top: 1px solid #ddd; 
                    color: #666; 
                    font-size: 14px; 
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Uptick Talent LMS</h1>
                <p>Password Reset Request</p>
            </div>
            <div class="content">
                <h2>Hello!</h2>
                <p>You requested to reset your password for your Uptick Talent LMS account.</p>
                
                <p><strong>Use this reset token:</strong></p>
                <div class="token-box">
                    <strong style="font-size: 18px; letter-spacing: 2px;">${resetToken}</strong>
                </div>
                
                <p>Or click the button below to reset your password:</p>
                <div style="text-align: center;">
                    <a href="${resetLink}" class="button">Reset Password</a>
                </div>
                
                <p style="margin-top: 20px; color: #666;">
                    <strong>Important:</strong> This reset token will expire in 1 hour.
                </p>
                
                <p>If you didn't request this password reset, please ignore this email. Your account remains secure.</p>
            </div>
            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} Uptick Talent LMS. All rights reserved.</p>
            </div>
        </body>
        </html>
      `,
      text: `Password Reset Request - Uptick Talent LMS\n\nYou requested to reset your password for your Uptick Talent LMS account.\n\nYour reset token is: ${resetToken}\n\nOr visit this link to reset your password: ${resetLink}\n\nThis reset token will expire in 1 hour.\n\nIf you didn't request this password reset, please ignore this email.`
    });

    if (error) {
      console.error('❌ Resend API error:', error);
      throw new Error(`Failed to send email: ${error.message}`);
    }

    console.log('✅ Password reset email sent successfully via Resend:', data?.id);
    
  } catch (error: any) {
    console.error('❌ Email sending failed:', error);
    
    // For development, log the token instead of failing
    if (process.env.NODE_ENV === 'development') {
      console.log('🔑 DEVELOPMENT MODE: Password reset token for', email, ':', resetToken);
      return; // Don't throw error in development
    }
    
    throw new Error(`Failed to send reset email: ${error.message}`);
  }
};

export const sendPasswordChangedEmail = async (email: string): Promise<void> => {
  try {
    console.log('📧 Preparing to send password changed notification to:', email);
    
    if (!process.env.RESEND_API_KEY) {
      console.log('📧 Resend not configured - skipping notification');
      return;
    }

    if (!process.env.RESEND_FROM_EMAIL) {
      throw new Error('RESEND_FROM_EMAIL environment variable is not set');
    }

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: email,
      subject: 'Password Changed Successfully - Uptick Talent LMS',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    line-height: 1.6; 
                    color: #333; 
                    max-width: 600px; 
                    margin: 0 auto; 
                    padding: 20px; 
                }
                .header { 
                    background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); 
                    color: white; 
                    padding: 30px; 
                    text-align: center; 
                    border-radius: 10px 10px 0 0; 
                }
                .content { 
                    background: #f9f9f9; 
                    padding: 30px; 
                    border-radius: 0 0 10px 10px; 
                }
                .footer { 
                    text-align: center; 
                    margin-top: 20px; 
                    padding-top: 20px; 
                    border-top: 1px solid #ddd; 
                    color: #666; 
                    font-size: 14px; 
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Uptick Talent LMS</h1>
                <p>Password Updated</p>
            </div>
            <div class="content">
                <h2>Password Changed Successfully</h2>
                <p>Your Uptick Talent LMS account password has been updated successfully.</p>
                
                <div style="background: #e8f5e8; border-left: 4px solid #4CAF50; padding: 15px; margin: 20px 0;">
                    <p style="margin: 0;">✅ Your password was changed on ${new Date().toLocaleString()}</p>
                </div>
                
                <p><strong>Security Notice:</strong></p>
                <p>If you did not make this change, please contact our support team immediately.</p>
                
                <p>Thank you for helping us keep your account secure.</p>
            </div>
            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} Uptick Talent LMS. All rights reserved.</p>
            </div>
        </body>
        </html>
      `,
      text: `Password Changed Successfully - Uptick Talent LMS\n\nYour password has been updated successfully.\n\nDate: ${new Date().toLocaleString()}\n\nIf you did not make this change, please contact our support team immediately.\n\nThank you for helping us keep your account secure.`
    });

    if (error) {
      console.error('❌ Password changed notification failed:', error);
      return;
    }

    console.log('✅ Password changed notification sent successfully:', data?.id);
    
  } catch (error: any) {
    console.error('❌ Password changed notification failed:', error);
    // Don't throw error for notification emails
  }
};

export const sendWelcomeEmail = async (email: string, firstName: string): Promise<void> => {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.log('📧 Resend not configured - skipping welcome email');
      return;
    }

    if (!process.env.RESEND_FROM_EMAIL) {
      throw new Error('RESEND_FROM_EMAIL environment variable is not set');
    }

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: email,
      subject: 'Welcome to Uptick Talent LMS!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    line-height: 1.6; 
                    color: #333; 
                    max-width: 600px; 
                    margin: 0 auto; 
                    padding: 20px; 
                }
                .header { 
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                    color: white; 
                    padding: 30px; 
                    text-align: center; 
                    border-radius: 10px 10px 0 0; 
                }
                .content { 
                    background: #f9f9f9; 
                    padding: 30px; 
                    border-radius: 0 0 10px 10px; 
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Welcome to Uptick Talent LMS!</h1>
            </div>
            <div class="content">
                <h2>Hello ${firstName}!</h2>
                <p>Welcome to Uptick Talent LMS! We're excited to have you on board.</p>
                <p>Get ready to embark on an amazing learning journey with us.</p>
                <p>If you have any questions, feel free to reach out to our support team.</p>
                <p>Happy learning! 🚀</p>
            </div>
        </body>
        </html>
      `
    });

    if (error) {
      console.error('❌ Welcome email failed:', error);
      return;
    }

    console.log('✅ Welcome email sent successfully:', data?.id);
    
  } catch (error: any) {
    console.error('❌ Welcome email failed:', error);
  }
};


export const sendCredentialsEmail = async (
  email: string, 
  firstName: string, 
  password: string, 
  role: 'STUDENT' | 'MENTOR'
): Promise<boolean> => {
  try {
    console.log('📧 Preparing to send credentials email to:', email);
    
    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.warn('⚠️ RESEND_API_KEY not configured - simulating email send');
      console.log('🔑 Credentials for development:');
      console.log('   Email:', email);
      console.log('   Password:', password);
      console.log('   Role:', role);
      return false; // Return false but don't throw error
    }

    if (!process.env.RESEND_FROM_EMAIL) {
      console.error('❌ RESEND_FROM_EMAIL not configured');
      return false;
    }

    const roleDisplay = role === 'STUDENT' ? 'Student' : 'Mentor';
    
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: email,
      subject: `Welcome to Uptick Talent LMS - Your ${roleDisplay} Account`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    line-height: 1.6; 
                    color: #333; 
                    max-width: 600px; 
                    margin: 0 auto; 
                    padding: 20px; 
                }
                .header { 
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                    color: white; 
                    padding: 30px; 
                    text-align: center; 
                    border-radius: 10px 10px 0 0; 
                }
                .content { 
                    background: #f9f9f9; 
                    padding: 30px; 
                    border-radius: 0 0 10px 10px; 
                }
                .credentials-box { 
                    background: white; 
                    border: 2px solid #667eea; 
                    padding: 20px; 
                    margin: 20px 0; 
                    border-radius: 5px; 
                }
                .login-button { 
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                    color: white; 
                    padding: 12px 30px; 
                    text-decoration: none; 
                    border-radius: 5px; 
                    display: inline-block; 
                    margin: 10px 0; 
                }
                .footer { 
                    text-align: center; 
                    margin-top: 20px; 
                    padding-top: 20px; 
                    border-top: 1px solid #ddd; 
                    color: #666; 
                    font-size: 14px; 
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Uptick Talent LMS</h1>
                <p>Welcome ${firstName}!</p>
            </div>
            <div class="content">
                <h2>Your ${roleDisplay} Account is Ready</h2>
                <p>Hello ${firstName},</p>
                <p>Your ${roleDisplay.toLowerCase()} account has been created successfully. Here are your login credentials:</p>
                
                <div class="credentials-box">
                    <h3>Login Details</h3>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Temporary Password:</strong> <code style="font-size: 16px; background: #f5f5f5; padding: 5px 10px; border-radius: 3px;">${password}</code></p>
                    <p><strong>Role:</strong> ${roleDisplay}</p>
                </div>
                
                <p>To get started, please login and change your password immediately:</p>
                <div style="text-align: center;">
                    <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/login" class="login-button">Login to Your Account</a>
                </div>
                
                <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0;">
                    <p style="margin: 0;"><strong>Security Notice:</strong> For security reasons, please change your password after your first login.</p>
                </div>
                
                <p>If you have any questions, please contact our support team.</p>
            </div>
            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} Uptick Talent LMS. All rights reserved.</p>
            </div>
        </body>
        </html>
      `,
      text: `
        Welcome to Uptick Talent LMS - Your ${roleDisplay} Account
        
        Hello ${firstName},
        
        Your ${roleDisplay.toLowerCase()} account has been created successfully.
        
        Login Details:
        - Email: ${email}
        - Temporary Password: ${password}
        - Role: ${roleDisplay}
        
        Login URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}/login
        
        Security Notice: For security reasons, please change your password after your first login.
        
        If you have any questions, please contact our support team.
      `
    });

    if (error) {
      console.error('❌ Resend API error:', error);
      return false;
    }

    console.log('✅ Credentials email sent successfully via Resend:', data?.id);
    return true;
    
  } catch (error: any) {
    console.error('❌ Credentials email sending failed:', error);
    
    // For development, log the credentials instead of failing completely
    console.log('🔑 DEVELOPMENT - Credentials for', email, ':');
    console.log('   Password:', password);
    console.log('   Role:', role);
    
    return false;
  }
};