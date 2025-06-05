
export type TActionState = {
  error: string
  fieldErrors: {
    email?: string[]
    password?: string[]
    remember?: string[]
  }
}