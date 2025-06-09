import { Header } from "@/components/ui/header"
import type { Metadata } from "next"
import { FormForgotPassword } from "@/app/(ui)/forgot-password/components/form-forgot-password"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Forgot Password",
  keywords: ["Next.js", "Password Reset", "Authentication"],
  description: "Reset your password to regain access to your account.",
}

export default function ForgotPasswordPage() {
  const navigationHeader = [{ label: "", href: "/forgot-password" }]
  return (
    <div className="h-screen w-full flex flex-col">
      <Header
        logo={{
          text: "",
          href: "/",
          fixed: false,
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
      <Card className="flex-1 flex items-center justify-center bg-background border-none">
        <div className="w-full max-w-md space-y-4">
          <CardHeader className="text-center">
            <CardTitle className="text-primary leading-tighter text-4xl font-semibold tracking-tight text-balance lg:leading-[1.1] lg:font-semibold xl:text-5xl xl:tracking-tighter">
              Forgot Password
            </CardTitle>
            <CardDescription className="text-base text-balance sm:text-lg">
              {"Enter your email address and we'll send you instructions to reset your password."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormForgotPassword />
          </CardContent>
          <CardFooter className="flex justify-center">
           <p className="text-sm text-muted-foreground">
              {"Don't have an account?"}{" "}
              <a href="/signup" className="text-primary hover:underline">
                Sign Up
              </a>
            </p>
          </CardFooter>
        </div>
      </Card>
    </div>
  )
}
