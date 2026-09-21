// src/lib/pricing/bannerPricing.ts
import { BannerVariables, PriceResult } from "./types";

/**
 * TODO: GANTI_DENGAN_HARGA_POKOK_ASLI_ANDA
 * Harga pokok per meter persegi, dikelompokkan berdasarkan kombinasi
 * mesin + kualitas bahan. Ini DATA DUMMY untuk keperluan development UI.
 */
const HARGA_POKOK_PER_METER: Record<string, number> = {
  "Indoor-Standar": 25000,
  "Indoor-Premium": 40000,
  "Outdoor-Standar": 20000,
  "Outdoor-Premium": 35000,
};

const HARGA_MATA_AYAM_PER_PCS = 1000; // TODO: GANTI_DENGAN_HARGA_ASLI_ANDA

/**
 * Menghitung harga cetak Banner.
 * Rumus dasar: Panjang (m) x Lebar (m) x Harga Pokok/meter x Jumlah Cetak
 * ditambah biaya finishing (mata ayam) jika dipilih.
 */
export function calculateBannerPrice(vars: BannerVariables): PriceResult {
  const {
    mesin,
    kualitasBahan,
    panjang,
    lebar,
    jumlahCetak,
    finishing,
    jumlahMataAyam,
  } = vars;

  const key = `${mesin}-${kualitasBahan}`;
  const hargaPokokPerMeter = HARGA_POKOK_PER_METER[key] ?? 0;

  const luas = Math.max(panjang, 0) * Math.max(lebar, 0);
  const biayaCetak = luas * hargaPokokPerMeter * Math.max(jumlahCetak, 0);

  const biayaFinishing =
    finishing === "Mata Ayam"
      ? Math.max(jumlahMataAyam, 0) * HARGA_MATA_AYAM_PER_PCS * Math.max(jumlahCetak, 0)
      : 0;

  const subtotal = biayaCetak + biayaFinishing;

  return {
    unit: "pcs",
    subtotal,
    breakdown: [
      {
        label: `Cetak (${luas.toFixed(2)} m² x ${jumlahCetak} pcs x Rp${hargaPokokPerMeter.toLocaleString(
          "id-ID"
        )}/m²)`,
        amount: biayaCetak,
      },
      ...(finishing === "Mata Ayam"
        ? [
            {
              label: `Finishing Mata Ayam (${jumlahMataAyam} pcs x ${jumlahCetak})`,
              amount: biayaFinishing,
            },
          ]
        : []),
    ],
  };
}

/**
 * TODO: DUPLIKASI_POLA_INI untuk 9 kategori lain:
 * 1. Buat interface variabel di `types.ts` (contoh: BrosurVariables).
 * 2. Buat file baru di sini, misal `brosurPricing.ts`, dengan fungsi
 *    `calculateBrosurPrice(vars: BrosurVariables): PriceResult`.
 * 3. Simpan data harga pokok sebagai konstanta lokal (data dummy dulu),
 *    JANGAN hardcode angka langsung di dalam rumus.
 * 4. Buat komponen kalkulator di
 *    `components/product/calculators/<Nama>Calculator.tsx` mengikuti pola
 *    `BannerCalculator.tsx` — komponen hanya mengelola state form + memanggil
 *    fungsi pricing ini, tidak pernah menghitung manual di dalam JSX.
 */
