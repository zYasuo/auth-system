import { Button } from "@/components/ui/button"
import { useFormStatus } from "react-dom"

export function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" className="w-full text-white" disabled={pending}>
      {pending ? "Signing in..." : "Sign In"}
    </Button>
  )
}