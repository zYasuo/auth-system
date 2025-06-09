import * as argon2 from "argon2"
import { type IUserRepository, UserRepository } from "@/app/(ui)/signup/repositories/user.repository"
import type { TActionState } from "@/app/(ui)/signup/actions/types/action-state.types"

export class UserService {
  private userRepository: IUserRepository

  constructor(userRepository?: IUserRepository) {
    this.userRepository = userRepository || new UserRepository()
  }

  async registerUser(data: { name: string; email: string; password: string }): Promise<TActionState> {
    try {
      // Check if user already exists
      const existingUser = await this.userRepository.findByEmail(data.email)

      if (existingUser) {
        return {
          error: "Usuário já existe",
          fieldErrors: { email: ["Email já cadastrado"] },
          success: false,
        }
      }

      // Hash the password
      const hashedPassword = await argon2.hash(data.password, {
        type: argon2.argon2id,
        memoryCost: 2 ** 16,
        timeCost: 3,
        parallelism: 1,
      })

      // Create new user
      const newUser = await this.userRepository.create({
        name: data.name,
        email: data.email,
        password: hashedPassword,
      })

      if (!newUser) {
        return {
          error: "Erro ao criar usuário",
          fieldErrors: {},
          success: false,
        }
      }

      return {
        error: "",
        fieldErrors: {},
        success: true,
        message: "Conta criada com sucesso! Redirecionando...",
      }
    } catch (error) {
      return {
        error: "Erro interno do servidor",
        fieldErrors: {},
        success: false,
      }
    }
  }
}
