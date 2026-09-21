// src/components/product/calculators/BukuCustomCalculator.tsx
"use client";

import { useMemo, useState } from "react";
import { BukuCustomVariables } from "@/lib/pricing/types";
import { calculateBukuCustomPrice } from "@/lib/pricing/bukuCustomPricing";
import { calculateSpinThickness } from "@/lib/pricing/spinBuku";
import { formatRupiah } from "@/lib/utils/format";

const JENIS_KERTAS_ISI_OPTIONS = ["Book Paper", "HVS", "Art Paper"]; // TODO: GANTI_DENGAN_DAFTAR_ASLI

const DEFAULT_STATE: BukuCustomVariables = {
  jenisKertasIsi: JENIS_KERTAS_ISI_OPTIONS[0],
  jenisCover: "Softcover",
  orientasi: "Portrait",
  jumlahHalaman: 100,
  ukuranBuku: "A5",
  gramasiKertasIsi: 70,
  jumlahCetak: 1,
};

interface BukuCustomCalculatorProps {
  onPriceChange?: (subtotal: number, summary?: string) => void;
}

export default function BukuCustomCalculator({ onPriceChange }: BukuCustomCalculatorProps) {
  const [vars, setVars] = useState<BukuCustomVariables>(DEFAULT_STATE);

  const result = useMemo(() => {
    const calculated = calculateBukuCustomPrice(vars);
    onPriceChange?.(calculated.subtotal, calculated.breakdown.map((b) => b.label).join(" · "));
    return calculated;
  }, [vars, onPriceChange]);

  // Tebal spin dihitung otomatis — rumus SAMA PERSIS dengan Simulator Spin
  // Buku (menu Simulator), lewat fungsi bersama `calculateSpinThickness`.
  const tebalSpinMm = useMemo(
    () =>
      calculateSpinThickness({
        jumlahHalaman: vars.jumlahHalaman,
        jenisKertasIsi: vars.jenisKertasIsi,
        gramasiKertasIsi: vars.gramasiKertasIsi,
        jenisCover: vars.jenisCover,
      }),
    [vars.jumlahHalaman, vars.jenisKertasIsi, vars.gramasiKertasIsi, vars.jenisCover]
  );

  function update<K extends keyof BukuCustomVariables>(key: K, value: BukuCustomVariables[K]) {
    setVars((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <h3 className="mb-4 text-lg font-semibold">Kalkulator Harga Buku Custom</h3>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Ukuran Buku</label>
          <select
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
            value={vars.ukuranBuku}
            onChange={(e) =>
              update("ukuranBuku", e.target.value as BukuCustomVariables["ukuranBuku"])
            }
          >
            {["A6", "A5", "B5", "A4", "F4"].map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Orientasi</label>
          <select
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
            value={vars.orientasi}
            onChange={(e) =>
              update("orientasi", e.target.value as BukuCustomVariables["orientasi"])
            }
          >
            <option value="Portrait">Portrait</option>
            <option value="Landscape">Landscape</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Jenis Kertas Isi</label>
          <select
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
            value={vars.jenisKertasIsi}
            onChange={(e) => update("jenisKertasIsi", e.target.value)}
          >
            {JENIS_KERTAS_ISI_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Gramasi Kertas Isi</label>
          <select
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
            value={vars.gramasiKertasIsi}
            onChange={(e) =>
              update(
                "gramasiKertasIsi",
                Number(e.target.value) as BukuCustomVariables["gramasiKertasIsi"]
              )
            }
          >
            <option value={70}>70 GSM</option>
            <option value={80}>80 GSM</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Jenis Cover</label>
          <select
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
            value={vars.jenisCover}
            onChange={(e) =>
              update("jenisCover", e.target.value as BukuCustomVariables["jenisCover"])
            }
          >
            <option value="Softcover">Softcover</option>
            <option value="Hardcover">Hardcover</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Jumlah Halaman</label>
          <input
            type="number"
            min={2}
            step={2}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
            value={vars.jumlahHalaman}
            onChange={(e) => update("jumlahHalaman", Number(e.target.value))}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Jumlah Cetak (eksemplar)</label>
          <input
            type="number"
            min={1}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
            value={vars.jumlahCetak}
            onChange={(e) => update("jumlahCetak", Number(e.target.value))}
          />
        </div>

        <div className="flex items-end">
          <p className="w-full rounded-lg bg-brand-light px-3 py-2 text-sm text-brand-dark dark:bg-gray-800 dark:text-brand">
            Estimasi tebal spin: <span className="font-semibold">{tebalSpinMm} mm</span>
          </p>
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
