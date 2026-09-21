// src/components/cart/CartTable.tsx
"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatRupiah } from "@/lib/utils/format";

export default function CartTable() {
  const { items, toggleChecked, toggleAllChecked, updateQuantity, removeItem, checkedSubtotal } =
    useCart();

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 p-10 text-center dark:border-gray-700">
        <p className="text-gray-500 dark:text-gray-400">Keranjang Anda masih kosong.</p>
        <Link
          href="/produk"
          className="mt-4 inline-block rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
        >
          Mulai Belanja
        </Link>
      </div>
    );
  }

  const allChecked = items.every((i) => i.checked);

  return (
    <div>
      <div className="mb-3 flex items-center gap-2 border-b border-gray-100 pb-3 text-sm dark:border-gray-800">
        <input
          type="checkbox"
          checked={allChecked}
          onChange={(e) => toggleAllChecked(e.target.checked)}
          className="h-4 w-4 accent-brand"
        />
        <span>Pilih Semua ({items.length} item)</span>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-3 rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
          >
            <input
              type="checkbox"
              checked={item.checked}
              onChange={() => toggleChecked(item.id)}
              className="mt-1 h-4 w-4 accent-brand"
            />

            <div className="min-w-0 flex-1">
              <Link href={`/produk/${item.productSlug}`} className="font-medium hover:underline">
                {item.productName}
              </Link>
              <p className="mt-0.5 line-clamp-2 text-xs text-gray-500 dark:text-gray-400">
                {item.variableSummary || "—"}
              </p>

              <div className="mt-2 flex items-center gap-3">
                <div className="flex items-center rounded-lg border border-gray-300 dark:border-gray-700">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="px-2.5 py-1 text-sm text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                    aria-label="Kurangi qty"
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-sm">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="px-2.5 py-1 text-sm text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                    aria-label="Tambah qty"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => removeItem(item.id)}
                  className="text-xs text-red-600 hover:underline"
                >
                  Hapus
                </button>
              </div>
            </div>

            <p className="shrink-0 text-sm font-semibold text-brand">
              {formatRupiah(item.unitPrice * item.quantity)}
            </p>
          </div>
        ))}
      </div>

      <div className="sticky bottom-0 mt-6 flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-lg sm:flex-row sm:items-center sm:justify-between dark:border-gray-800 dark:bg-gray-900">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Subtotal ({items.filter((i) => i.checked).length} item dipilih)
          </p>
          <p className="text-xl font-bold text-brand">{formatRupiah(checkedSubtotal)}</p>
        </div>
        <Link
          href="/member/checkout"
          aria-disabled={checkedSubtotal <= 0}
          className={`rounded-full px-6 py-3 text-center text-sm font-semibold text-white transition ${
            checkedSubtotal > 0
              ? "bg-brand hover:bg-brand-dark"
              : "pointer-events-none bg-gray-300 dark:bg-gray-700"
          }`}
        >
          Checkout
        </Link>
      </div>
    </div>
  );
}
