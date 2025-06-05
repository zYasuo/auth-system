"use server"
import { redirect } from "next/navigation"
import { SSigninSchema } from "@/app/(ui)/signin/validator/form-login.validator"
import { TActionState } from "@/app/(ui)/signin/actions/types/action-state.types"

export async function ALoginAction(prevState: TActionState, data: FormData): Promise<TActionState> {
  const formData = {
    email: data.get("email"),
    password: data.get("password"),
    remember: data.get("remember") === "on" ? true : false,
  }

  const parsedData = SSigninSchema.safeParse(formData)

  if (!parsedData.success) {
    return {
      error: "Dados inválidos",
      fieldErrors: parsedData.error.flatten().fieldErrors,
    }
  }

  const { email, password } = parsedData.data

  if (email === "admin@gmail.com" && password === "admin") {
    redirect("/user")
  }

  return {
    error: "Email ou senha inválidos",
    fieldErrors: {},
  }
}
