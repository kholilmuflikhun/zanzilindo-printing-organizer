// src/components/product/calculators/DokumenCalculator.tsx
"use client";

import { useMemo, useState } from "react";
import { DokumenVariables } from "@/lib/pricing/types";
import { calculateDokumenPrice } from "@/lib/pricing/dokumenPricing";
import { formatRupiah } from "@/lib/utils/format";

const JENIS_KERTAS_OPTIONS = ["HVS", "HVS Warna"]; // TODO: GANTI_DENGAN_DAFTAR_ASLI

const DEFAULT_STATE: DokumenVariables = {
  jenisKertas: JENIS_KERTAS_OPTIONS[0],
  sisiCetak: 1,
  jumlahCetak: 1,
};

interface DokumenCalculatorProps {
  onPriceChange?: (subtotal: number, summary?: string) => void;
}

export default function DokumenCalculator({ onPriceChange }: DokumenCalculatorProps) {
  const [vars, setVars] = useState<DokumenVariables>(DEFAULT_STATE);

  const result = useMemo(() => {
    const calculated = calculateDokumenPrice(vars);
    onPriceChange?.(calculated.subtotal, calculated.breakdown.map((b) => b.label).join(" · "));
    return calculated;
  }, [vars, onPriceChange]);

  function update<K extends keyof DokumenVariables>(key: K, value: DokumenVariables[K]) {
    setVars((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <h3 className="mb-4 text-lg font-semibold">Kalkulator Harga Dokumen</h3>

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
          <label className="mb-1 block text-sm font-medium">Sisi Cetak</label>
          <select
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
            value={vars.sisiCetak}
            onChange={(e) =>
              update("sisiCetak", Number(e.target.value) as DokumenVariables["sisiCetak"])
            }
          >
            <option value={1}>1 Sisi</option>
            <option value={2}>2 Sisi</option>
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium">Jumlah Cetak (lembar)</label>
          <input
            type="number"
            min={1}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
            value={vars.jumlahCetak}
            onChange={(e) => update("jumlahCetak", Number(e.target.value))}
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
