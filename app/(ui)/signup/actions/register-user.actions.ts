"use server"

import { UserController } from "@/app/(ui)/signup/controller/user.controller"
import type { TActionState } from "@/app/(ui)/signup/actions/types/action-state.types"

export async function ARegisterUserAction(prevState: TActionState, formData: FormData): Promise<TActionState> {
  const userController = new UserController()
  return await userController.register(formData)
}
