// src/components/product/CategoryCalculator.tsx
"use client";

import BannerCalculator from "./calculators/BannerCalculator";
import BrosurCalculator from "./calculators/BrosurCalculator";
import BukuNotaCalculator from "./calculators/BukuNotaCalculator";
import BukuCustomCalculator from "./calculators/BukuCustomCalculator";
import CetakA3PlusCalculator from "./calculators/CetakA3PlusCalculator";
import KartuNamaCalculator from "./calculators/KartuNamaCalculator";
import DokumenCalculator from "./calculators/DokumenCalculator";
import StikerCalculator from "./calculators/StikerCalculator";
import KalenderCalculator from "./calculators/KalenderCalculator";
import MerchandiseCalculator from "./calculators/MerchandiseCalculator";

// Key HARUS sama persis dengan slug kebab-case di `lib/products.ts`
// (CATEGORY_ENUM_TO_SLUG) — jaga keduanya tetap sinkron kalau menambah kategori baru.
const CALCULATOR_BY_CATEGORY: Record<
  string,
  React.ComponentType<{ onPriceChange?: (subtotal: number, summary?: string) => void }>
> = {
  banner: BannerCalculator,
  brosur: BrosurCalculator,
  "buku-nota": BukuNotaCalculator,
  "buku-custom": BukuCustomCalculator,
  "cetak-a3-plus": CetakA3PlusCalculator,
  "kartu-nama": KartuNamaCalculator,
  dokumen: DokumenCalculator,
  stiker: StikerCalculator,
  kalender: KalenderCalculator,
  merchandise: MerchandiseCalculator,
};

interface CategoryCalculatorProps {
  category: string;
  onPriceChange?: (subtotal: number, summary?: string) => void;
}

/**
 * Kalkulator Harga Produk Spesifik — WAJIB tersemat di setiap halaman detail
 * produk. Komponen ini hanya bertugas memilih kalkulator yang tepat
 * berdasarkan kategori produk; logic harga sepenuhnya ada di masing-masing
 * komponen kalkulator + `lib/pricing/*`.
 */
export default function CategoryCalculator({ category, onPriceChange }: CategoryCalculatorProps) {
  const Calculator = CALCULATOR_BY_CATEGORY[category];

  if (!Calculator) {
    // TODO: TANGANI_KATEGORI_BARU — tambahkan entry di CALCULATOR_BY_CATEGORY
    // begitu kategori produk baru dibuat, agar tidak silently gagal seperti ini.
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 p-5 text-sm text-gray-500 dark:border-gray-700">
        Kalkulator untuk kategori &quot;{category}&quot; belum tersedia.
      </div>
    );
  }

  return <Calculator onPriceChange={onPriceChange} />;
}
