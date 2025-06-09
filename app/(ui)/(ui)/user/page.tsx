import { Metadata } from "next";

export const metadata: Metadata = {
  title: "User",
  keywords: ["Next.js", "User Home", "Authentication"],
  description: "User home page for managing account settings and preferences.",
};

export default function UserPage() {
  return (
    <>
      <div className="flex min-h-screen items-center justify-center"></div>
    </>
  );
}
