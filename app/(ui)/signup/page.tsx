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
      {/* Header fixo no topo */}
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
      <div className="flex-1 w-full">
        <div className="grid h-full w-full grid-cols-1 md:grid-cols-2">
          <Card className="flex flex-col items-center justify-center h-full border-none">
            <div className="w-full max-w-md space-y-4">
              <CardHeader>
                <CardTitle className="text-2xl font-bold ">Sign Up</CardTitle>
                <CardDescription>
                  Create a new account to access exclusive features and content.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormRegister />
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <a href="/signin" className="text-primary hover:underline">
                    Log in
                  </a>
                </p>
              </CardFooter>
            </div>
          </Card>
          <div className="hidden md:flex flex-col items-center justify-center bg-primary h-full"></div>
        </div>
      </div>
    </div>
  );
}
