// src/components/product/calculators/MerchandiseCalculator.tsx
"use client";

import { useMemo, useState } from "react";
import { MerchandiseSubKategori, MerchandiseVariables } from "@/lib/pricing/types";
import { calculateMerchandisePrice } from "@/lib/pricing/merchandisePricing";
import { formatRupiah } from "@/lib/utils/format";

const SUB_KATEGORI_OPTIONS: MerchandiseSubKategori[] = [
  "Plakat",
  "Piala",
  "ID Card",
  "Tali Lanyard",
  "Cangkir MUG",
  "Topi",
  "PIN Bros/Magnet",
  "Ganci",
];

const DEFAULT_STATE: MerchandiseVariables = {
  subKategori: "Plakat",
  spesifikasi: "", // TODO: GANTI_DENGAN_PLACEHOLDER_ATAU_DROPDOWN_SESUAI_SUB_KATEGORI jika diperlukan
  bahan: "",
  jumlahCetak: 1,
};

interface MerchandiseCalculatorProps {
  onPriceChange?: (subtotal: number, summary?: string) => void;
}

export default function MerchandiseCalculator({ onPriceChange }: MerchandiseCalculatorProps) {
  const [vars, setVars] = useState<MerchandiseVariables>(DEFAULT_STATE);

  const result = useMemo(() => {
    const calculated = calculateMerchandisePrice(vars);
    onPriceChange?.(calculated.subtotal, calculated.breakdown.map((b) => b.label).join(" · "));
    return calculated;
  }, [vars, onPriceChange]);

  function update<K extends keyof MerchandiseVariables>(key: K, value: MerchandiseVariables[K]) {
    setVars((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <h3 className="mb-4 text-lg font-semibold">Kalkulator Harga Merchandise</h3>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Sub-Kategori</label>
          <select
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
            value={vars.subKategori}
            onChange={(e) => update("subKategori", e.target.value as MerchandiseSubKategori)}
          >
            {SUB_KATEGORI_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Bahan</label>
          <input
            type="text"
            placeholder="contoh: Akrilik, Kayu, Kain Woven..." // TODO: GANTI_PLACEHOLDER_SESUAI_SUB_KATEGORI
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
            value={vars.bahan}
            onChange={(e) => update("bahan", e.target.value)}
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium">Spesifikasi</label>
          <input
            type="text"
            placeholder="contoh: 20x30 cm, warna emas, dst" // TODO: GANTI_PLACEHOLDER_SESUAI_SUB_KATEGORI
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
            value={vars.spesifikasi}
            onChange={(e) => update("spesifikasi", e.target.value)}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Jumlah Cetak (pcs)</label>
          <input
            type="number"
            min={1}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
            value={vars.jumlahCetak}
            onChange={(e) => update("jumlahCetak", Number(e.target.value))}
          />
        </div>
      </div>

      <p className="mt-3 text-xs text-gray-400">
        * Harga adalah estimasi awal berdasarkan sub-kategori. Bahan &amp; spesifikasi detail akan
        dikonfirmasi ulang oleh admin sebelum produksi. {/* TODO: SESUAIKAN_DISCLAIMER_INI dengan kebijakan bisnis Anda */}
      </p>

      <div className="mt-5 space-y-1 border-t border-gray-100 pt-4 text-sm dark:border-gray-800">
        {result.breakdown.map((line) => (
          <div key={line.label} className="flex justify-between text-gray-600 dark:text-gray-300">
            <span>{line.label}</span>
            <span>{formatRupiah(line.amount)}</span>
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3 dark:border-gray-800">
        <span className="text-base font-semibold">Total (Estimasi)</span>
        <span className="text-xl font-bold text-brand">{formatRupiah(result.subtotal)}</span>
      </div>
    </div>
  );
}
