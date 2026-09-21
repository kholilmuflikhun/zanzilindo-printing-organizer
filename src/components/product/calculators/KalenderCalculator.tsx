// src/components/product/calculators/KalenderCalculator.tsx
"use client";

import { useMemo, useState } from "react";
import { KalenderVariables } from "@/lib/pricing/types";
import { calculateKalenderPrice } from "@/lib/pricing/kalenderPricing";
import { formatRupiah } from "@/lib/utils/format";

const DEFAULT_STATE: KalenderVariables = {
  jenisKalender: "Dinding",
  jumlahBulanPerLembar: 1,
  sisiCetak: 1,
  finishing: "Spiral Plastik",
  jumlahCetak: 1,
};

const BULAN_OPTIONS: KalenderVariables["jumlahBulanPerLembar"][] = [1, 2, 3, 4, 6, 12];

interface KalenderCalculatorProps {
  onPriceChange?: (subtotal: number, summary?: string) => void;
}

export default function KalenderCalculator({ onPriceChange }: KalenderCalculatorProps) {
  const [vars, setVars] = useState<KalenderVariables>(DEFAULT_STATE);

  const result = useMemo(() => {
    const calculated = calculateKalenderPrice(vars);
    onPriceChange?.(calculated.subtotal, calculated.breakdown.map((b) => b.label).join(" · "));
    return calculated;
  }, [vars, onPriceChange]);

  function update<K extends keyof KalenderVariables>(key: K, value: KalenderVariables[K]) {
    setVars((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <h3 className="mb-4 text-lg font-semibold">Kalkulator Harga Kalender</h3>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Jenis Kalender</label>
          <select
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
            value={vars.jenisKalender}
            onChange={(e) =>
              update("jenisKalender", e.target.value as KalenderVariables["jenisKalender"])
            }
          >
            <option value="Dinding">Dinding</option>
            <option value="Meja">Meja</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Jumlah Bulan per Lembar</label>
          <select
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
            value={vars.jumlahBulanPerLembar}
            onChange={(e) =>
              update(
                "jumlahBulanPerLembar",
                Number(e.target.value) as KalenderVariables["jumlahBulanPerLembar"]
              )
            }
          >
            {BULAN_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt} Bulan
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
              update("sisiCetak", Number(e.target.value) as KalenderVariables["sisiCetak"])
            }
          >
            <option value={1}>1 Sisi</option>
            <option value={2}>2 Sisi</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Finishing</label>
          <select
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
            value={vars.finishing}
            onChange={(e) =>
              update("finishing", e.target.value as KalenderVariables["finishing"])
            }
          >
            <option value="Spiral Plastik">Spiral Plastik</option>
            <option value="Spiral Besi">Spiral Besi</option>
            <option value="Plat Besi">Plat Besi</option>
          </select>
        </div>

        <div className="sm:col-span-2">
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
