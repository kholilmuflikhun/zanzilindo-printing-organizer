// src/app/member/pesanan/[orderId]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { OrderStatus } from "@prisma/client";
import { CheckCircle2, Star } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { getOrderForUser } from "@/lib/orders";
import OrderStatusBadge from "@/components/order/OrderStatusBadge";
import OrderTrackingStepper from "@/components/order/OrderTrackingStepper";
import ReviewForm from "@/components/review/ReviewForm";
import CountdownSection from "./CountdownSection";
import { formatRupiah } from "@/lib/utils/format";

interface OrderDetailPageProps {
  params: { orderId: string };
}

export const metadata: Metadata = {
  title: "Detail & Tracking Pesanan",
};

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const session = await getServerSession(authOptions);
  // Sama seperti member/pesanan/page.tsx — dicek ulang di sini (bukan
  // non-null assertion) agar TypeScript-safe.
  if (!session?.user?.id) redirect(`/login?callbackUrl=/member/pesanan/${params.orderId}`);

  const order = await getOrderForUser(params.orderId, session.user.id);

  // Sengaja notFound() untuk "order tidak ada" MAUPUN "order milik user lain"
  // — lihat komentar di getOrderForUser() kenapa keduanya harus diperlakukan sama.
  if (!order) {
    notFound();
  }

  const isPendingPayment = order.status === OrderStatus.MENUNGGU_PEMBAYARAN;
  const isReceived = order.status === OrderStatus.DITERIMA;

  return (
    <div>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="font-mono text-xl font-bold">{order.id}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {new Date(order.createdAt).toLocaleString("id-ID")}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      {/* Countdown + tombol lanjutkan pembayaran — hanya saat MENUNGGU_PEMBAYARAN.
          Logic countdown (interval, format waktu) ada di CountdownSection (client
          component terpisah) karena page.tsx ini server component. */}
      {isPendingPayment && (
        <CountdownSection expiredAt={order.expiredAt} snapRedirectUrl={order.snapRedirectUrl} />
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <h2 className="mb-4 text-sm font-semibold text-gray-500 dark:text-gray-400">
            STATUS PESANAN
          </h2>
          <OrderTrackingStepper status={order.status} />
        </div>

        <div className="space-y-4 lg:col-span-2">
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400">PRODUK DIPESAN</h2>

          {order.items.map((item) => {
            const alreadyReviewed = item.reviews.length > 0;

            return (
              <div
                key={item.id}
                className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{item.productName}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Qty {item.quantity} • {formatRupiah(item.price)}/unit
                    </p>
                  </div>
                  <p className="font-semibold text-brand">
                    {formatRupiah(item.price * item.quantity)}
                  </p>
                </div>

                {/* Ulasan Produk — sesuai spesifikasi: HANYA bisa diulas setelah
                    status pesanan "Diterima", dan hanya sekali per item per order
                    (ditegakkan juga di server, lihat app/api/reviews/route.ts). */}
                {isReceived && (
                  <div className="mt-3">
                    {alreadyReviewed ? (
                      <p className="flex items-center gap-1.5 text-xs text-gray-400">
                        <CheckCircle2 size={14} className="shrink-0 text-green-600" />
                        Anda sudah memberi ulasan {item.reviews[0].rating}
                        <Star size={12} className="fill-yellow-400 text-yellow-400" />
                        untuk produk ini.
                      </p>
                    ) : (
                      <ReviewForm
                        orderId={order.id}
                        productId={item.productId}
                        productName={item.productName}
                      />
                    )}
                  </div>
                )}
              </div>
            );
          })}

          <div className="flex items-center justify-between rounded-2xl bg-gray-50 p-4 text-sm dark:bg-gray-800/60">
            <span className="font-semibold">Total Pesanan</span>
            <span className="text-lg font-bold text-brand">{formatRupiah(order.grossAmount)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
