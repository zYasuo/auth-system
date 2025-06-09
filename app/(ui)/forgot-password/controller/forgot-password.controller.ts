import type { TActionState } from "@/types";
import { SForgotPasswordSchemaValidator } from "@/app/(ui)/forgot-password/validator/forgot-password.validator";
import {
  type IPasswordResetService,
  PasswordResetService,
} from "@/services/auth/password-reset.service";

export class ForgotPasswordController {
  private passwordResetService: IPasswordResetService;

  constructor(passwordResetService?: IPasswordResetService) {
    this.passwordResetService =
      passwordResetService || new PasswordResetService();
  }

  async requestPasswordReset(formData: FormData): Promise<TActionState> {
    try {
      const rawData = this.extractFormData(formData);
      const validationResult = this.validateFormData(rawData);

      if (!validationResult.success) {
        return validationResult.error;
      }

      return await this.passwordResetService.requestPasswordReset(
        validationResult.data.email
      );
    } catch (error) {
      console.error("Error in forgot password controller:", error);
      return {
        error: "Internal server error",
        fieldErrors: {},
        success: false,
      };
    }
  }

  private extractFormData(formData: FormData) {
    return {
      email: formData.get("email") as string,
    };
  }

  private validateFormData(data: {
    email: string;
  }):
    | { success: true; data: { email: string } }
    | { success: false; error: TActionState } {
    const parsedData = SForgotPasswordSchemaValidator.safeParse(data);

    if (!parsedData.success) {
      return {
        success: false,
        error: {
          error: "Invalid data",
          fieldErrors: parsedData.error.flatten().fieldErrors,
          success: false,
        },
      };
    }

    return { success: true, data: parsedData.data };
  }
}
