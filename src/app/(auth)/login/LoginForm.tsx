// src/app/(auth)/login/LoginForm.tsx
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import GoogleIcon from "@/components/ui/GoogleIcon";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/member";

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCredentialsLogin(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const result = await signIn("credentials", {
      identifier,
      password,
      redirect: false,
    });

    setIsSubmitting(false);

    if (result?.error) {
      setError("Username/email atau password salah. Silakan coba lagi.");
      return;
    }

    router.push(callbackUrl);
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="mb-1 text-2xl font-bold">Masuk ke Akun Anda</h1>
      <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
        Belum punya akun?{" "}
        <Link href="/register" className="font-medium text-brand hover:underline">
          Daftar di sini
        </Link>
      </p>

      <button
        onClick={() => signIn("google", { callbackUrl })}
        className="mb-5 flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium transition hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
      >
        <GoogleIcon /> Login with Google
      </button>

      <div className="mb-5 flex items-center gap-3 text-xs text-gray-400">
        <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
        atau login dengan username/email
        <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
      </div>

      <form onSubmit={handleCredentialsLogin} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Username atau Email</label>
          <input
            type="text"
            required
            autoComplete="username"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Password</label>
          <input
            type="password"
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:opacity-60"
        >
          {isSubmitting ? "Memproses..." : "Masuk"}
        </button>
      </form>
    </div>
  );
}
