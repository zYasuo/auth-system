"use client"
import { Header } from "@/components/ui/header"
import { FormResetPassword } from "@/app/(ui)/reset-password/components/form-reset-password"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

function ResetPasswordContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const navigationHeader = [{ label: "", href: "/reset-password" }]

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
              Reset Password
            </CardTitle>
            <CardDescription className="text-base text-balance sm:text-lg">
              Create a new password for your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormResetPassword token={token} />
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Remember your password?{" "}
              <a href="/signin" className="text-primary hover:underline">
                Sign In
              </a>
            </p>
          </CardFooter>
        </div>
      </Card>
    </div>
  )
}

export default function ResetPasswordClient() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  )
}
