// src/app/(auth)/login/page.tsx
import type { Metadata } from "next";
import { Suspense } from "react";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Login",
  description: "Masuk ke akun Zanzilindo Anda untuk melihat pesanan, tracking, dan member area.",
};

export default function LoginPage() {
  return (
    // Suspense WAJIB di sini karena LoginForm memakai useSearchParams()
    // (untuk callbackUrl) — App Router mewajibkan boundary ini saat build.
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
