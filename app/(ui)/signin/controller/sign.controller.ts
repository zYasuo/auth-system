import { SSigninSchemaValidator } from "@/app/(ui)/signin/validator/form-login.validator"
import type { TActionState } from "@/types/action-state.types"
import { type IUserService, UserService } from "@/services/user/user.service"

export class SignController {
  private userService: IUserService

  constructor(userService?: IUserService) {
    this.userService = userService || new UserService()
  }

  async signIn(formData: FormData): Promise<TActionState> {
    try {
      const rawData = this.extractSignInFormData(formData)

      const validationResult = this.validateSignInFormData(rawData)
      if (!validationResult.success) {
        return validationResult.error
      }

      return await this.userService.signInUser(validationResult.data.email, validationResult.data.password)
    } catch (error) {
      console.error("Erro no sign in controller:", error)
      return {
        error: "Erro interno do servidor",
        fieldErrors: {},
        success: false,
      }
    }
  }

  private extractSignInFormData(formData: FormData) {
    return {
      email: formData.get("email"),
      password: formData.get("password"),
    }
  }

  private validateSignInFormData(
    data: any,
  ): { success: true; data: { email: string; password: string } } | { success: false; error: TActionState } {
    const parsedData = SSigninSchemaValidator.safeParse(data)

    if (!parsedData.success) {
      return {
        success: false,
        error: {
          error: "Dados inválidos",
          fieldErrors: parsedData.error.flatten().fieldErrors,
          success: false,
        },
      }
    }

    return { success: true, data: parsedData.data }
  }
}
