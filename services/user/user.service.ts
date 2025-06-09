import * as argon2 from "argon2"
import { JWTUtils } from "@/lib/auth/jwt/utils"
import type { User } from "@/lib/generated/prisma"
import type { TActionState } from "@/types"
import { type IUserRepository, UserRepository } from "@/repositories/user/user.repository"
import { type ITokenRepository, TokenRepository } from "@/repositories/token/token.repository"

export interface IUserService {
  signUpUser(data: {
    name: string
    email: string
    password: string
  }): Promise<TActionState>

  signInUser(email: string, password: string): Promise<TActionState>
  
}

export class UserService implements IUserService {
  private userRepository: IUserRepository
  private tokenRepository: ITokenRepository

  constructor(userRepository?: IUserRepository) {
    this.userRepository = userRepository || new UserRepository()
    this.tokenRepository = new TokenRepository()
  }

  async signUpUser(data: {
    name: string
    email: string
    password: string
  }): Promise<TActionState> {
    try {
      const validationResult = await this.validateUserRegistration(data.email)
      if (!validationResult.isValid) {
        return validationResult.error
      }

      const hashedPassword = await this.hashPassword(data.password)

      const newUser = await this.createUser({
        ...data,
        password: hashedPassword,
      })

      const { accessToken, refreshToken } = await JWTUtils.generateTokens({
        userId: newUser.id,
        email: newUser.email,
      })

      await this.tokenRepository.create({
        token: accessToken,
        refreshToken,
        userId: newUser.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      })

      await JWTUtils.setTokenCookies(accessToken, refreshToken)

      return this.buildSuccessResponse(newUser, "User created successfully")
    } catch (error) {
      return this.buildErrorResponse(error)
    }
  }

  async signInUser(email: string, password: string): Promise<TActionState> {
    try {
      const user = await this.userRepository.findByEmail(email)

      if (!user) {
        return {
          error: "Invalid email or password",
          fieldErrors: { email: ["Invalid email or password"] },
          success: false,
        }
      }

      const isPasswordValid = await argon2.verify(user.password, password)
      if (!isPasswordValid) {
        return {
          error: "Invalid email or password",
          fieldErrors: { password: ["Invalid email or password"] },
          success: false,
        }
      }

      const { accessToken, refreshToken } = await JWTUtils.generateTokens({
        userId: user.id,
        email: user.email,
      })

      await this.tokenRepository.create({
        token: accessToken,
        refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      })

      await JWTUtils.setTokenCookies(accessToken, refreshToken)

      return {
        error: "",
        fieldErrors: {},
        success: true,
        message: "Signed in successfully",
      }
    } catch (error) {
      return this.buildErrorResponse(error)
    }
  }

  private async validateUserRegistration(email: string): Promise<{
    isValid: boolean
    error: TActionState
  }> {
    const existingUser = await this.userRepository.findByEmail(email)

    if (existingUser) {
      return {
        isValid: false,
        error: {
          error: "Email already registered",
          fieldErrors: { email: ["Email already registered"] },
          success: false,
        },
      }
    }

    return {
      isValid: true,
      error: {
        error: "",
        fieldErrors: {},
        success: true,
        message: "User validation successfully",
      },
    }
  }

  private async hashPassword(password: string): Promise<string> {
    return await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16,
      timeCost: 3,
      parallelism: 1,
    })
  }

  private async createUser(data: {
    name: string
    email: string
    password: string
  }): Promise<User> {
    const newUser = await this.userRepository.create(data)

    if (!newUser) {
      throw new Error("Falha ao criar usuário no banco de dados")
    }

    return newUser
  }

  private buildSuccessResponse(user: User, message: string): TActionState {
    return {
      error: "",
      fieldErrors: {},
      success: true,
      message,
    }
  }

  private buildErrorResponse(error: unknown): TActionState {
    console.error("Erro no serviço de usuário:", error)

    return {
      error: "Internal server error",
      fieldErrors: {},
      success: false,
    }
  }
}
