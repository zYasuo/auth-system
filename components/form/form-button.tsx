import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";

interface FormLoginButtonProps {
  pendingMessage: string;
  defaultMessage: string;
}

export function SubmitButton({ pendingMessage, defaultMessage }: FormLoginButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? pendingMessage : defaultMessage}
    </Button>
  );
}
