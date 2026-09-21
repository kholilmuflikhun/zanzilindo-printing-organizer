// src/components/product/calculators/StikerCalculator.tsx
"use client";

import { useMemo, useState } from "react";
import { StikerVariables } from "@/lib/pricing/types";
import { calculateStikerPrice } from "@/lib/pricing/stikerPricing";
import { formatRupiah } from "@/lib/utils/format";

// TODO: SINKRONKAN dengan key di `lib/pricing/stikerPricing.ts`
const JENIS_KERTAS_OPTIONS = ["Chromo", "Vynil", "Transparant"];

const DEFAULT_STATE: StikerVariables = {
  jenisMesin: "A3+",
  jenisKertas: JENIS_KERTAS_OPTIONS[0],
  jumlahCetak: 1,
  finishing: "Lembaran",
};

interface StikerCalculatorProps {
  onPriceChange?: (subtotal: number, summary?: string) => void;
}

export default function StikerCalculator({ onPriceChange }: StikerCalculatorProps) {
  const [vars, setVars] = useState<StikerVariables>(DEFAULT_STATE);

  const result = useMemo(() => {
    const calculated = calculateStikerPrice(vars);
    onPriceChange?.(calculated.subtotal, calculated.breakdown.map((b) => b.label).join(" · "));
    return calculated;
  }, [vars, onPriceChange]);

  function update<K extends keyof StikerVariables>(key: K, value: StikerVariables[K]) {
    setVars((prev) => ({ ...prev, [key]: value }));
  }

  // Satuan input menyesuaikan mesin: A3+ pakai "lembar", Indoor/Outdoor pakai "meter".
  const satuanLabel = vars.jenisMesin === "A3+" ? "lembar" : "meter";

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <h3 className="mb-4 text-lg font-semibold">Kalkulator Harga Stiker</h3>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Jenis Mesin</label>
          <select
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
            value={vars.jenisMesin}
            onChange={(e) => update("jenisMesin", e.target.value as StikerVariables["jenisMesin"])}
          >
            <option value="A3+">A3+</option>
            <option value="Indoor">Indoor</option>
            <option value="Outdoor">Outdoor</option>
          </select>
        </div>

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
          <label className="mb-1 block text-sm font-medium">Finishing</label>
          <select
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
            value={vars.finishing}
            onChange={(e) => update("finishing", e.target.value as StikerVariables["finishing"])}
          >
            <option value="Lembaran">Lembaran (Tanpa Finishing)</option>
            <option value="Potong Cross">Potong Cross</option>
            <option value="Kisscut">Kisscut</option>
            <option value="Diecut">Diecut</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium capitalize">
            Jumlah Cetak ({satuanLabel})
          </label>
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
