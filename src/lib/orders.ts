// src/lib/orders.ts
import { prisma } from "@/lib/prisma";
import { Order, OrderItem, OrderStatus, Review } from "@prisma/client";

export type OrderWithItems = Order & { items: OrderItem[] };
export type OrderWithItemsAndReviews = Order & {
  items: (OrderItem & { reviews: Review[] })[];
};

/** Daftar pesanan milik satu user, terbaru dulu. Dipakai di app/member/pesanan/page.tsx. */
export async function getOrdersByUser(userId: string): Promise<OrderWithItems[]> {
  return prisma.order.findMany({
    where: { userId },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Detail satu pesanan, HANYA jika milik userId yang diberikan (mencegah user
 * A membuka tracking pesanan milik user B lewat tebak-tebak orderId di URL).
 * Mengembalikan null jika tidak ditemukan ATAU bukan milik user tsb — caller
 * WAJIB memperlakukan keduanya sama (notFound()), jangan bedakan pesannya,
 * supaya tidak bocor informasi apakah order ID itu valid tapi milik orang lain.
 */
export async function getOrderForUser(
  orderId: string,
  userId: string
): Promise<OrderWithItemsAndReviews | null> {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });

  if (!order || order.userId !== userId) return null;

  const reviews = await prisma.review.findMany({
    where: { orderId },
  });

  return {
    ...order,
    items: order.items.map((item) => ({
      ...item,
      reviews: reviews.filter((review) => review.productId === item.productId),
    })),
  };
}

/** Label tampilan Bahasa Indonesia untuk tiap OrderStatus. */
export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  MENUNGGU_PEMBAYARAN: "Menunggu Pembayaran",
  TERVERIFIKASI: "Terverifikasi",
  DIKEMAS: "Dikemas",
  PICKUP: "Pickup",
  DALAM_PENGIRIMAN: "Dalam Pengiriman",
  DITERIMA: "Diterima",
  DIBATALKAN: "Dibatalkan",
};

/** Urutan alur normal (tidak termasuk DIBATALKAN, yang merupakan status terminal terpisah). */
export const ORDER_STATUS_FLOW: OrderStatus[] = [
  "MENUNGGU_PEMBAYARAN",
  "TERVERIFIKASI",
  "DIKEMAS",
  "PICKUP",
  "DALAM_PENGIRIMAN",
  "DITERIMA",
];
