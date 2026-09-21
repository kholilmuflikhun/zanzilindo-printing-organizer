// src/components/product/calculators/BrosurCalculator.tsx
"use client";

import { useMemo, useState } from "react";
import { BrosurVariables } from "@/lib/pricing/types";
import { calculateBrosurPrice } from "@/lib/pricing/brosurPricing";
import { formatRupiah } from "@/lib/utils/format";

const JENIS_KERTAS_OPTIONS = ["Art Paper", "Matte Paper", "HVS"]; // TODO: GANTI_DENGAN_DAFTAR_ASLI
const MERK_KERTAS_OPTIONS = ["Sinar Dunia", "PaperOne", "Generic"]; // TODO: GANTI_DENGAN_DAFTAR_ASLI

const DEFAULT_STATE: BrosurVariables = {
  jenisMesin: "Digital Printing",
  jenisKertas: JENIS_KERTAS_OPTIONS[0],
  merkKertas: MERK_KERTAS_OPTIONS[0],
  kualitasKertas: "Standar",
  ukuran: "A4",
  lipatan: 1,
  sisiCetak: 1,
  gramasiKertas: 150,
  jumlahCetak: 1,
};

interface BrosurCalculatorProps {
  onPriceChange?: (subtotal: number, summary?: string) => void;
}

export default function BrosurCalculator({ onPriceChange }: BrosurCalculatorProps) {
  const [vars, setVars] = useState<BrosurVariables>(DEFAULT_STATE);

  const result = useMemo(() => {
    const calculated = calculateBrosurPrice(vars);
    onPriceChange?.(calculated.subtotal, calculated.breakdown.map((b) => b.label).join(" · "));
    return calculated;
  }, [vars, onPriceChange]);

  function update<K extends keyof BrosurVariables>(key: K, value: BrosurVariables[K]) {
    setVars((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <h3 className="mb-4 text-lg font-semibold">Kalkulator Harga Brosur</h3>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Jenis Mesin</label>
          <select
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
            value={vars.jenisMesin}
            onChange={(e) => update("jenisMesin", e.target.value as BrosurVariables["jenisMesin"])}
          >
            <option value="Offset">Offset</option>
            <option value="Digital Printing">Digital Printing</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Kualitas Kertas</label>
          <select
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
            value={vars.kualitasKertas}
            onChange={(e) =>
              update("kualitasKertas", e.target.value as BrosurVariables["kualitasKertas"])
            }
          >
            <option value="Standar">Standar</option>
            <option value="Premium">Premium</option>
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
          <label className="mb-1 block text-sm font-medium">Merk Kertas</label>
          <select
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
            value={vars.merkKertas}
            onChange={(e) => update("merkKertas", e.target.value)}
          >
            {MERK_KERTAS_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Ukuran</label>
          <select
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
            value={vars.ukuran}
            onChange={(e) => update("ukuran", e.target.value as BrosurVariables["ukuran"])}
          >
            <option value="A4">A4</option>
            <option value="A5">A5</option>
            <option value="F4">F4</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Gramasi Kertas (gsm)</label>
          <input
            type="number"
            min={0}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
            value={vars.gramasiKertas}
            onChange={(e) => update("gramasiKertas", Number(e.target.value))}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Lipatan</label>
          <select
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
            value={vars.lipatan}
            onChange={(e) => update("lipatan", Number(e.target.value) as BrosurVariables["lipatan"])}
          >
            <option value={1}>1 Lipatan</option>
            <option value={2}>2 Lipatan</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Sisi Cetak</label>
          <select
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
            value={vars.sisiCetak}
            onChange={(e) =>
              update("sisiCetak", Number(e.target.value) as BrosurVariables["sisiCetak"])
            }
          >
            <option value={1}>1 Sisi</option>
            <option value={2}>2 Sisi</option>
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
