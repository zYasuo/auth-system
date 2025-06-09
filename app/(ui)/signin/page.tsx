import { Header } from "@/components/ui/header"
import { FormLogin } from "@/app/(ui)/signin/components/form-login"
import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Sign In",
  keywords: ["Next.js", "Sign In", "Authentication"],
  description: "Sign in to access your account and manage your settings.",
}

export default function LoginHome() {
  const navigationHeader = [{ label: "", href: "/signin" }]
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
      <Card className="flex-1 flex items-center justify-center bg-background border-none">
        <div className="w-full max-w-md space-y-4">
          <CardHeader className="text-center">
            <CardTitle className="text-primary leading-tighter text-4xl font-semibold tracking-tight text-balance lg:leading-[1.1] lg:font-semibold xl:text-5xl xl:tracking-tighter">
              Sign In
            </CardTitle>
            <CardDescription className="text-base text-balance sm:text-lg">
              Please enter your email and password to sign in.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormLogin />
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
