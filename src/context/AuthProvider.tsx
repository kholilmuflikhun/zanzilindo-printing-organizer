// src/context/AuthProvider.tsx
"use client";

import { SessionProvider } from "next-auth/react";

/**
 * Membungkus seluruh app dengan SessionProvider NextAuth.
 * WAJIB ada di root layout — tanpa ini, setiap pemanggilan useSession()
 * (dipakai di Navbar, halaman Member, dll) akan melempar error runtime:
 * "[next-auth]: `useSession` must be wrapped in a <SessionProvider />".
 */
export default function AuthProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
