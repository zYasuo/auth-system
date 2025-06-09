"use client";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { EyeOff, Eye } from "lucide-react";
import {
  AResetPasswordAction,
  AValidateTokenAction,
} from "@/app/(ui)/reset-password/actions/reset-password.action";
import { SubmitButton } from "@/components/form/form-button";
import { useActionState, useEffect, useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { PasswordRequirements } from "@/components/form/password-requirements";

interface FormResetPasswordProps {
  token: string | null;
}

export function FormResetPassword({ token }: FormResetPasswordProps) {
  const router = useRouter();

  const successToastShown = useRef(false);
  const errorToastShown = useRef(false);
  const tokenValidated = useRef(false);

  const [tokenValidation, setTokenValidation] = useState<{
    isValid: boolean;
    error?: string;
    loading: boolean;
  }>({
    isValid: false,
    loading: true,
  });

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [state, formAction] = useActionState(AResetPasswordAction, {
    error: "",
    fieldErrors: {},
    success: false,
    message: "",
  });

  useEffect(() => {
    if (!token) {
      setTokenValidation({
        isValid: false,
        error: "Token not provided",
        loading: false,
      });
      return;
    }

    if (!tokenValidated.current) {
      tokenValidated.current = true;
      AValidateTokenAction(token).then((result) => {
        setTokenValidation({ ...result, loading: false });
        if (!result.isValid && result.error) {
          toast.error(result.error);
        }
      });
    }
  }, [token]);

  useEffect(() => {
    if (state.success && state.message && !successToastShown.current) {
      successToastShown.current = true;

      const promise = new Promise((resolve) => {
        setTimeout(() => {
          resolve("Password reset successfully!");
        }, 1000);
      });

      toast.promise(promise, {
        loading: "Resetting password...",
        success: () => {
          router.push("/signin");
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

  if (tokenValidation.loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-3">Validating token...</span>
      </div>
    );
  }

  if (!tokenValidation.isValid) {
    return (
      <div className="space-y-4 text-center">
        <div className="text-red-500 font-medium">
          {tokenValidation.error || "Invalid or expired token"}
        </div>
        <div>
          <a href="/forgot-password" className="text-primary hover:underline">
            Request a new password reset
          </a>
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="token" value={token || ""} />

      <div>
        <Label htmlFor="password" className="block mb-2">
          New Password
        </Label>
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            name="password"
            id="password"
            placeholder="Enter new password"
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
        {state.fieldErrors?.password && (
          <p className="text-red-500 text-sm mt-1">
            {state.fieldErrors.password[0]}
          </p>
        )}
        <PasswordRequirements password={formData.password} />
      </div>

      <div>
        <Label htmlFor="confirmPassword" className="block mb-2">
          Confirm New Password
        </Label>
        <div className="relative">
          <Input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            id="confirmPassword"
            placeholder="Confirm new password"
            className="w-full pr-10"
            required
            value={formData.confirmPassword}
            onChange={(e) =>
              handleInputChange("confirmPassword", e.target.value)
            }
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            tabIndex={-1}
          >
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4 text-gray-500 hover:text-gray-700" />
            ) : (
              <Eye className="h-4 w-4 text-gray-500 hover:text-gray-700" />
            )}
          </button>
        </div>
        {state.fieldErrors?.confirmPassword && (
          <p className="text-red-500 text-sm mt-1">
            {state.fieldErrors.confirmPassword[0]}
          </p>
        )}
      </div>

      {state.error && <div className="text-red-500 text-sm">{state.error}</div>}

      <SubmitButton
        defaultMessage="Reset Password"
        pendingMessage="Resetting..."
      />
    </form>
  );
}
