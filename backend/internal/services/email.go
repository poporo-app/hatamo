package services

import (
	"bytes"
	"fmt"
	"html/template"
	"log"
	"net/url"

	"github.com/j-nasu/hatamo/backend/internal/config"
	"gopkg.in/gomail.v2"
)

type EmailService struct {
	config   *config.EmailConfig
	appConfig *config.AppConfig
	dialer   *gomail.Dialer
}

type EmailData struct {
	RecipientName string
	RecipientEmail string
	VerificationURL string
	AppName         string
	AppBaseURL      string
}

func NewEmailService(cfg *config.Config) *EmailService {
	dialer := gomail.NewDialer(
		cfg.Email.SMTPHost,
		cfg.Email.SMTPPort,
		cfg.Email.SMTPUsername,
		cfg.Email.SMTPPassword,
	)
	
	// If no username/password provided (e.g., MailHog), skip authentication
	if cfg.Email.SMTPUsername == "" && cfg.Email.SMTPPassword == "" {
		dialer = gomail.NewDialer(cfg.Email.SMTPHost, cfg.Email.SMTPPort, "", "")
		dialer.Auth = nil
	}

	return &EmailService{
		config:    &cfg.Email,
		appConfig: &cfg.App,
		dialer:    dialer,
	}
}

func (es *EmailService) SendVerificationEmail(recipientEmail, recipientName, verificationToken string) error {
	log.Printf("Attempting to send verification email to %s via SMTP server %s:%d", 
		recipientEmail, es.config.SMTPHost, es.config.SMTPPort)
	
	// URL-encode the token for safe inclusion in URL
	encodedToken := url.QueryEscape(verificationToken)
	verificationURL := fmt.Sprintf("%s/verify-email?token=%s", es.appConfig.BaseURL, encodedToken)
	
	emailData := EmailData{
		RecipientName:   recipientName,
		RecipientEmail:  recipientEmail,
		VerificationURL: verificationURL,
		AppName:         es.appConfig.Name,
		AppBaseURL:      es.appConfig.BaseURL,
	}

	subject := fmt.Sprintf("Welcome to %s - Please verify your email", es.appConfig.Name)
	
	htmlBody, err := es.renderVerificationTemplate(emailData)
	if err != nil {
		log.Printf("Error rendering email template: %v", err)
		return fmt.Errorf("failed to render email template: %w", err)
	}

	plainBody := es.renderPlainVerificationEmail(emailData)

	m := gomail.NewMessage()
	m.SetHeader("From", m.FormatAddress(es.config.FromEmail, es.config.FromName))
	m.SetHeader("To", recipientEmail)
	m.SetHeader("Subject", subject)
	m.SetBody("text/plain", plainBody)
	m.AddAlternative("text/html", htmlBody)

	log.Printf("Email message prepared. Sending to SMTP server...")
	
	if err := es.dialer.DialAndSend(m); err != nil {
		log.Printf("Failed to send verification email to %s: %v", recipientEmail, err)
		log.Printf("SMTP Config - Host: %s, Port: %d, Auth: %v", 
			es.config.SMTPHost, es.config.SMTPPort, es.dialer.Auth != nil)
		return fmt.Errorf("failed to send email: %w", err)
	}

	log.Printf("Verification email sent successfully to %s", recipientEmail)
	log.Printf("You can view the email at http://localhost:8025 (MailHog Web UI)")
	return nil
}

func (es *EmailService) renderVerificationTemplate(data EmailData) (string, error) {
	tmplStr := `
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification - {{.AppName}}</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f8f9fa;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%); padding: 40px 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 300; letter-spacing: 1px;">
                {{.AppName}}
            </h1>
            <p style="color: #ecf0f1; margin: 10px 0 0 0; font-size: 14px; opacity: 0.9;">
                Premium Matching Service
            </p>
        </div>

        <!-- Main Content -->
        <div style="padding: 50px 30px;">
            <h2 style="color: #2c3e50; font-size: 24px; font-weight: 400; margin-bottom: 20px; text-align: center;">
                Welcome to {{.AppName}}
            </h2>
            
            <p style="color: #34495e; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                Dear {{.RecipientName}},
            </p>
            
            <p style="color: #34495e; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                Thank you for joining {{.AppName}}, the sophisticated matching platform for discerning individuals. 
                To complete your registration and ensure the security of your account, please verify your email address.
            </p>

            <!-- Verification Button -->
            <div style="text-align: center; margin: 40px 0;">
                <a href="{{.VerificationURL}}" 
                   style="display: inline-block; background: linear-gradient(135deg, #3498db 0%, #2980b9 100%); 
                          color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 6px; 
                          font-size: 16px; font-weight: 500; letter-spacing: 0.5px; 
                          box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
                          transition: all 0.3s ease;">
                    Verify Email Address
                </a>
            </div>

            <div style="background-color: #f8f9fa; border-left: 4px solid #3498db; padding: 20px; margin: 30px 0;">
                <p style="color: #34495e; font-size: 14px; line-height: 1.5; margin: 0;">
                    <strong>Security Note:</strong> This verification link will expire in 24 hours. 
                    If you didn't create an account with {{.AppName}}, please ignore this email.
                </p>
            </div>

            <p style="color: #34495e; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                If the button doesn't work, you can also copy and paste this link into your browser:
            </p>
            
            <p style="word-break: break-all; background-color: #f8f9fa; padding: 15px; border-radius: 4px; 
                      font-family: monospace; font-size: 14px; color: #2c3e50; border: 1px solid #e9ecef;">
                {{.VerificationURL}}
            </p>
        </div>

        <!-- Footer -->
        <div style="background-color: #34495e; padding: 30px; text-align: center;">
            <p style="color: #ecf0f1; font-size: 14px; margin: 0 0 10px 0;">
                Thank you for choosing {{.AppName}}
            </p>
            <p style="color: #95a5a6; font-size: 12px; margin: 0;">
                This is an automated message. Please do not reply to this email.
            </p>
            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #4a5f7a;">
                <p style="color: #95a5a6; font-size: 12px; margin: 0;">
                    © 2024 {{.AppName}}. All rights reserved.
                </p>
            </div>
        </div>
    </div>
</body>
</html>
`

	tmpl, err := template.New("verification").Parse(tmplStr)
	if err != nil {
		return "", err
	}

	var buf bytes.Buffer
	if err := tmpl.Execute(&buf, data); err != nil {
		return "", err
	}

	return buf.String(), nil
}

// SendBusinessVerificationEmail sends a verification email to business users
func (es *EmailService) SendBusinessVerificationEmail(recipientEmail, recipientName, businessName, verificationToken string) error {
	log.Printf("Attempting to send business verification email to %s via SMTP server %s:%d", 
		recipientEmail, es.config.SMTPHost, es.config.SMTPPort)
	
	// URL-encode the token for safe inclusion in URL
	encodedToken := url.QueryEscape(verificationToken)
	verificationURL := fmt.Sprintf("%s/business/verify-email?token=%s", es.appConfig.BaseURL, encodedToken)
	
	emailData := struct {
		EmailData
		BusinessName string
	}{
		EmailData: EmailData{
			RecipientName:   recipientName,
			RecipientEmail:  recipientEmail,
			VerificationURL: verificationURL,
			AppName:         es.appConfig.Name,
			AppBaseURL:      es.appConfig.BaseURL,
		},
		BusinessName: businessName,
	}

	subject := fmt.Sprintf("%s 事業者登録 - メールアドレスの確認", es.appConfig.Name)
	
	htmlBody := es.renderBusinessVerificationHTML(emailData)
	plainBody := es.renderBusinessVerificationPlain(emailData)

	m := gomail.NewMessage()
	m.SetHeader("From", m.FormatAddress(es.config.FromEmail, es.config.FromName))
	m.SetHeader("To", recipientEmail)
	m.SetHeader("Subject", subject)
	m.SetBody("text/plain", plainBody)
	m.AddAlternative("text/html", htmlBody)

	log.Printf("Business email message prepared. Sending to SMTP server...")
	
	if err := es.dialer.DialAndSend(m); err != nil {
		log.Printf("Failed to send business verification email to %s: %v", recipientEmail, err)
		return fmt.Errorf("failed to send email: %w", err)
	}

	log.Printf("Business verification email sent successfully to %s", recipientEmail)
	return nil
}

func (es *EmailService) renderBusinessVerificationHTML(data struct {
	EmailData
	BusinessName string
}) string {
	return fmt.Sprintf(`
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #10b981 0%%, #059669 100%%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 12px 30px; background: #10b981; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>%s 事業者登録</h1>
        </div>
        <div class="content">
            <h2>ようこそ、%s 様</h2>
            <p>事業者名: <strong>%s</strong></p>
            <p>%s への事業者登録ありがとうございます。</p>
            <p>以下のボタンをクリックして、メールアドレスの確認を完了してください：</p>
            <div style="text-align: center;">
                <a href="%s" class="button">メールアドレスを確認</a>
            </div>
            <p style="color: #6b7280; font-size: 14px;">
                このリンクは24時間有効です。期限が切れた場合は、新しい確認メールをリクエストしてください。
            </p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            <p style="color: #6b7280; font-size: 14px;">
                このメールに心当たりがない場合は、無視していただいて構いません。
            </p>
        </div>
        <div class="footer">
            <p>© 2024 %s. All rights reserved.</p>
            <p>このメールは自動送信されています。返信はできません。</p>
        </div>
    </div>
</body>
</html>
`, data.AppName, data.RecipientName, data.BusinessName, data.AppName, data.VerificationURL, data.AppName)
}

func (es *EmailService) renderBusinessVerificationPlain(data struct {
	EmailData
	BusinessName string
}) string {
	return fmt.Sprintf(`
%s 事業者登録

ようこそ、%s 様

事業者名: %s

%s への事業者登録ありがとうございます。

以下のリンクをクリックして、メールアドレスの確認を完了してください：
%s

このリンクは24時間有効です。

このメールに心当たりがない場合は、無視していただいて構いません。

---
© 2024 %s. All rights reserved.
`, data.AppName, data.RecipientName, data.BusinessName, data.AppName, data.VerificationURL, data.AppName)
}

func (es *EmailService) renderPlainVerificationEmail(data EmailData) string {
	return fmt.Sprintf(`Welcome to %s

Dear %s,

Thank you for joining %s, the sophisticated matching platform for discerning individuals.

To complete your registration and ensure the security of your account, please verify your email address by clicking on the following link:

%s

This verification link will expire in 24 hours. If you didn't create an account with %s, please ignore this email.

Thank you for choosing %s.

---
This is an automated message. Please do not reply to this email.
© 2024 %s. All rights reserved.`,
		data.AppName,
		data.RecipientName,
		data.AppName,
		data.VerificationURL,
		data.AppName,
		data.AppName,
		data.AppName,
	)
}

// TestConnection tests the SMTP connection
func (es *EmailService) TestConnection() error {
	d := gomail.NewDialer(
		es.config.SMTPHost,
		es.config.SMTPPort,
		es.config.SMTPUsername,
		es.config.SMTPPassword,
	)

	closer, err := d.Dial()
	if err != nil {
		return fmt.Errorf("failed to connect to SMTP server: %w", err)
	}
	defer closer.Close()

	return nil
}