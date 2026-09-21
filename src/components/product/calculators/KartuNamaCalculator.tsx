// src/components/product/calculators/KartuNamaCalculator.tsx
"use client";

import { useMemo, useState } from "react";
import { KartuNamaVariables } from "@/lib/pricing/types";
import { calculateKartuNamaPrice } from "@/lib/pricing/kartuNamaPricing";
import { formatRupiah } from "@/lib/utils/format";

const JENIS_KERTAS_OPTIONS = ["Ivory", "Sintetis"]; // TODO: GANTI_DENGAN_DAFTAR_ASLI

const DEFAULT_STATE: KartuNamaVariables = {
  jenisKertas: JENIS_KERTAS_OPTIONS[0],
  gramasi: 260,
  sisiCetak: 2,
  jumlah: 1,
};

interface KartuNamaCalculatorProps {
  onPriceChange?: (subtotal: number, summary?: string) => void;
}

export default function KartuNamaCalculator({ onPriceChange }: KartuNamaCalculatorProps) {
  const [vars, setVars] = useState<KartuNamaVariables>(DEFAULT_STATE);

  const result = useMemo(() => {
    const calculated = calculateKartuNamaPrice(vars);
    onPriceChange?.(calculated.subtotal, calculated.breakdown.map((b) => b.label).join(" · "));
    return calculated;
  }, [vars, onPriceChange]);

  function update<K extends keyof KartuNamaVariables>(key: K, value: KartuNamaVariables[K]) {
    setVars((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <h3 className="mb-4 text-lg font-semibold">Kalkulator Harga Kartu Nama</h3>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Jenis Kertas</label>
          <select
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
            value={vars.jenisKertas}
            onChange={(e) => update("jenisKertas", e.target.value)}
          >
            {JENIS_KERTAS_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Gramasi (gsm)</label>
          <input
            type="number"
            min={0}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
            value={vars.gramasi}
            onChange={(e) => update("gramasi", Number(e.target.value))}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Sisi Cetak</label>
          <select
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
            value={vars.sisiCetak}
            onChange={(e) =>
              update("sisiCetak", Number(e.target.value) as KartuNamaVariables["sisiCetak"])
            }
          >
            <option value={1}>1 Sisi</option>
            <option value={2}>2 Sisi</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Jumlah (box, 1 box = 100 pcs)</label>
          <input
            type="number"
            min={1}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
            value={vars.jumlah}
            onChange={(e) => update("jumlah", Number(e.target.value))}
          />
        </div>
      </div>

      <div className="mt-5 space-y-1 border-t border-gray-100 pt-4 text-sm dark:border-gray-800">
        {result.breakdown.map((line) => (
          <div key={line.label} className="flex justify-between text-gray-600 dark:text-gray-300">
            <span>{line.label}</span>
            <span>{formatRupiah(line.amount)}</span>
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3 dark:border-gray-800">
        <span className="text-base font-semibold">Total</span>
        <span className="text-xl font-bold text-brand">{formatRupiah(result.subtotal)}</span>
      </div>
    </div>
  );
}
