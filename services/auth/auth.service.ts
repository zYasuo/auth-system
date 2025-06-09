// services/auth.service.ts
import { TActionState } from "@/app/(ui)/signup/actions/types/action-state.types";
import {
  IUserRepository,
  UserRepository,
} from "@/app/(ui)/signup/repositories/user.repository";
import { JWTUtils } from "@/lib/auth/jwt/utils";
import {
  ITokenRepository,
  TokenRepository,
} from "@/repositories/auth/token.repository";
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
          error: "Usuário já existe",
          fieldErrors: { email: ["Email já cadastrado"] },
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

      // Verificação explícita
      if (!newUser) {
        return {
          error: "Falha ao criar usuário",
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
        message: "Conta criada com sucesso!",
      };
    } catch (error) {
      console.error("Erro no registro:", error);
      return {
        error: "Erro interno do servidor",
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
          error: "Credenciais inválidas",
          fieldErrors: { email: ["Email ou senha incorretos"] },
          success: false,
        };
      }

      const isValidPassword = await argon2.verify(user.password, data.password);

      if (!isValidPassword) {
        return {
          error: "Credenciais inválidas",
          fieldErrors: { password: ["Email ou senha incorretos"] },
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
        message: "Login realizado com sucesso!",
      };
    } catch (error) {
      console.error("Erro no login:", error);
      return {
        error: "Erro interno do servidor",
        fieldErrors: {},
        success: false,
      };
    }
  }

  async logoutUser(): Promise<TActionState> {
    try {
      const { refreshToken } = await JWTUtils.getTokensFromCookies();

      if (refreshToken) {
        const tokenRecord = await this.tokenRepository.findByRefreshToken(
          refreshToken
        );
        if (tokenRecord) {
          await this.tokenRepository.deleteByUserId(tokenRecord.userId);
        }
      }

      await JWTUtils.clearTokenCookies();

      return {
        error: "",
        fieldErrors: {},
        success: true,
        message: "Logout realizado com sucesso!",
      };
    } catch (error) {
      console.error("Erro no logout:", error);
      return {
        error: "Erro interno do servidor",
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
          error: "Token inválido",
          fieldErrors: {},
          success: false,
        };
      }

      const tokenRecord = await this.tokenRepository.findByRefreshToken(
        refreshToken
      );

      if (!tokenRecord) {
        return {
          error: "Token não encontrado",
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
        message: "Token renovado com sucesso!",
      };
    } catch (error) {
      console.error("Erro ao renovar token:", error);
      return {
        error: "Erro interno do servidor",
        fieldErrors: {},
        success: false,
      };
    }
  }
}
