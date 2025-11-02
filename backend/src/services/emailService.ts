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
        from: 'try.glass101@gmail.com',
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
   * Send waitlist welcome email
   */
  static async sendWaitlistWelcome(email: string): Promise<void> {
    const transporter = createTransporter();

    if (!transporter) {
      console.log('📧 EMAIL SIMULATION (Gmail not configured):');
      console.log(`To: ${email}`);
      console.log(`Subject: Welcome to the Glass Waitlist! 🎉`);
      console.log('💡 To enable real emails, set GMAIL_USER and GMAIL_APP_PASSWORD environment variables');
      return;
    }

    try {
      const mailOptions = {
        from: 'try.glass101@gmail.com',
        to: email,
        subject: 'Welcome to the Glass Waitlist! 🎉',
        html: this.getWaitlistWelcomeTemplate(email),
      };

      const info = await transporter.sendMail(mailOptions);
      console.log('✅ Waitlist welcome email sent:', info.messageId);
    } catch (error) {
      console.error('❌ Email sending failed:', error);
      // Don't throw - we don't want email failures to break waitlist signups
      console.warn('⚠️  Continuing despite email failure');
    }
  }

  /**
   * Get email template for waitlist welcome
   */
  private static getWaitlistWelcomeTemplate(email: string): string {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Glass Waitlist</title>
        <style>
            body {
                font-family: 'Instrument Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                line-height: 1.6;
                margin: 0;
                padding: 0;
                background: linear-gradient(135deg, #85b5d9 0%, #749fbf 100%);
                color: #333;
            }
            .container {
                max-width: 600px;
                margin: 40px auto;
                padding: 20px;
            }
            .email-card {
                background: rgba(255, 255, 255, 0.98);
                backdrop-filter: blur(10px);
                border-radius: 34px;
                padding: 48px 40px;
                text-align: center;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
                border: 1px solid rgba(255, 255, 255, 0.2);
            }
            .logo {
                font-size: 48px;
                font-weight: 700;
                background: linear-gradient(135deg, #85b5d9 0%, #749fbf 100%);
                -webkit-background-clip: text;
                background-clip: text;
                -webkit-text-fill-color: transparent;
                margin-bottom: 24px;
                letter-spacing: -2px;
            }
            .success-icon {
                width: 80px;
                height: 80px;
                margin: 0 auto 24px;
                background: linear-gradient(135deg, #85b5d9 0%, #749fbf 100%);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 8px 16px rgba(133, 181, 217, 0.3);
            }
            .success-icon svg {
                width: 40px;
                height: 40px;
                color: #ffffff;
            }
            .heading {
                font-size: 32px;
                font-weight: 600;
                color: #1a1a1a;
                margin-bottom: 16px;
                letter-spacing: -1px;
            }
            .subheading {
                font-size: 18px;
                color: #555;
                margin-bottom: 32px;
                line-height: 1.5;
            }
            .benefits {
                background: rgba(133, 181, 217, 0.1);
                border-radius: 20px;
                padding: 32px 24px;
                margin: 32px 0;
                text-align: left;
            }
            .benefit-item {
                display: flex;
                align-items: flex-start;
                gap: 12px;
                margin-bottom: 20px;
            }
            .benefit-item:last-child {
                margin-bottom: 0;
            }
            .benefit-icon {
                width: 24px;
                height: 24px;
                border-radius: 50%;
                background: rgba(133, 181, 217, 0.15);
                border: 2px solid #85b5d9;
                flex-shrink: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-top: 2px;
            }
            .benefit-icon-dot {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: #85b5d9;
            }
            .benefit-text {
                font-size: 16px;
                color: #333;
                line-height: 1.6;
                flex: 1;
            }
            .highlight-box {
                background: linear-gradient(135deg, rgba(133, 181, 217, 0.1) 0%, rgba(116, 159, 191, 0.1) 100%);
                border-left: 4px solid #85b5d9;
                border-radius: 12px;
                padding: 20px;
                margin: 32px 0;
                text-align: left;
            }
            .highlight-text {
                font-size: 16px;
                color: #333;
                margin: 0;
                line-height: 1.6;
            }
            .footer {
                color: #888;
                font-size: 14px;
                margin-top: 40px;
                padding-top: 24px;
                border-top: 1px solid #eee;
            }
            .footer-link {
                color: #85b5d9;
                text-decoration: none;
            }
            .footer-link:hover {
                text-decoration: underline;
            }
            @media only screen and (max-width: 600px) {
                .container {
                    padding: 10px;
                    margin: 20px auto;
                }
                .email-card {
                    padding: 32px 24px;
                    border-radius: 24px;
                }
                .logo {
                    font-size: 36px;
                }
                .heading {
                    font-size: 24px;
                }
                .subheading {
                    font-size: 16px;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="email-card">
                <div class="logo">Glass</div>
                
                <div class="success-icon">
                    <svg fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                        <path d="M5 13l4 4L19 7"></path>
                    </svg>
                </div>
                
                <h1 class="heading">You're on the list! 🎉</h1>
                
                <p class="subheading">
                    Thanks for joining the Glass waitlist! We're excited to have you on this journey.
                </p>
                
                <div class="highlight-box">
                    <p class="highlight-text">
                        <strong>What happens next?</strong><br>
                        We'll notify you at <strong>${email}</strong> as soon as Glass is ready to launch. 
                        You'll be among the first to experience our AI-powered fact-checking platform.
                    </p>
                </div>
                
                <div class="benefits">
                    <div class="benefit-item">
                        <div class="benefit-icon">
                            <div class="benefit-icon-dot"></div>
                        </div>
                        <p class="benefit-text">
                            <strong>Early Access</strong> - Get priority access to Glass when we launch
                        </p>
                    </div>
                    <div class="benefit-item">
                        <div class="benefit-icon">
                            <div class="benefit-icon-dot"></div>
                        </div>
                        <p class="benefit-text">
                            <strong>Exclusive Updates</strong> - Stay informed about our development progress
                        </p>
                    </div>
                    <div class="benefit-item">
                        <div class="benefit-icon">
                            <div class="benefit-icon-dot"></div>
                        </div>
                        <p class="benefit-text">
                            <strong>Priority Support</strong> - Get help when you need it most
                        </p>
                    </div>
                </div>
                
                <div class="footer">
                    <p style="margin: 0 0 8px 0;">
                        <strong>Thanks for choosing Glass!</strong> ✨
                    </p>
                    <p style="margin: 0 0 8px 0; color: #666;">
                        Transparent, simple, and always in focus.
                    </p>
                    <p style="margin: 8px 0 0 0; font-size: 12px; color: #999;">
                        Questions? Contact us at <a href="mailto:try.glass101@gmail.com" class="footer-link">try.glass101@gmail.com</a>
                    </p>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
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
