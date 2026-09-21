// src/components/product/AddToCartPanel.tsx
"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Check, ShoppingCart } from "lucide-react";
import CategoryCalculator from "./CategoryCalculator";
import { useCart } from "@/context/CartContext";
import { formatRupiah } from "@/lib/utils/format";

interface AddToCartPanelProps {
  productId: string;
  productSlug: string;
  productName: string;
  category: string;
}

export default function AddToCartPanel({
  productId,
  productSlug,
  productName,
  category,
}: AddToCartPanelProps) {
  const { status } = useSession();
  const router = useRouter();
  const { addItem } = useCart();

  const [currentPrice, setCurrentPrice] = useState(0);
  const [currentSummary, setCurrentSummary] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  function handleAddToCart() {
    if (status !== "authenticated") {
      // Belum login — arahkan ke Login, lalu kembali ke halaman produk ini setelah berhasil.
      router.push(`/login?callbackUrl=/produk/${productSlug}`);
      return;
    }

    addItem({
      productId,
      productSlug,
      productName,
      category,
      unitPrice: currentPrice,
      quantity,
      variableSummary: currentSummary,
    });

    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2500);
  }

  return (
    <div className="space-y-4">
      <CategoryCalculator
        category={category}
        onPriceChange={(subtotal, summary) => {
          setCurrentPrice(subtotal);
          setCurrentSummary(summary ?? "");
        }}
      />

      <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <label className="text-sm font-medium">Qty Pesanan Ini</label>
        <input
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
          className="w-20 rounded-lg border border-gray-300 px-2 py-1.5 text-sm dark:border-gray-700 dark:bg-gray-800"
        />
        {/* TODO: KLARIFIKASI_UX — qty di sini mengalikan hasil kalkulator (mis. 2x pesanan
            "100 rim brosur"), berbeda dari input jumlah cetak DI DALAM kalkulator itu sendiri
            (yang menentukan harga per pesanan). Pertimbangkan menyembunyikan field ini
            (kunci ke 1) untuk kategori yang variasinya sudah unik per pesanan, jika membingungkan pengguna. */}
      </div>

      <button
        onClick={handleAddToCart}
        disabled={currentPrice <= 0}
        className="flex w-full items-center justify-between rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span className="flex items-center gap-2">
          {justAdded ? <Check size={16} /> : <ShoppingCart size={16} />}
          {justAdded ? "Ditambahkan ke Keranjang" : "Tambah ke Keranjang"}
        </span>
        <span>{formatRupiah(currentPrice * quantity)}</span>
      </button>

      {status !== "authenticated" && (
        <p className="text-center text-xs text-gray-400">
          Anda akan diminta login terlebih dahulu sebelum menambah ke keranjang.
        </p>
      )}
    </div>
  );
}
