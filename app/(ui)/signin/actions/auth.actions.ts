"use server"
import { SignController } from "@/app/(ui)/signin/controller/sign.controller"
import { TActionState } from "@/types"

export async function ALoginAction(prevState: TActionState, formData: FormData) {
  const userController = new SignController()
  return await userController.signIn(formData)
}
