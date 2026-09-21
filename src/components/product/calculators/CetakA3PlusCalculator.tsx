// src/components/product/calculators/CetakA3PlusCalculator.tsx
"use client";

import { useMemo, useState } from "react";
import { CetakA3PlusVariables } from "@/lib/pricing/types";
import { calculateCetakA3PlusPrice } from "@/lib/pricing/cetakA3PlusPricing";
import { formatRupiah } from "@/lib/utils/format";

// TODO: SINKRONKAN dengan daftar key di `lib/pricing/cetakA3PlusPricing.ts` (HARGA_POKOK_PER_LEMBAR)
const JENIS_KERTAS_OPTIONS = [
  "Ivory",
  "Chromo",
  "Vynil",
  "Transparant",
  "Art Paper",
  "Aster",
  "BC",
  "Linen",
  "Hammer",
];

const DEFAULT_STATE: CetakA3PlusVariables = {
  jenisKertas: JENIS_KERTAS_OPTIONS[0],
  gramasi: 230,
  finishing: "Lembaran",
  jumlahCetak: 1,
};

interface CetakA3PlusCalculatorProps {
  onPriceChange?: (subtotal: number, summary?: string) => void;
}

export default function CetakA3PlusCalculator({ onPriceChange }: CetakA3PlusCalculatorProps) {
  const [vars, setVars] = useState<CetakA3PlusVariables>(DEFAULT_STATE);

  const result = useMemo(() => {
    const calculated = calculateCetakA3PlusPrice(vars);
    onPriceChange?.(calculated.subtotal, calculated.breakdown.map((b) => b.label).join(" · "));
    return calculated;
  }, [vars, onPriceChange]);

  function update<K extends keyof CetakA3PlusVariables>(key: K, value: CetakA3PlusVariables[K]) {
    setVars((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <h3 className="mb-4 text-lg font-semibold">Kalkulator Harga Cetak A3+</h3>

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
          <label className="mb-1 block text-sm font-medium">Finishing</label>
          <select
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
            value={vars.finishing}
            onChange={(e) =>
              update("finishing", e.target.value as CetakA3PlusVariables["finishing"])
            }
          >
            <option value="Lembaran">Lembaran (Tanpa Finishing)</option>
            <option value="Potong Cross">Potong Cross</option>
            <option value="Kisscut">Kisscut</option>
            <option value="Diecut">Diecut</option>
          </select>
        </div>

        <div>
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
