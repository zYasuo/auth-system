import type { TActionState } from "@/types"
import { SFormRegisterSchemaValidator } from "@/app/(ui)/signup/validator/form-register.validator"
import { type IUserService, UserService } from "@/services/user/user.service"

export class SignUpController {
  private userService: IUserService

  constructor(userService?: IUserService) {
    this.userService = userService || new UserService()
  }

  async signUp(formData: FormData): Promise<TActionState> {
    try {
      const rawData = this.extractSignUpFormData(formData)

      const validationResult = this.validateSignUpFormData(rawData)
      if (!validationResult.success) {
        return validationResult.error
      }

      return await this.userService.signUpUser(validationResult.data)
    } catch (error) {
      console.error("Erro no sign up controller:", error)
      return {
        error: "Erro interno do servidor",
        fieldErrors: {},
        success: false,
      }
    }
  }

  private extractSignUpFormData(formData: FormData) {
    return {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
    }
  }

  private validateSignUpFormData(
    data: any,
  ):
    | { success: true; data: { name: string; email: string; password: string } }
    | { success: false; error: TActionState } {
    const parsedData = SFormRegisterSchemaValidator.safeParse(data)

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
