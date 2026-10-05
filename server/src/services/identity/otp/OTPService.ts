import crypto from "crypto";
import bcrypt from "bcryptjs";
import OTPModel from "../../../models/OTP.js";
import { OTPType } from "@thinkly/shared";
import { emailService } from "../../email/EmailService.js";
import { AppError } from "../../../utils/AppError.js";

const EXPIRY_MINUTES = 10;
const MAX_ATTEMPTS = 5;

const getPurposeLabel = (type: OTPType): string => {
  switch (type) {
    case OTPType.EMAIL_VERIFICATION:
      return "Email Registration";
    case OTPType.PASSWORD_RESET:
      return "Password Reset";
    case OTPType.SECURITY_ACTION:
      return "Account Security";
    default:
      return "Verification";
  }
};

export class OTPService {
  static async generateAndSendOTP(email: string, type: OTPType): Promise<void> {
    const normalizedEmail = email.toLowerCase().trim();

    // 1. Generate 6-digit numeric OTP code
    const rawCode = crypto.randomInt(100000, 999999).toString();

    // 2. Hash code for secure DB storage
    const salt = await bcrypt.genSalt(10);
    const hashedCode = await bcrypt.hash(rawCode, salt);

    // 3. Remove existing active OTPs for this email and type
    await OTPModel.deleteMany({ email: normalizedEmail, type });

    // 4. Store new OTP with 10-minute expiration
    const expiresAt = new Date(Date.now() + EXPIRY_MINUTES * 60 * 1000);
    await OTPModel.create({
      email: normalizedEmail,
      code: hashedCode,
      type,
      attempts: 0,
      expiresAt,
    });

    // 5. Send Email
    const purposeLabel = getPurposeLabel(type);
    await emailService.sendOTPEmail(normalizedEmail, rawCode, purposeLabel);
  }

  static async verifyOTP(email: string, code: string, type: OTPType): Promise<boolean> {
    const normalizedEmail = email.toLowerCase().trim();

    const otpRecord = await OTPModel.findOne({
      email: normalizedEmail,
      type,
      expiresAt: { $gt: new Date() },
    });

    if (!otpRecord) {
      throw new AppError("Invalid or expired verification code", 400);
    }

    if (otpRecord.attempts >= MAX_ATTEMPTS) {
      await OTPModel.deleteOne({ _id: otpRecord._id });
      throw new AppError("Maximum verification attempts exceeded. Please request a new code.", 400);
    }

    const isMatch = await bcrypt.compare(code, otpRecord.code);

    if (!isMatch) {
      otpRecord.attempts += 1;
      await otpRecord.save();
      throw new AppError("Invalid verification code", 400);
    }

    // Code verified successfully -> Consume OTP
    await OTPModel.deleteOne({ _id: otpRecord._id });
    return true;
  }
}
