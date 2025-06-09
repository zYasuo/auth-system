
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