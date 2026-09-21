// src/lib/pricing/bukuCustomPricing.ts
import { BukuCustomVariables, PriceResult } from "./types";

// TODO: GANTI_DENGAN_HARGA_POKOK_ASLI_ANDA — harga cetak isi per eksemplar, per ukuran + gramasi.
const HARGA_ISI_PER_EKSEMPLAR: Record<string, number> = {
  "A6-70": 15000,
  "A6-80": 18000,
  "A5-70": 20000,
  "A5-80": 24000,
  "B5-70": 25000,
  "B5-80": 30000,
  "A4-70": 30000,
  "A4-80": 36000,
  "F4-70": 32000,
  "F4-80": 38000,
};

const HARGA_COVER_PER_EKSEMPLAR: Record<BukuCustomVariables["jenisCover"], number> = {
  Hardcover: 25000, // TODO: GANTI_DENGAN_HARGA_ASLI
  Softcover: 8000,
};

export function calculateBukuCustomPrice(vars: BukuCustomVariables): PriceResult {
  const { ukuranBuku, gramasiKertasIsi, jenisCover, jumlahCetak } = vars;

  const key = `${ukuranBuku}-${gramasiKertasIsi}`;
  const hargaIsiPerEksemplar = HARGA_ISI_PER_EKSEMPLAR[key] ?? 0;
  const hargaCoverPerEksemplar = HARGA_COVER_PER_EKSEMPLAR[jenisCover];

  const biayaIsi = hargaIsiPerEksemplar * Math.max(jumlahCetak, 0);
  const biayaCover = hargaCoverPerEksemplar * Math.max(jumlahCetak, 0);
  const subtotal = biayaIsi + biayaCover;

  return {
    unit: "eksemplar",
    subtotal,
    breakdown: [
      {
        label: `Cetak Isi Buku (${jumlahCetak} eks x Rp${hargaIsiPerEksemplar.toLocaleString(
          "id-ID"
        )})`,
        amount: biayaIsi,
      },
      {
        label: `Cover ${jenisCover} (${jumlahCetak} eks x Rp${hargaCoverPerEksemplar.toLocaleString(
          "id-ID"
        )})`,
        amount: biayaCover,
      },
    ],
  };
}

/**
 * INTEGRASI SPIN BUKU: tebal spin dihitung otomatis di `BukuCustomCalculator.tsx`
 * lewat `calculateSpinThickness()` (lib/pricing/spinBuku.ts) berdasarkan
 * `jumlahHalaman` + `gramasiKertasIsi`, memakai rumus yang sama persis dengan
 * Simulator Spin Buku di menu Simulator — satu sumber kebenaran, tidak ada
 * rumus ganda. Fungsi `calculateBukuCustomPrice` di atas tidak butuh nilai
 * spin secara langsung karena harga dihitung per eksemplar (isi + cover),
 * bukan berdasarkan volume/ketebalan.
 */
