// src/app/simulator/page.tsx
import type { Metadata } from "next";
import SimulatorTabs from "./SimulatorTabs";

export const metadata: Metadata = {
  title: "Simulator — Spin Buku & Kalkulator Harga",
  description:
    "Simulasikan tebal punggung buku custom atau hitung estimasi harga cetak untuk semua kategori produk Zanzilindo secara instan.",
};

export default function SimulatorPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 lg:px-8">
      <h1 className="mb-2 text-2xl font-bold">Simulator</h1>
      <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
        Pilih salah satu tab di bawah: simulasikan tebal spin buku, atau hitung estimasi harga
        cetak untuk semua kategori produk.
      </p>

      <SimulatorTabs />
    </div>
  );
}
