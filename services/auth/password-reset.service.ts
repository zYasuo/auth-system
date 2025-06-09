import * as argon2 from "argon2";
import { randomBytes } from "crypto";
import type { TActionState } from "@/types";
import {
  type IUserRepository,
  UserRepository,
} from "@/repositories/user/user.repository";
import {
  IPasswordResetTokenRepository,
  PasswordResetTokenRepository,
} from "@/repositories/token/password-reset-token.repository";
import { getPasswordResetEmailTemplate } from "@/lib/email/templates/password-reset.template";
import { sendEmail } from "@/lib/email/resend/resend-client";

export interface IPasswordResetService {
  requestPasswordReset(email: string): Promise<TActionState>;
  resetPassword(token: string, newPassword: string): Promise<TActionState>;
  validateResetToken(
    token: string
  ): Promise<{ isValid: boolean; error?: string }>;
}

export class PasswordResetService implements IPasswordResetService {
  private userRepository: IUserRepository;
  private passwordResetTokenRepository: IPasswordResetTokenRepository;

  constructor(
    userRepository?: IUserRepository,
    passwordResetTokenRepository?: IPasswordResetTokenRepository
  ) {
    this.userRepository = userRepository || new UserRepository();
    this.passwordResetTokenRepository =
      passwordResetTokenRepository || new PasswordResetTokenRepository();
  }

  async requestPasswordReset(email: string): Promise<TActionState> {
    try {
      await this.passwordResetTokenRepository.deleteExpiredTokens();

      const user = await this.userRepository.findByEmail(email);

      if (!user) {
        return {
          error: "",
          fieldErrors: {},
          success: true,
          message:
            "If your email exists in our database, you will receive password reset instructions.",
        };
      }

      await this.passwordResetTokenRepository.deleteByUserId(user.id);
      const resetToken = this.generateResetToken();
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      await this.passwordResetTokenRepository.create({
        token: resetToken,
        email: user.email,
        userId: user.id,
        expiresAt,
      });

      // Send email
      const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;
      const emailTemplate = getPasswordResetEmailTemplate(
        resetUrl,
        user.name || undefined
      );

      const emailResult = await sendEmail({
        to: user.email,
        subject: "Reset your password",
        html: emailTemplate,
      });

      if (!emailResult.success) {
        console.error("Error sending email:", emailResult.error);
        return {
          error: "Error sending email. Please try again later.",
          fieldErrors: {},
          success: false,
        };
      }

      return {
        error: "",
        fieldErrors: {},
        success: true,
        message:
          "If your email exists in our database, you will receive password reset instructions.",
      };
    } catch (error) {
      console.error("Error requesting password reset:", error);
      return {
        error: "Internal server error. Please try again later.",
        fieldErrors: {},
        success: false,
      };
    }
  }

  async validateResetToken(
    token: string
  ): Promise<{ isValid: boolean; error?: string }> {
    try {
      const resetToken =
        await this.passwordResetTokenRepository.findByToken(token);

      if (!resetToken) {
        return { isValid: false, error: "Invalid or expired token." };
      }

      if (resetToken.used) {
        return { isValid: false, error: "This token has already been used." };
      }

      if (resetToken.expiresAt < new Date()) {
        return {
          isValid: false,
          error: "Token expired. Please request a new password reset.",
        };
      }

      return { isValid: true };
    } catch (error) {
      console.error("Error validating token:", error);
      return { isValid: false, error: "Internal server error." };
    }
  }

  async resetPassword(
    token: string,
    newPassword: string
  ): Promise<TActionState> {
    try {
      const validation = await this.validateResetToken(token);
      if (!validation.isValid) {
        return {
          error: validation.error || "Invalid token",
          fieldErrors: {},
          success: false,
        };
      }

      const resetToken =
        await this.passwordResetTokenRepository.findByToken(token);
      if (!resetToken) {
        return {
          error: "Token not found",
          fieldErrors: {},
          success: false,
        };
      }

      const hashedPassword = await argon2.hash(newPassword, {
        type: argon2.argon2id,
        memoryCost: 2 ** 16,
        timeCost: 3,
        parallelism: 1,
      });

      await this.userRepository.updatePassword(
        resetToken.userId,
        hashedPassword
      );
      await this.passwordResetTokenRepository.markAsUsed(resetToken.id);
      await this.passwordResetTokenRepository.deleteByUserId(resetToken.userId);

      return {
        error: "",
        fieldErrors: {},
        success: true,
        message:
          "Password reset successfully! You can now log in with your new password.",
      };
    } catch (error) {
      console.error("Error resetting password:", error);
      return {
        error: "Internal server error. Please try again later.",
        fieldErrors: {},
        success: false,
      };
    }
  }

  private generateResetToken(): string {
    return randomBytes(32).toString("hex");
  }
}
