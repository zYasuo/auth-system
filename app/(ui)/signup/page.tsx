import { Header } from "@/components/ui/header";
import type { Metadata } from "next";
import { FormRegister } from "./components/form-register";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Sign Up",
  keywords: ["Next.js", "Sign Up", "Authentication"],
  description: "Create a new account to access exclusive features and content.",
};

export default function SignupHome() {
  const navigationHeader = [{ label: "", href: "/signup" }];
  return (
    <div className="h-screen w-full flex flex-col">
      <Header
        logo={{
          text: "",
          href: "/",
          fixed: true,
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
      <div className="flex-1 w-full">
        <div className="grid h-full w-full grid-cols-1 md:grid-cols-2">
          <div className="flex flex-col items-center justify-center h-full">
            <div className="w-full max-w-md space-y-4">
              <CardHeader className="max-w-2xl">
                <CardTitle className="text-primary leading-tighter text-4xl font-semibold tracking-tight text-balance lg:leading-[1.1] lg:font-semibold xl:text-5xl xl:tracking-tighter">
                  Sign Up
                </CardTitle>
                <CardDescription className="text-base text-balance sm:text-lg">
                  Create a new account.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormRegister />
              </CardContent>
              <CardFooter className="flex justify-center">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <a href="/signin" className="text-primary hover:underline">
                    Log in
                  </a>
                </p>
              </CardFooter>
            </div>
          </div>
          <div className="hidden md:flex flex-col items-center justify-center h-full p-6 bg-card border-l border-border">
            <div className="w-full h-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
