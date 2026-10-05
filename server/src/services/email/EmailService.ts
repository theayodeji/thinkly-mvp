import { IEmailProvider } from "@thinkly/shared";
import { ResendProvider } from "./ResendProvider.js";
import { GmailProvider } from "./GmailProvider.js";

class EmailService {
  private provider: IEmailProvider;

  constructor() {
    // Depending on environment variables, choose the provider
    if (process.env.EMAIL_PROVIDER === "resend") {
      this.provider = new ResendProvider();
    } else {
      // Default to Gmail if set, or just default behavior
      this.provider = new GmailProvider();
    }
  }

  async sendPasswordReset(to: string, token: string): Promise<void> {
    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${token}`;
    const subject = "Reset Your Thinkly Password";
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333;">Reset Your Password</h2>
        <p>You requested a password reset for your Thinkly account. Click the button below to choose a new password:</p>
        <div style="margin: 30px 0;">
          <a href="${resetLink}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Reset Password</a>
        </div>
        <p>If you didn't request this, you can safely ignore this email.</p>
        <p style="color: #666; font-size: 14px;">This link will expire in 1 hour.</p>
      </div>
    `;

    return this.provider.sendEmail(to, subject, html);
  }
}

export const emailService = new EmailService();
