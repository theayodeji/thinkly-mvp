import { IEmailProvider } from "@thinkly/shared";
import nodemailer, { type Transporter } from "nodemailer";

export class GmailProvider implements IEmailProvider {
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
  }

  async sendEmail(to: string, subject: string, html: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: `"Thinkly" <${process.env.GMAIL_USER}>`,
        to,
        subject,
        html,
      });
      console.log(`[Gmail] Email sent to ${to}`);
    } catch (error) {
      console.error("[Gmail] Error sending email:", error);
      throw error;
    }
  }
}
