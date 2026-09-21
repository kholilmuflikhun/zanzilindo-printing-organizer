// src/app/member/checkout/CheckoutClient.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { useCart } from "@/context/CartContext";
import { formatRupiah } from "@/lib/utils/format";

// TODO: PASTIKAN nilai ini sinkron dengan MIDTRANS_IS_PRODUCTION di server (lib/midtrans.ts)
const IS_PRODUCTION = process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === "true";
const SNAP_JS_SRC = IS_PRODUCTION
  ? "https://app.midtrans.com/snap/snap.js"
  : "https://app.sandbox.midtrans.com/snap/snap.js";

declare global {
  interface Window {
    snap?: {
      pay: (
        token: string,
        options: {
          onSuccess?: (result: unknown) => void;
          onPending?: (result: unknown) => void;
          onError?: (result: unknown) => void;
          onClose?: () => void;
        }
      ) => void;
    };
  }
}

export default function CheckoutClient() {
  const router = useRouter();
  const { checkedItems, checkedSubtotal, removeCheckedItems } = useCart();

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [snapReady, setSnapReady] = useState(false);

  // Kalau user membuka /member/checkout langsung tanpa item ter-checklist
  // (mis. refresh setelah checkout sebelumnya), arahkan kembali ke Cart.
  useEffect(() => {
    if (checkedItems.length === 0) {
      router.replace("/member/cart");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkedItems.length]);

  async function handlePayNow() {
    if (!window.snap) {
      setError("Modul pembayaran belum siap, coba lagi sebentar.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: checkedItems.map((item) => ({
            productId: item.productId,
            productName: item.productName,
            price: item.unitPrice,
            quantity: item.quantity,
          })),
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({ message: "Checkout gagal, coba lagi." }));
        throw new Error(body.message ?? "Checkout gagal, coba lagi.");
      }

      const { orderId, snapToken } = await res.json();

      window.snap.pay(snapToken, {
        onSuccess: () => {
          removeCheckedItems();
          router.push(`/member/pesanan/${orderId}`);
        },
        onPending: () => {
          // Status "pending" (mis. user pilih transfer bank) — order tetap
          // MENUNGGU_PEMBAYARAN sampai webhook Midtrans konfirmasi settlement.
          removeCheckedItems();
          router.push(`/member/pesanan/${orderId}`);
        },
        onError: () => {
          setError("Pembayaran gagal. Silakan coba lagi atau cek status pesanan Anda.");
          setIsProcessing(false);
        },
        onClose: () => {
          // User menutup popup Snap tanpa menyelesaikan pembayaran — order
          // TETAP TERCATAT (status MENUNGGU_PEMBAYARAN), bisa dibayar lagi
          // dari halaman Tracking Pesanan sebelum batas 1x24 jam habis.
          setIsProcessing(false);
          router.push(`/member/pesanan/${orderId}`);
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan, coba lagi.");
      setIsProcessing(false);
    }
  }

  if (checkedItems.length === 0) return null;

  return (
    <div>
      <Script
        src={SNAP_JS_SRC}
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        onLoad={() => setSnapReady(true)}
        strategy="afterInteractive"
      />

      <h1 className="mb-6 text-2xl font-bold">Checkout</h1>

      <div className="space-y-3">
        {checkedItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
          >
            <div className="min-w-0">
              <p className="truncate font-medium">{item.productName}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {item.variableSummary} • Qty {item.quantity}
              </p>
            </div>
            <p className="shrink-0 pl-4 text-sm font-semibold text-brand">
              {formatRupiah(item.unitPrice * item.quantity)}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-4 flex items-center justify-between">
          <span className="font-semibold">Total Pembayaran</span>
          <span className="text-xl font-bold text-brand">{formatRupiah(checkedSubtotal)}</span>
        </div>

        <p className="mb-4 text-xs text-gray-400">
          Setelah menekan tombol di bawah, Anda akan diarahkan ke halaman pembayaran Midtrans.
          Pesanan harus dibayar dalam <strong>1x24 jam</strong>, jika tidak akan otomatis
          dibatalkan sistem.
        </p>

        {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

        <button
          onClick={handlePayNow}
          disabled={isProcessing || !snapReady}
          className="w-full rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isProcessing ? "Memproses..." : "Bayar Sekarang"}
        </button>
      </div>
    </div>
  );
}
