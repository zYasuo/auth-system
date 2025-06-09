import type { Metadata } from "next"
import ResetPasswordClient from "@/app/(ui)/reset-password/components/reset-password-client"

export const metadata: Metadata = {
  title: "Reset Password",
  keywords: ["Next.js", "Password Reset", "Authentication"],
  description: "Create a new password for your account.",
}

export default function ResetPasswordPage() {
  return <ResetPasswordClient />
}