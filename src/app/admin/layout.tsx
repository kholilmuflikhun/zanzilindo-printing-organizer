import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login?callbackUrl=/admin/produk");
  }
  if (session.user.role !== "ADMIN") {
    redirect("/member");
  }

  return <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">{children}</div>;
}
