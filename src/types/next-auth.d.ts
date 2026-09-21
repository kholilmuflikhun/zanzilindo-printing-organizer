// src/types/next-auth.d.ts
import type { DefaultSession } from "next-auth";

/**
 * NextAuth secara default tidak menyertakan `id` di tipe `Session.user`.
 * `lib/auth.ts` (session callback) memang mengisi `session.user.id = token.sub`
 * secara runtime, tapi tanpa augmentation ini TypeScript akan menolak semua
 * pemakaian `session.user.id` di kode lain (checkout, reviews, member/pesanan,
 * dst) dengan error "Property 'id' does not exist on type...".
 */
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}
