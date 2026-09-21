// src/app/member/layout.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

export default async function MemberLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    // Guard di level server — halaman member tidak pernah ikut ter-render
    // (bukan sekadar disembunyikan di client) untuk pengunjung yang belum login.
    redirect("/login?callbackUrl=/member");
  }

  return <div className="mx-auto max-w-5xl px-4 py-8 lg:px-8">{children}</div>;
}
