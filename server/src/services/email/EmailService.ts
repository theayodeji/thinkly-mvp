import React from "react";
import { render } from "@react-email/render";
import { IEmailProvider } from "@thinkly/shared";
import { ResendProvider } from "./ResendProvider.js";
import { GmailProvider } from "./GmailProvider.js";
import { OTPEmail } from "../../emails/OTPEmail.js";
import { WelcomeEmail } from "../../emails/WelcomeEmail.js";
import { ResetPasswordEmail } from "../../emails/ResetPasswordEmail.js";
import { VerifyEmailEmail } from "../../emails/VerifyEmailEmail.js";
import { WeeklyQuizPromoEmail } from "../../emails/WeeklyQuizPromoEmail.js";

class EmailService {
  private provider: IEmailProvider;

  constructor() {
    if (process.env.EMAIL_PROVIDER === "resend") {
      this.provider = new ResendProvider();
    } else {
      this.provider = new GmailProvider();
    }
  }

  async sendOTPEmail(to: string, otp: string, purpose: string): Promise<void> {
    const subject = `Your Thinkly Verification Code: ${otp}`;
    const html = await render(React.createElement(OTPEmail, { otp, purpose }));
    return this.provider.sendEmail(to, subject, html);
  }

  async sendWelcomeEmail(to: string, name: string): Promise<void> {
    const subject = "Welcome to Thinkly!";
    const dashboardUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/dashboard`;
    const html = await render(React.createElement(WelcomeEmail, { name, dashboardUrl }));
    return this.provider.sendEmail(to, subject, html);
  }

  async sendEmailVerification(to: string, token: string, name?: string): Promise<void> {
    const verifyLink = `${process.env.FRONTEND_URL || "http://localhost:5173"}/verify-email?token=${token}`;
    const subject = "Verify Your Thinkly Email Address";
    const html = await render(React.createElement(VerifyEmailEmail, { verifyLink, name }));
    return this.provider.sendEmail(to, subject, html);
  }

  async sendPasswordReset(to: string, token: string): Promise<void> {
    const resetLink = `${process.env.FRONTEND_URL || "http://localhost:5173"}/auth/reset-password?token=${token}`;
    const subject = "Reset Your Thinkly Password";
    const html = await render(React.createElement(ResetPasswordEmail, { resetLink }));
    return this.provider.sendEmail(to, subject, html);
  }

  async sendWeeklyQuizPromo(to: string, name: string, streakCount: number): Promise<void> {
    const subject = "🔥 Keep your study streak alive with Thinkly!";
    const quizUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/spaces`;
    const html = await render(React.createElement(WeeklyQuizPromoEmail, { name, streakCount, quizUrl }));
    return this.provider.sendEmail(to, subject, html);
  }
}

export const emailService = new EmailService();
