"use client";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { EyeOff, Eye } from "lucide-react";
import { SubmitButton } from "@/components/form/form-button";
import { ARegisterUserAction } from "@/app/(ui)/signup/actions/register-user.actions";
import { useActionState, useEffect, useRef, useState } from "react";

export function FormRegister() {
  const router = useRouter();
  const successToastShown = useRef(false);
  const errorToastShown = useRef(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const [state, formAction] = useActionState(ARegisterUserAction, {
    error: "",
    fieldErrors: {},
    success: false,
  });

  useEffect(() => {
    if (state.success && state.message && !successToastShown.current) {
      successToastShown.current = true;

      toast.loading("Redirecionando para o login...");

      setTimeout(() => {
        router.push("/signin");
      }, 2000);
    }

    if (state.error && !state.success && !errorToastShown.current) {
      errorToastShown.current = true;
      toast.error(state.error);
    }
  }, [state.success, state.message, state.error, router]);

  useEffect(() => {
    if (!state.error && !state.success) {
      successToastShown.current = false;
      errorToastShown.current = false;
    }
  }, [state.error, state.success]);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form action={formAction} className="space-y-6 mb-4">
      <div>
        <Label htmlFor="name" className="block mb-4">
          Name
        </Label>
        <Input
          type="text"
          name="name"
          placeholder="Name"
          className="w-full"
          required
          value={formData.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
        />
        {state.fieldErrors.name && (
          <p className="text-red-500 text-sm mt-1">
            {state.fieldErrors.name[0]}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="email" className="block mb-4">
          Email
        </Label>
        <Input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full"
          required
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
        />
        {state.fieldErrors.email && (
          <p className="text-red-500 text-sm mt-1">
            {state.fieldErrors.email[0]}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="password" className="block mb-4">
          Password
        </Label>
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            className="w-full"
            required
            value={formData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            autoComplete="new-password"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 " />
            ) : (
              <Eye className="h-4 w-4 " />
            )}
          </button>
          {state.fieldErrors.password && (
            <p className="text-red-500 text-sm mt-1">
              {state.fieldErrors.password[0]}
            </p>
          )}
        </div>
      </div>

      <SubmitButton defaultMessage="Sign Up" pendingMessage="Signing Up..." />
    </form>
  );
}
