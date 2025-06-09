import { Header } from "@/components/ui/header";
import { FormLogin } from "@/app/(ui)/signin/components/form-login";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
  keywords: ["Next.js", "Sign In", "Authentication"],
  description: "Sign in to access your account and manage your settings.",
};

export default function LoginHome() {
  const navigationHeader = [{ label: "", href: "/signin" }];
  return (
    <>
      <Header
        logo={{
          text: "",
          href: "/",
          image: {
            src: "/next.svg",
            alt: "Logo",
            width: 90,
            height: 19,
            className: "brightness-0 invert",
          },
        }}
        navigation={navigationHeader}
      />
      <div className="flex min-h-screen items-center justify-center ">
        <div className="max-w-md w-full p-6 space-y-6">
          <div className="flex-1 flex items-center justify-center">
            <h1 className="text-3xl font-bold">Sign In</h1>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <p className="text-sm text-muted-foreground ">
              Please enter your email and password to sign in.
            </p>
          </div>
          <FormLogin />
          <div className="flex items-center justify-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <a href="/signup" className="text-primary hover:underline">
                Sign Up
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
