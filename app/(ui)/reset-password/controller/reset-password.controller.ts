import type { TActionState } from "@/types"
import { type IPasswordResetService, PasswordResetService } from "@/services/auth/password-reset.service"
import { SResetPasswordSchemaValidator } from "@/app/(ui)/reset-password/validator/reset-password.validator"

export class ResetPasswordController {
  private passwordResetService: IPasswordResetService

  constructor(passwordResetService?: IPasswordResetService) {
    this.passwordResetService = passwordResetService || new PasswordResetService()
  }

  async resetPassword(formData: FormData): Promise<TActionState> {
    try {
      const rawData = this.extractFormData(formData)
      const validationResult = this.validateFormData(rawData)

      if (!validationResult.success) {
        return validationResult.error
      }

      return await this.passwordResetService.resetPassword(validationResult.data.token, validationResult.data.password)
    } catch (error) {
      console.error("Error in reset password controller:", error)
      return {
        error: "Internal server error",
        fieldErrors: {},
        success: false,
      }
    }
  }

  async validateToken(token: string): Promise<{ isValid: boolean; error?: string }> {
    return await this.passwordResetService.validateResetToken(token)
  }

  private extractFormData(formData: FormData) {
    return {
      token: formData.get("token"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    }
  }

  private validateFormData(
    data: any,
  ):
    | { success: true; data: { token: string; password: string; confirmPassword: string } }
    | { success: false; error: TActionState } {
    const parsedData = SResetPasswordSchemaValidator.safeParse(data)

    if (!parsedData.success) {
      return {
        success: false,
        error: {
          error: "Invalid data",
          fieldErrors: parsedData.error.flatten().fieldErrors,
          success: false,
        },
      }
    }

    return { success: true, data: parsedData.data }
  }
}
