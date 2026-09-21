// src/app/simulator/KalkulatorHargaGlobal.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import CategoryCalculator from "@/components/product/CategoryCalculator";
import { CATEGORY_OPTIONS } from "@/lib/products";

/**
 * Kalkulator Harga Global (menu Simulator): mirip Kalkulator Harga Produk
 * Spesifik, tapi tidak terikat ke satu produk tertentu — dipakai pengunjung
 * untuk estimasi cepat sebelum memutuskan produk mana yang akan dipesan.
 * Sengaja MEMAKAI ULANG `CategoryCalculator` yang sama dengan halaman detail
 * produk (bukan komponen terpisah), agar rumus harga tidak pernah berbeda
 * antara estimasi di sini dan harga final di halaman produk. Daftar kategori
 * juga memakai ulang `CATEGORY_OPTIONS` dari lib/products.ts (satu sumber).
 */
export default function KalkulatorHargaGlobal() {
  const [category, setCategory] = useState(CATEGORY_OPTIONS[0].slug);

  return (
    <div>
      <div className="mb-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h2 className="mb-1 text-xl font-semibold">Kalkulator Harga Global</h2>
        <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
          Pilih kategori produk untuk melihat estimasi harga secara instan.
        </p>

        <label className="mb-1 block text-sm font-medium">Kategori Produk</label>
        <select
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {CATEGORY_OPTIONS.map((opt) => (
            <option key={opt.slug} value={opt.slug}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <CategoryCalculator category={category} />

      <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
        Sudah yakin dengan pilihan Anda?{" "}
        <Link href={`/produk?kategori=${category}`} className="font-medium text-brand hover:underline">
          Lihat produk {CATEGORY_OPTIONS.find((c) => c.slug === category)?.label}
        </Link>
      </p>
    </div>
  );
}
