"use client"
import { Input } from "@/components/ui/input"
import { ALoginAction } from "@/app/(ui)/signin/actions/auth.actions"
import { SubmitButton } from "@/components/form/form-button";
import { useActionState } from "react"

export function FormLogin() {
  const [state, formAction] = useActionState(ALoginAction, {
    error: "",
    fieldErrors: {},
  })

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <Input type="email" name="email" placeholder="Email" className="w-full" required />
        {state.fieldErrors.email && <p className="text-red-500 text-sm mt-1">{state.fieldErrors.email[0]}</p>}
      </div>

      <div>
        <Input type="password" name="password" placeholder="Password" className="w-full" required />
        {state.fieldErrors.password && <p className="text-red-500 text-sm mt-1">{state.fieldErrors.password[0]}</p>}
      </div>

      {state.error && <div className="text-red-500 text-sm">{state.error}</div>}

      <SubmitButton defaultMessage="Sign In" pendingMessage="Signing in..." />
    </form>
  )
}
