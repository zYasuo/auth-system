import type { TActionState } from "@/app/(ui)/signup/actions/types/action-state.types";
import { SFormRegisterValidator } from "@/app/(ui)/signup/validator/form-register.validator";
import { IUserService, UserService } from "@/services/user/user.service";

export class UserController {
  private userService: IUserService;

  constructor(userService?: IUserService) {
    this.userService = userService || new UserService();
  }

  async register(formData: FormData): Promise<TActionState> {
    try {
      const rawData = this.extractFormData(formData);

      const validationResult = this.validateFormData(rawData);
      if (!validationResult.success) {
        return validationResult.error;
      }

      return await this.userService.registerUser(validationResult.data);
    } catch (error) {
      console.error("Erro no controller:", error);
      return {
        error: "Erro interno do servidor",
        fieldErrors: {},
        success: false,
      };
    }
  }

  private extractFormData(formData: FormData) {
    return {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
    };
  }

  private validateFormData(
    data: any
  ):
    | { success: true; data: { name: string; email: string; password: string } }
    | { success: false; error: TActionState } {
    const parsedData = SFormRegisterValidator.safeParse(data);

    if (!parsedData.success) {
      return {
        success: false,
        error: {
          error: "Dados inválidos",
          fieldErrors: parsedData.error.flatten().fieldErrors,
          success: false,
        },
      };
    }

    return { success: true, data: parsedData.data };
  }
}
