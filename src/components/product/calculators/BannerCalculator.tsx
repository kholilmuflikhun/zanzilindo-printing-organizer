// src/components/product/calculators/BannerCalculator.tsx
"use client";

import { useMemo, useState } from "react";
import { BannerVariables } from "@/lib/pricing/types";
import { calculateBannerPrice } from "@/lib/pricing/bannerPricing";
import { formatRupiah } from "@/lib/utils/format";

const JENIS_BAHAN_OPTIONS = ["Flexi Korea", "Flexi China", "Albatros"]; // TODO: GANTI_DENGAN_DAFTAR_BAHAN_ASLI
const MERK_BAHAN_OPTIONS = ["SunTech", "Seven Stars", "Generic"]; // TODO: GANTI_DENGAN_DAFTAR_MERK_ASLI

const DEFAULT_STATE: BannerVariables = {
  mesin: "Indoor",
  jenisBahan: JENIS_BAHAN_OPTIONS[0],
  merkBahan: MERK_BAHAN_OPTIONS[0],
  kualitasBahan: "Standar",
  gramasi: 280,
  panjang: 1,
  lebar: 1,
  jumlahCetak: 1,
  finishing: "Polos",
  jumlahMataAyam: 0,
};

interface BannerCalculatorProps {
  /** Dipanggil setiap kali harga berubah, agar parent (halaman produk / cart) bisa sinkron. */
  onPriceChange?: (subtotal: number, summary?: string) => void;
}

export default function BannerCalculator({ onPriceChange }: BannerCalculatorProps) {
  const [vars, setVars] = useState<BannerVariables>(DEFAULT_STATE);

  // Kalkulasi ulang harga secara real-time setiap `vars` berubah.
  const result = useMemo(() => {
    const calculated = calculateBannerPrice(vars);
    onPriceChange?.(calculated.subtotal, calculated.breakdown.map((b) => b.label).join(" · "));
    return calculated;
  }, [vars, onPriceChange]);

  function update<K extends keyof BannerVariables>(key: K, value: BannerVariables[K]) {
    setVars((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <h3 className="mb-4 text-lg font-semibold">Kalkulator Harga Banner</h3>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Kategori Mesin</label>
          <select
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
            value={vars.mesin}
            onChange={(e) => update("mesin", e.target.value as BannerVariables["mesin"])}
          >
            <option value="Indoor">Indoor</option>
            <option value="Outdoor">Outdoor</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Kualitas Bahan</label>
          <select
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
            value={vars.kualitasBahan}
            onChange={(e) =>
              update("kualitasBahan", e.target.value as BannerVariables["kualitasBahan"])
            }
          >
            <option value="Standar">Standar</option>
            <option value="Premium">Premium</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Jenis Bahan</label>
          <select
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
            value={vars.jenisBahan}
            onChange={(e) => update("jenisBahan", e.target.value)}
          >
            {JENIS_BAHAN_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Merk Bahan</label>
          <select
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
            value={vars.merkBahan}
            onChange={(e) => update("merkBahan", e.target.value)}
          >
            {MERK_BAHAN_OPTIONS.map((opt) => (
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
          <label className="mb-1 block text-sm font-medium">Jumlah Cetak (pcs)</label>
          <input
            type="number"
            min={1}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
            value={vars.jumlahCetak}
            onChange={(e) => update("jumlahCetak", Number(e.target.value))}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Panjang (meter)</label>
          <input
            type="number"
            min={0}
            step={0.1}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
            value={vars.panjang}
            onChange={(e) => update("panjang", Number(e.target.value))}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Lebar (meter)</label>
          <input
            type="number"
            min={0}
            step={0.1}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
            value={vars.lebar}
            onChange={(e) => update("lebar", Number(e.target.value))}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Finishing</label>
          <select
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
            value={vars.finishing}
            onChange={(e) => update("finishing", e.target.value as BannerVariables["finishing"])}
          >
            <option value="Polos">Polos</option>
            <option value="Mata Ayam">Mata Ayam</option>
          </select>
        </div>

        {vars.finishing === "Mata Ayam" && (
          <div>
            <label className="mb-1 block text-sm font-medium">Jumlah Mata Ayam (pcs)</label>
            <input
              type="number"
              min={0}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
              value={vars.jumlahMataAyam}
              onChange={(e) => update("jumlahMataAyam", Number(e.target.value))}
            />
          </div>
        )}
      </div>

      {/* Rincian harga real-time */}
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

/**
 * TODO: DUPLIKASI_POLA_INI untuk 9 kategori lain (Brosur, Buku Nota, dst):
 * 1. Import interface + fungsi pricing sesuai kategori dari `lib/pricing/`.
 * 2. Ganti field form sesuai variabel spesifik kategori tersebut.
 * 3. Pertahankan pola `useMemo` + `onPriceChange` callback ini agar konsisten
 *    dipakai baik di halaman detail produk maupun di dalam Cart (re-render harga).
 */
