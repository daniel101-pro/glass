import nodemailer from 'nodemailer';
import { getEnv } from '../config/env.js';

const env = getEnv();

// Create Gmail transporter
const createTransporter = () => {
  if (!env.GMAIL_USER || !env.GMAIL_APP_PASSWORD) {
    console.log('⚠️  Gmail credentials not configured. Email simulation mode enabled.');
    return null;
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: env.GMAIL_USER,
      pass: env.GMAIL_APP_PASSWORD,
    },
  });
};

export class EmailService {
  /**
   * Send verification code email
   */
  static async sendVerificationCode(email: string, code: string, fullName: string): Promise<void> {
    const transporter = createTransporter();

    if (!transporter) {
      console.log('📧 EMAIL SIMULATION (Gmail not configured):');
      console.log(`To: ${email}`);
      console.log(`Subject: Verify your Glass account`);
      console.log(`Code: ${code}`);
      console.log(`User: ${fullName}`);
      console.log('💡 To enable real emails, set GMAIL_USER and GMAIL_APP_PASSWORD environment variables');
      return;
    }

    try {
      const mailOptions = {
        from: env.FROM_EMAIL,
        to: email,
        subject: 'Verify your Glass account',
        html: this.getVerificationEmailTemplate(code, fullName),
      };

      const info = await transporter.sendMail(mailOptions);
      console.log('✅ Verification email sent:', info.messageId);
    } catch (error) {
      console.error('❌ Email sending failed:', error);
      throw new Error('Failed to send verification email');
    }
  }

  /**
   * Get email template for verification code
   */
  private static getVerificationEmailTemplate(code: string, fullName: string): string {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify your Glass account</title>
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                line-height: 1.6;
                margin: 0;
                padding: 0;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: #333;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }
            .email-card {
                background: rgba(255, 255, 255, 0.98);
                backdrop-filter: blur(10px);
                border-radius: 16px;
                padding: 40px;
                text-align: center;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
            }
            .logo {
                font-size: 36px;
                font-weight: bold;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                -webkit-background-clip: text;
                background-clip: text;
                -webkit-text-fill-color: transparent;
                margin-bottom: 20px;
                letter-spacing: -1px;
            }
            .verification-code {
                font-size: 42px;
                font-weight: bold;
                color: #333;
                background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
                padding: 25px;
                border-radius: 16px;
                margin: 30px 0;
                letter-spacing: 8px;
                border: 3px dashed #667eea;
                box-shadow: 0 8px 16px rgba(102, 126, 234, 0.1);
            }
            .text {
                color: #555;
                margin-bottom: 20px;
                font-size: 16px;
            }
            .welcome-text {
                font-size: 24px;
                font-weight: 600;
                color: #333;
                margin-bottom: 10px;
            }
            .footer {
                color: #888;
                font-size: 14px;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #eee;
            }
            .glass-feature {
                background: rgba(102, 126, 234, 0.1);
                border-radius: 12px;
                padding: 20px;
                margin: 20px 0;
                border-left: 4px solid #667eea;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="email-card">
                <div class="logo">Glass</div>
                <div class="welcome-text">Welcome, ${fullName}! 🎉</div>
                <p class="text">You're one step away from experiencing clarity in real-time.</p>
                
                <div class="glass-feature">
                    <p class="text" style="margin: 0; font-weight: 500;">Enter this verification code to complete your setup:</p>
                </div>
                
                <div class="verification-code">${code}</div>
                
                <p class="text">⏰ This code will expire in <strong>10 minutes</strong> for security.</p>
                <p class="text">If you didn't create a Glass account, you can safely ignore this email.</p>
                
                <div class="footer">
                    <p style="margin: 0;">Thanks for choosing Glass! ✨</p>
                    <p style="margin: 5px 0 0 0; font-style: italic;">Transparent, simple, and always in focus.</p>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
  }
}