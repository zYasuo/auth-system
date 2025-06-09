import { UserService } from "@/app/(ui)/signup/services/user.service"
import type { TActionState } from "@/app/(ui)/signup/actions/types/action-state.types"
import { SFormRegisterValidator } from "@/app/(ui)/signup/validator/form-register.validator"

export class UserController {
  private userService: UserService

  constructor(userService?: UserService) {
    this.userService = userService || new UserService()
  }

  async register(formData: FormData): Promise<TActionState> {
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
    }

    const parsedData = SFormRegisterValidator.safeParse(data)
    if (!parsedData.success) {
      return {
        error: "Dados inválidos",
        fieldErrors: parsedData.error.flatten().fieldErrors,
        success: false,
      }
    }

    return await this.userService.registerUser(parsedData.data)
  }
}
