"use client"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { SubmitButton } from "@/components/form/form-button"
import { AForgotPasswordAction } from "@/app/(ui)/forgot-password/actions/forgot-password.action"
import { useActionState, useEffect, useRef, useState } from "react"

export function FormForgotPassword() {
  const router = useRouter()
  const successToastShown = useRef(false)
  const errorToastShown = useRef(false)

  const [formData, setFormData] = useState({
    email: "",
  })

  const [state, formAction] = useActionState(AForgotPasswordAction, {
    error: "",
    fieldErrors: {},
    success: false,
    message: "",
  })

  useEffect(() => {
    if (state.success && state.message && !successToastShown.current) {
      successToastShown.current = true

      const promise = new Promise((resolve) => {
        setTimeout(() => {
          resolve("Email sent successfully!")
        }, 1000)
      })

      toast.promise(promise, {
        loading: "Sending instructions...",
        success: () => {
          return state.message
        },
      })
    }

    if (state.error && !state.success && !errorToastShown.current) {
      errorToastShown.current = true
      toast.error(state.error)
    }
  }, [state.success, state.message, state.error, router])

  useEffect(() => {
    if (!state.error && !state.success) {
      successToastShown.current = false
      errorToastShown.current = false
    }
  }, [state.error, state.success])

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <Label htmlFor="email" className="block mb-2">
          Email
        </Label>
      </div>
      <div>
        <Input
          type="email"
          name="email"
          id="email"
          placeholder="Enter your email"
          className="w-full"
          required
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
        />
        {state.fieldErrors?.email && <p className="text-red-500 text-sm mt-1">{state.fieldErrors.email[0]}</p>}
      </div>

      {state.error && <div className="text-red-500 text-sm">{state.error}</div>}

      <SubmitButton defaultMessage="Send Instructions" pendingMessage="Sending..." />
    </form>
  )
}
