import { Resend } from "resend"

if (!process.env.RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY is not defined")
}

export const resend = new Resend(process.env.RESEND_API_KEY)

export interface EmailOptions {
  to: string
  subject: string
  html: string
  from?: string
}

export async function sendEmail({ to, subject, html, from }: EmailOptions) {
  try {
    const result = await resend.emails.send({
      from: from || process.env.RESEND_FROM_EMAIL || "noreply@yourdomain.com",
      to,
      subject,
      html,
    })

    return { success: true, data: result }
  } catch (error) {
    console.error("Erro ao enviar email:", error)
    return { success: false, error }
  }
}
