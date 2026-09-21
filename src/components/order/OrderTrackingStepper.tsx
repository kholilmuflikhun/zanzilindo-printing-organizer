// src/components/order/OrderTrackingStepper.tsx
import { OrderStatus } from "@prisma/client";
import { XCircle, Check } from "lucide-react";
import { ORDER_STATUS_FLOW, ORDER_STATUS_LABEL } from "@/lib/orders";

interface OrderTrackingStepperProps {
  status: OrderStatus;
}

export default function OrderTrackingStepper({ status }: OrderTrackingStepperProps) {
  if (status === OrderStatus.DIBATALKAN) {
    return (
      <div className="flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
        <XCircle size={18} className="shrink-0" />
        <span>
          Pesanan ini dibatalkan (pembayaran tidak diselesaikan dalam 1x24 jam, atau pembayaran
          ditolak/dibatalkan).
        </span>
      </div>
    );
  }

  const currentIndex = ORDER_STATUS_FLOW.indexOf(status);

  return (
    <div className="flex flex-col gap-0">
      {ORDER_STATUS_FLOW.map((step, index) => {
        const isDone = index < currentIndex;
        const isCurrent = index === currentIndex;
        const isLast = index === ORDER_STATUS_FLOW.length - 1;

        return (
          <div key={step} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  isDone
                    ? "bg-brand text-white"
                    : isCurrent
                      ? "border-2 border-brand text-brand"
                      : "border-2 border-gray-200 text-gray-300 dark:border-gray-700"
                }`}
              >
                {isDone ? <Check size={14} /> : index + 1}
              </div>
              {!isLast && (
                <div
                  className={`w-0.5 flex-1 ${isDone ? "bg-brand" : "bg-gray-200 dark:bg-gray-700"}`}
                  style={{ minHeight: 24 }}
                />
              )}
            </div>
            <div className="pb-6">
              <p
                className={`text-sm font-medium ${
                  isCurrent ? "text-brand" : isDone ? "text-gray-700 dark:text-gray-300" : "text-gray-400"
                }`}
              >
                {ORDER_STATUS_LABEL[step]}
              </p>
              {isCurrent && (
                <p className="text-xs text-gray-400">Status pesanan Anda saat ini.</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
