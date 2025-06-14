// services/auth.service.ts
import type { SafeUserData, ServiceResponse, TActionState } from "@/types";
import {
  type IUserRepository,
  UserRepository,
} from "@/repositories/user/user.repository";
import { JWTUtils } from "@/lib/auth/jwt/utils";
import {
  type ITokenRepository,
  TokenRepository,
} from "@/repositories/token/token.repository";
import * as argon2 from "argon2";

export interface IAuthService {
  registerUser(data: {
    name: string;
    email: string;
    password: string;
  }): Promise<TActionState>;
  loginUser(data: { email: string; password: string }): Promise<TActionState>;
  logoutUser(): Promise<TActionState>;
  refreshToken(refreshToken: string): Promise<TActionState>;
    getCurrentUser(accessToken: string): Promise<ServiceResponse<SafeUserData>>

}

export class AuthService implements IAuthService {
  private userRepository: IUserRepository;
  private tokenRepository: ITokenRepository;

  constructor(
    userRepository?: IUserRepository,
    tokenRepository?: ITokenRepository
  ) {
    this.userRepository = userRepository || new UserRepository();
    this.tokenRepository = tokenRepository || new TokenRepository();
  }

  async registerUser(data: {
    name: string;
    email: string;
    password: string;
  }): Promise<TActionState> {
    try {
      const existingUser = await this.userRepository.findByEmail(data.email);

      if (existingUser) {
        return {
          error: "User already exists",
          fieldErrors: { email: ["Email already registered"] },
          success: false,
        };
      }

      const hashedPassword = await argon2.hash(data.password, {
        type: argon2.argon2id,
        memoryCost: 2 ** 16,
        timeCost: 3,
        parallelism: 1,
      });

      const newUser = await this.userRepository.create({
        name: data.name,
        email: data.email,
        password: hashedPassword,
      });

      if (!newUser) {
        return {
          error: "Failed to create user",
          fieldErrors: {},
          success: false,
        };
      }

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

      return {
        error: "",
        fieldErrors: {},
        success: true,
        message: "Account created successfully!",
      };
    } catch (error) {
      console.error("Registration error:", error);
      return {
        error: "Internal server error",
        fieldErrors: {},
        success: false,
      };
    }
  }

  async loginUser(data: {
    email: string;
    password: string;
  }): Promise<TActionState> {
    try {
      const user = await this.userRepository.findByEmail(data.email);

      if (!user) {
        return {
          error: "Invalid credentials",
          fieldErrors: { email: ["Invalid email or password"] },
          success: false,
        };
      }

      const isValidPassword = await argon2.verify(user.password, data.password);

      if (!isValidPassword) {
        return {
          error: "Invalid credentials",
          fieldErrors: { password: ["Invalid email or password"] },
          success: false,
        };
      }

      await this.tokenRepository.deleteByUserId(user.id);

      const { accessToken, refreshToken } = await JWTUtils.generateTokens({
        userId: user.id,
        email: user.email,
      });

      await this.tokenRepository.create({
        token: accessToken,
        refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });

      await JWTUtils.setTokenCookies(accessToken, refreshToken);

      return {
        error: "",
        fieldErrors: {},
        success: true,
        message: "Login successful!",
      };
    } catch (error) {
      console.error("Login error:", error);
      return {
        error: "Internal server error",
        fieldErrors: {},
        success: false,
      };
    }
  }

  async logoutUser(): Promise<TActionState> {
    try {
      const { refreshToken } = await JWTUtils.getTokensFromCookies();

      if (refreshToken) {
        const tokenRecord =
          await this.tokenRepository.findByRefreshToken(refreshToken);
        if (tokenRecord) {
          await this.tokenRepository.deleteByUserId(tokenRecord.userId);
        }
      }

      await JWTUtils.clearTokenCookies();

      return {
        error: "",
        fieldErrors: {},
        success: true,
        message: "Logout successful!",
      };
    } catch (error) {
      console.error("Logout error:", error);
      return {
        error: "Internal server error",
        fieldErrors: {},
        success: false,
      };
    }
  }

  async refreshToken(refreshToken: string): Promise<TActionState> {
    try {
      const payload = await JWTUtils.verifyRefreshToken(refreshToken);

      if (!payload) {
        return {
          error: "Invalid token",
          fieldErrors: {},
          success: false,
        };
      }

      const tokenRecord =
        await this.tokenRepository.findByRefreshToken(refreshToken);

      if (!tokenRecord) {
        return {
          error: "Token not found",
          fieldErrors: {},
          success: false,
        };
      }

      const { accessToken, refreshToken: newRefreshToken } =
        await JWTUtils.generateTokens({
          userId: payload.userId,
          email: payload.email,
        });

      await this.tokenRepository.deleteByUserId(payload.userId);

      await this.tokenRepository.create({
        token: accessToken,
        refreshToken: newRefreshToken,
        userId: payload.userId,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });

      await JWTUtils.setTokenCookies(accessToken, newRefreshToken);

      return {
        error: "",
        fieldErrors: {},
        success: true,
        message: "Token refreshed successfully!",
      };
    } catch (error) {
      console.error("Token refresh error:", error);
      return {
        error: "Internal server error",
        fieldErrors: {},
        success: false,
      };
    }
  }

  async getCurrentUser(accessToken: string): Promise<ServiceResponse<SafeUserData>> {
    try {
      const payload = await JWTUtils.verifyAccessToken(accessToken)

      if (!payload) {
        return { success: false, error: "Invalid token" }
      }

      const user = await this.userRepository.findById(payload.userId)

      if (!user) {
        return { success: false, error: "User not found" }
      }

      const { password, ...safeUserData } = user

      return {
        success: true,
        data: safeUserData,
      }
    } catch (error) {
      console.error("Error in getCurrentUser service:", error)
      return { success: false, error: "Internal server error" }
    }
  }
}
