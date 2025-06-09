"use server"
import type { TActionState } from "@/types/action-state.types"
import { ResetPasswordController } from "@/app/(ui)/reset-password/controller/reset-password.controller"

export async function AResetPasswordAction(prevState: TActionState, formData: FormData): Promise<TActionState> {
  const controller = new ResetPasswordController()
  return await controller.resetPassword(formData)
}

export async function AValidateTokenAction(token: string): Promise<{ isValid: boolean; error?: string }> {
  const controller = new ResetPasswordController()
  return await controller.validateToken(token)
}
