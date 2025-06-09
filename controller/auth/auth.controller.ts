import { JWTUtils } from "@/lib/auth/jwt/utils"
import { IUserRepository, UserRepository } from "@/repositories/user/user.repository"
import { AuthService, IAuthService } from "@/services/auth/auth.service"
import { ControllerResponse, SafeUserData } from "@/types"

export class AuthController {
  private authService: IAuthService

  constructor(authService?: IAuthService) {
    this.authService = authService || new AuthService()
  }

  async getCurrentUser(accessToken?: string): Promise<ControllerResponse<SafeUserData>> {
    try {
      if (!accessToken) {
        return { success: false, error: "Token not provided", status: 401 }
      }

      const result = await this.authService.getCurrentUser(accessToken)

      if (!result.success) {
        return {
          success: false,
          error: result.error,
          status: result.error === "Invalid token" ? 401 : 404,
        }
      }

      return {
        success: true,
        data: result.data,
        status: 200,
      }
    } catch (error) {
      console.error("Error in getCurrentUser controller:", error)
      return {
        success: false,
        error: "Internal server error",
        status: 500,
      }
    }
  }

  async isAuthenticated(accessToken?: string): Promise<boolean> {
    const result = await this.getCurrentUser(accessToken)
    return result.success
  }
}