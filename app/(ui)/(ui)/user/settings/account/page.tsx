import { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Settings - Account",
  keywords: ["Next.js", "User Home", "Authentication"],
  description: "User settings page for managing account details and preferences.",
};

export default function UserSettingsAccountPage() {
  return (
    <>
      <div className="flex min-h-screen items-center justify-center">
        <h1 className="text-2xl font-bold">User Settings - Account</h1>
      </div>
    </>
  );
}