export type BaseFormDataInput = Record<string, FormDataEntryValue | null>

export type SignUpFormDataInput = {
  name: FormDataEntryValue | null
  email: FormDataEntryValue | null
  password: FormDataEntryValue | null
}

export type LoginFormDataInput = {
  email: FormDataEntryValue | null
  password: FormDataEntryValue | null
}

export type ForgotPasswordFormDataInput = {
  email: FormDataEntryValue | null
}

export type TActionState = {
  message: string
  severity: "success" | "error" | "info" | "warning"
}

export type ValidationResult<T> = { success: true; data: T } | { success: false; error: TActionState }
