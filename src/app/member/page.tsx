// src/app/member/page.tsx
import Link from "next/link";
import { getServerSession } from "next-auth";
import { ShoppingCart, Package } from "lucide-react";
import { authOptions } from "@/lib/auth";

export default async function MemberDashboardPage() {
  const session = await getServerSession(authOptions);

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold">Halo, {session?.user?.name ?? "Member"} 👋</h1>
      <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
        Selamat datang di Member Area Zanzilindo.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link
          href="/member/cart"
          className="rounded-2xl border border-gray-200 bg-white p-6 transition hover:shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          <ShoppingCart size={28} className="text-brand" />
          <p className="mt-2 font-semibold">Keranjang Saya</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Lihat & checkout produk yang sudah ditambahkan.
          </p>
        </Link>

        <Link
          href="/member/pesanan"
          className="rounded-2xl border border-gray-200 bg-white p-6 transition hover:shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          <Package size={28} className="text-brand" />
          <p className="mt-2 font-semibold">Pesanan Saya</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Lacak status pesanan & beri ulasan produk.
          </p>
        </Link>
      </div>
    </div>
  );
}
