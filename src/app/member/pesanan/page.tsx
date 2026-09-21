// src/app/member/pesanan/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { getOrdersByUser } from "@/lib/orders";
import OrderStatusBadge from "@/components/order/OrderStatusBadge";
import { formatRupiah } from "@/lib/utils/format";

export const metadata: Metadata = {
  title: "Pesanan Saya",
};

export default async function OrderListPage() {
  const session = await getServerSession(authOptions);
  // MemberLayout (parent) seharusnya sudah redirect kalau belum login, tapi
  // dicek ulang di sini (bukan non-null assertion) supaya TypeScript-safe
  // dan tetap aman meski route ini suatu saat dipanggil di luar MemberLayout.
  if (!session?.user?.id) redirect("/login?callbackUrl=/member/pesanan");

  const orders = await getOrdersByUser(session.user.id);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Pesanan Saya</h1>

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 p-10 text-center dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">Belum ada pesanan.</p>
          <Link
            href="/produk"
            className="mt-4 inline-block rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
          >
            Mulai Belanja
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/member/pesanan/${order.id}`}
              className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-4 transition hover:shadow-sm dark:border-gray-800 dark:bg-gray-900"
            >
              <div>
                <p className="font-mono text-sm font-medium">{order.id}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {order.items.length} produk • {new Date(order.createdAt).toLocaleDateString("id-ID")}
                </p>
              </div>
              <div className="text-right">
                <p className="mb-1 text-sm font-semibold text-brand">
                  {formatRupiah(order.grossAmount)}
                </p>
                <OrderStatusBadge status={order.status} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
