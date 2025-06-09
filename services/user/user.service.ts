import * as argon2 from "argon2";
import {
  type IUserRepository,
  UserRepository,
} from "@/app/(ui)/signup/repositories/user.repository";
import type { TActionState } from "@/app/(ui)/signup/actions/types/action-state.types";
import { User } from "@/lib/generated/prisma";
import { JWTUtils } from "@/lib/auth/jwt/utils";
import {
  ITokenRepository,
  TokenRepository,
} from "@/repositories/auth/token.repository";

export interface IUserService {
  registerUser(data: {
    name: string;
    email: string;
    password: string;
  }): Promise<TActionState>;

  authenticateUser(email: string, password: string): Promise<User | null>;

  checkEmailAvailability(email: string): Promise<boolean>;
}

export class UserService implements IUserService {
  private userRepository: IUserRepository;
  private tokenRepository: ITokenRepository;

  constructor(userRepository?: IUserRepository) {
    this.userRepository = userRepository || new UserRepository();
    this.tokenRepository = new TokenRepository();
  }

  async registerUser(data: {
    name: string;
    email: string;
    password: string;
  }): Promise<TActionState> {
    try {
      const validationResult = await this.validateUserRegistration(data.email);
      if (!validationResult.isValid) {
        return validationResult.error;
      }

      const hashedPassword = await this.hashPassword(data.password);

      const newUser = await this.createUser({
        ...data,
        password: hashedPassword,
      });

      const { accessToken, refreshToken } = await JWTUtils.generateTokens({
        userId: newUser.id,
        email: newUser.email,
      });

      await this.tokenRepository.create({
        token: accessToken,
        refreshToken,
        userId: newUser.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });

      await JWTUtils.setTokenCookies(accessToken, refreshToken);

      return this.buildSuccessResponse(newUser);
    } catch (error) {
      return this.buildErrorResponse(error);
    }
  }

  private async validateUserRegistration(email: string): Promise<{
    isValid: boolean;
    error: TActionState;
  }> {
    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser) {
      return {
        isValid: false,
        error: {
          error: "Email already registered",
          fieldErrors: { email: ["Email already registered"] },
          success: false,
        },
      };
    }

    return {
      isValid: true,
      error: {
        error: "",
        fieldErrors: {},
        success: true,
        message: "User validation successfully",
      },
    };
  }

  private async hashPassword(password: string): Promise<string> {
    return await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16,
      timeCost: 3,
      parallelism: 1,
    });
  }

  private async createUser(data: {
    name: string;
    email: string;
    password: string;
  }): Promise<User> {
    const newUser = await this.userRepository.create(data);

    if (!newUser) {
      throw new Error("Falha ao criar usuário no banco de dados");
    }

    return newUser;
  }

  private buildSuccessResponse(user: User): TActionState {
    return {
      error: "",
      fieldErrors: {},
      success: true,
      message: "Created user successfully",
    };
  }

  private buildErrorResponse(error: unknown): TActionState {
    console.error("Erro no registro de usuário:", error);

    return {
      error: "Internal server error",
      fieldErrors: {},
      success: false,
    };
  }

  async authenticateUser(
    email: string,
    password: string
  ): Promise<User | null> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      return null;
    }

    const isValidPassword = await argon2.verify(user.password, password);
    return isValidPassword ? user : null;
  }

  async checkEmailAvailability(email: string): Promise<boolean> {
    const existingUser = await this.userRepository.findByEmail(email);
    return !existingUser;
  }
}
