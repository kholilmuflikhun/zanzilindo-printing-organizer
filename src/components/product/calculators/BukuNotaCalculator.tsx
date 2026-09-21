// src/components/product/calculators/BukuNotaCalculator.tsx
"use client";

import { useMemo, useState } from "react";
import { BukuNotaVariables } from "@/lib/pricing/types";
import { calculateBukuNotaPrice } from "@/lib/pricing/bukuNotaPricing";
import { formatRupiah } from "@/lib/utils/format";

const DEFAULT_STATE: BukuNotaVariables = {
  jenisKertas: "HVS",
  jumlahRangkap: 2,
  finishing: "Jilid Lem",
  jumlahCetak: 1,
};

interface BukuNotaCalculatorProps {
  onPriceChange?: (subtotal: number, summary?: string) => void;
}

export default function BukuNotaCalculator({ onPriceChange }: BukuNotaCalculatorProps) {
  const [vars, setVars] = useState<BukuNotaVariables>(DEFAULT_STATE);

  const result = useMemo(() => {
    const calculated = calculateBukuNotaPrice(vars);
    onPriceChange?.(calculated.subtotal, calculated.breakdown.map((b) => b.label).join(" · "));
    return calculated;
  }, [vars, onPriceChange]);

  function update<K extends keyof BukuNotaVariables>(key: K, value: BukuNotaVariables[K]) {
    setVars((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <h3 className="mb-4 text-lg font-semibold">Kalkulator Harga Buku Nota</h3>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Jenis Kertas</label>
          <select
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
            value={vars.jenisKertas}
            onChange={(e) =>
              update("jenisKertas", e.target.value as BukuNotaVariables["jenisKertas"])
            }
          >
            <option value="HVS">HVS</option>
            <option value="NCR">NCR</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Jumlah Rangkap</label>
          <select
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
            value={vars.jumlahRangkap}
            onChange={(e) =>
              update(
                "jumlahRangkap",
                Number(e.target.value) as BukuNotaVariables["jumlahRangkap"]
              )
            }
          >
            <option value={1}>1 Ply</option>
            <option value={2}>2 Ply</option>
            <option value={3}>3 Ply</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Finishing</label>
          <select
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
            value={vars.finishing}
            onChange={(e) =>
              update("finishing", e.target.value as BukuNotaVariables["finishing"])
            }
          >
            <option value="Jilid Lem">Jilid Lem</option>
            <option value="Jilid Spiral">Jilid Spiral</option>
            <option value="Tanpa Finishing">Tanpa Finishing</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Jumlah Cetak (rim)</label>
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
