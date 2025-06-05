import { Header } from "@/components/ui/header";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Home",
  keywords: ["Next.js", "User Home", "Authentication"],
  description: "User home page for managing account settings and preferences.",
};

export default function UserHome() {
  const navigationHeader = [{ label: "", href: "/user" }];
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
      <div className="flex min-h-screen items-center justify-center"></div>
    </>
  );
}
