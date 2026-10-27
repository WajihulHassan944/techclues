import type { Metadata } from "next";
import { Suspense } from "react";
import ResetPasswordForm from "@/components/admin/ResetPasswordForm";

export const metadata: Metadata = { title: "Reset password | TechClues admin" };

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
