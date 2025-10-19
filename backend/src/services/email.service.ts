import nodemailer from 'nodemailer';

/**
 * Email Service
 *
 * Handles sending emails for verification, notifications, etc.
 * Supports both real SMTP and development mode (Ethereal/console logging)
 */

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text: string;
}

class EmailService {
  private transporter: nodemailer.Transporter | null = null;
  private isDevelopment: boolean;
  private isEmailEnabled: boolean;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
    this.isEmailEnabled = process.env.ENABLE_EMAIL === 'true';

    if (this.isEmailEnabled) {
      this.initializeTransporter();
    } else {
      console.log('[EMAIL SERVICE] Email sending is disabled. Set ENABLE_EMAIL=true to enable.');
    }
  }

  /**
   * Initialize email transporter with SMTP configuration
   */
  private async initializeTransporter(): Promise<void> {
    try {
      // In development, use Ethereal if SMTP is not configured
      if (this.isDevelopment && !process.env.SMTP_HOST) {
        console.log('[EMAIL SERVICE] Creating Ethereal test account...');
        const testAccount = await nodemailer.createTestAccount();

        this.transporter = nodemailer.createTransport({
          host: testAccount.smtp.host,
          port: testAccount.smtp.port,
          secure: testAccount.smtp.secure,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass,
          },
        });

        console.log('[EMAIL SERVICE] Using Ethereal test account for email testing');
        console.log('[EMAIL SERVICE] Preview emails at: https://ethereal.email');
      } else {
        // Use configured SMTP
        this.transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT || '587'),
          secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        // Verify connection
        await this.transporter.verify();
        console.log('[EMAIL SERVICE] SMTP connection verified successfully');
      }
    } catch (error) {
      console.error('[EMAIL SERVICE] Failed to initialize email transporter:', error);
      this.transporter = null;
    }
  }

  /**
   * Send an email
   */
  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      if (!this.isEmailEnabled) {
        this.logEmailToConsole(options);
        return true;
      }

      if (!this.transporter) {
        console.error('[EMAIL SERVICE] Email transporter not initialized');
        this.logEmailToConsole(options);
        return false;
      }

      const info = await this.transporter.sendMail({
        from: process.env.SMTP_FROM || '"HATAMO" <noreply@hatamo.com>',
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      });

      console.log(`[EMAIL SERVICE] Email sent to ${options.to}: ${info.messageId}`);

      // Preview URL for Ethereal
      if (this.isDevelopment && !process.env.SMTP_HOST) {
        const previewUrl = nodemailer.getTestMessageUrl(info);
        console.log(`[EMAIL SERVICE] Preview URL: ${previewUrl}`);
      }

      return true;
    } catch (error) {
      console.error('[EMAIL SERVICE] Failed to send email:', error);
      this.logEmailToConsole(options);
      return false;
    }
  }

  /**
   * Log email content to console (fallback when email is disabled)
   */
  private logEmailToConsole(options: EmailOptions): void {
    console.log('\n=== EMAIL (Console Mode) ===');
    console.log(`To: ${options.to}`);
    console.log(`Subject: ${options.subject}`);
    console.log(`\n${options.text}\n`);
    console.log('============================\n');
  }

  /**
   * Send verification email with token
   */
  async sendVerificationEmail(email: string, token: string): Promise<boolean> {
    const verificationUrl = `${process.env.FRONTEND_URL}/auth/verify-email?token=${token}`;

    const subject = '【HATAMO】メールアドレスの確認';

    const text = `
HATAMOへのご登録ありがとうございます。

以下のリンクをクリックして、メールアドレスの確認を完了してください：

${verificationUrl}

このリンクは24時間有効です。

※このメールに心当たりがない場合は、無視してください。

---
HATAMO
    `.trim();

    const html = `
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>メールアドレスの確認</title>
</head>
<body style="font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background-color: #f8f9fa; border-radius: 10px; padding: 30px; margin-bottom: 20px;">
    <h1 style="color: #2c3e50; margin-top: 0;">メールアドレスの確認</h1>
    <p style="font-size: 16px; margin-bottom: 20px;">HATAMOへのご登録ありがとうございます。</p>
    <p style="font-size: 16px; margin-bottom: 30px;">
      以下のボタンをクリックして、メールアドレスの確認を完了してください：
    </p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${verificationUrl}"
         style="display: inline-block; background-color: #007bff; color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold;">
        メールアドレスを確認する
      </a>
    </div>
    <p style="font-size: 14px; color: #666; margin-top: 30px;">
      ボタンがクリックできない場合は、以下のURLをコピーしてブラウザに貼り付けてください：
    </p>
    <p style="font-size: 14px; color: #007bff; word-break: break-all;">
      ${verificationUrl}
    </p>
  </div>
  <div style="font-size: 12px; color: #999; text-align: center; border-top: 1px solid #e0e0e0; padding-top: 20px;">
    <p>このリンクは24時間有効です。</p>
    <p>このメールに心当たりがない場合は、無視してください。</p>
    <p style="margin-top: 20px;">© 2025 HATAMO. All rights reserved.</p>
  </div>
</body>
</html>
    `.trim();

    return this.sendEmail({
      to: email,
      subject,
      text,
      html,
    });
  }
}

// Export singleton instance
export const emailService = new EmailService();
