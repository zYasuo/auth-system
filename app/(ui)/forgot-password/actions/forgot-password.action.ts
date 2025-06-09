"use server"
import type { TActionState } from "@/types"
import { ForgotPasswordController } from "@/app/(ui)/forgot-password/controller/forgot-password.controller"

export async function AForgotPasswordAction(prevState: TActionState, formData: FormData): Promise<TActionState> {
  const controller = new ForgotPasswordController()
  return await controller.requestPasswordReset(formData)
}
