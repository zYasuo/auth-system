"use client";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { EyeOff, Eye } from "lucide-react";
import { ALoginAction } from "@/app/(ui)/signin/actions/auth.actions";
import { SubmitButton } from "@/components/form/form-button";
import { useActionState, useEffect, useRef, useState } from "react";
import { Label } from "@/components/ui/label";

export function FormLogin() {
  const router = useRouter();
  const successToastShown = useRef(false);
  const errorToastShown = useRef(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const [state, formAction] = useActionState(ALoginAction, {
    error: "",
    fieldErrors: {},
    success: false,
  });

  useEffect(() => {
    if (state.success && state.message && !successToastShown.current) {
      successToastShown.current = true;

      const promise = new Promise((resolve) => {
        setTimeout(() => {
          resolve("Successfully signed in!");
        }, 1000);
      });

      toast.promise(promise, {
        loading: "Signing in...",
        success: () => {
          router.push("/user");
          return state.message;
        },
      });
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
        <div className="flex items-center mb-2">
          <Label htmlFor="password">Password</Label>
          <a
            href="/forgot-password"
            className="ml-auto text-sm underline-offset-4 hover:underline"
          >
            Forgot your password?
          </a>
        </div>

        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            name="password"
            id="password"
            placeholder="Password"
            className="w-full pr-10"
            required
            value={formData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-gray-500 hover:text-gray-700" />
            ) : (
              <Eye className="h-4 w-4 text-gray-500 hover:text-gray-700" />
            )}
          </button>
        </div>
        {state.fieldErrors.password && (
          <p className="text-red-500 text-sm mt-1">
            {state.fieldErrors.password[0]}
          </p>
        )}
      </div>

      {state.error && <div className="text-red-500 text-sm">{state.error}</div>}

      <SubmitButton defaultMessage="Sign In" pendingMessage="Signing in..." />
    </form>
  );
}
