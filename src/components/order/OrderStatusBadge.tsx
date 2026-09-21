// src/components/order/OrderStatusBadge.tsx
import { OrderStatus } from "@prisma/client";
import { ORDER_STATUS_LABEL } from "@/lib/orders";

const STATUS_COLOR: Record<OrderStatus, string> = {
  MENUNGGU_PEMBAYARAN: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400",
  TERVERIFIKASI: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
  DIKEMAS: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
  PICKUP: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
  DALAM_PENGIRIMAN: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
  DITERIMA: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
  DIBATALKAN: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
};

export default function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_COLOR[status]}`}>
      {ORDER_STATUS_LABEL[status]}
    </span>
  );
}
