// src/app/simulator/SpinBukuSimulator.tsx
"use client";

import { useMemo, useState } from "react";
import { SpinBukuVariables } from "@/lib/pricing/spinBuku";
import { calculateSpinThickness } from "@/lib/pricing/spinBuku";

const JENIS_KERTAS_ISI_OPTIONS = ["Book Paper", "HVS", "Art Paper"]; // TODO: SINKRONKAN dengan BukuCustomCalculator

const DEFAULT_STATE: SpinBukuVariables = {
  jumlahHalaman: 100,
  jenisKertasIsi: JENIS_KERTAS_ISI_OPTIONS[0],
  gramasiKertasIsi: 70,
  jenisCover: "Softcover",
};

export default function SpinBukuSimulator() {
  const [vars, setVars] = useState<SpinBukuVariables>(DEFAULT_STATE);

  const tebalSpinMm = useMemo(() => calculateSpinThickness(vars), [vars]);

  function update<K extends keyof SpinBukuVariables>(key: K, value: SpinBukuVariables[K]) {
    setVars((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <h2 className="mb-1 text-xl font-semibold">Simulator Spin Buku</h2>
      <p className="mb-5 text-sm text-gray-500 dark:text-gray-400">
        Perkirakan ketebalan punggung (spin) buku sebelum memesan Buku Custom — berguna untuk
        mendesain layout cover agar teks/logo di spin tidak terpotong.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
          <p className="mt-1 text-xs text-gray-400">Harus genap — 1 lembar = 2 halaman bolak-balik.</p>
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
              update("gramasiKertasIsi", Number(e.target.value) as SpinBukuVariables["gramasiKertasIsi"])
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
            onChange={(e) => update("jenisCover", e.target.value as SpinBukuVariables["jenisCover"])}
          >
            <option value="Softcover">Softcover</option>
            <option value="Hardcover">Hardcover</option>
          </select>
        </div>
      </div>

      <div className="mt-6 rounded-xl bg-brand-light p-5 text-center dark:bg-gray-800">
        <p className="text-sm text-gray-600 dark:text-gray-300">Estimasi Tebal Spin</p>
        <p className="mt-1 text-3xl font-bold text-brand">{tebalSpinMm} mm</p>
        <p className="mt-1 text-xs text-gray-400">({(tebalSpinMm / 10).toFixed(2)} cm)</p>
      </div>

      <p className="mt-4 text-xs text-gray-400">
        * Estimasi berdasarkan data bulk kertas standar industri. Untuk hasil presisi produksi
        massal, konfirmasikan ke admin sebelum desain final dicetak.{" "}
        {/* TODO: SESUAIKAN_DISCLAIMER_INI sesuai kebijakan bisnis Anda */}
      </p>
    </div>
  );
}
