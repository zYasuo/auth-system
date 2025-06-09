"use server";
import type { TActionState } from "@/types/action-state.types";
import { SignUpController } from "@/app/(ui)/signup/controller/signup.controller";

export async function ARegisterUserAction(
  prevState: TActionState,
  formData: FormData
): Promise<TActionState> {
  const userController = new SignUpController();
  return await userController.signUp(formData);
}
