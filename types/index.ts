import { User } from "@/lib/generated/prisma"

export type TActionState = {
  error: string
  fieldErrors: {
    name?: string[]
    email?: string[]
    password?: string[]
    confirmPassword?: string[]
  }
  success: boolean
  message?: string
}

export type ControllerResponse<T = unknown> = {
  success: boolean
  error?: string
  data?: T
  status: number
}

export type ServiceResponse<T = unknown> = {
  success: boolean
  error?: string
  data?: T
}

export type SafeUserData = Omit<User, "password">