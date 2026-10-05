import { IEmailProvider } from "@thinkly/shared";
import { Resend } from "resend";
import { config } from "../../config/env.js";

export class ResendProvider implements IEmailProvider {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY || "dummy_key");
  }

  async sendEmail(to: string, subject: string, html: string): Promise<void> {
    try {
      await this.resend.emails.send({
        from: "Thinkly <noreply@thinkly.app>",
        to,
        subject,
        html,
      });
      console.log(`[Resend] Email sent to ${to}`);
    } catch (error) {
      console.error("[Resend] Error sending email:", error);
      throw error;
    }
  }
}
