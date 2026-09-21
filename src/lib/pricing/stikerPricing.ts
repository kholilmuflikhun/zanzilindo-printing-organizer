// src/lib/pricing/stikerPricing.ts
import { StikerVariables, PriceResult } from "./types";

// TODO: GANTI_DENGAN_HARGA_POKOK_ASLI_ANDA
// A3+ dihitung per LEMBAR, Indoor/Outdoor dihitung per METER.
const HARGA_POKOK_A3PLUS_PER_LEMBAR: Record<string, number> = {
  Chromo: 4000,
  Vynil: 6000,
  Transparant: 7000,
}; // TODO: TAMBAH_JENIS_KERTAS_LAIN

const HARGA_POKOK_PER_METER: Record<"Indoor" | "Outdoor", number> = {
  Indoor: 30000, // TODO: GANTI_DENGAN_HARGA_ASLI
  Outdoor: 25000,
};

const BIAYA_FINISHING_SATUAN: Record<StikerVariables["finishing"], number> = {
  "Potong Cross": 500, // TODO: GANTI_DENGAN_HARGA_ASLI
  Kisscut: 1500,
  Diecut: 3000,
  Lembaran: 0,
};

export function calculateStikerPrice(vars: StikerVariables): PriceResult {
  const { jenisMesin, jenisKertas, jumlahCetak, finishing } = vars;

  const isA3Plus = jenisMesin === "A3+";
  const unit = isA3Plus ? "lembar" : "meter";

  const hargaPokok = isA3Plus
    ? HARGA_POKOK_A3PLUS_PER_LEMBAR[jenisKertas] ?? 0
    : HARGA_POKOK_PER_METER[jenisMesin as "Indoor" | "Outdoor"];

  const biayaCetak = hargaPokok * Math.max(jumlahCetak, 0);
  const biayaFinishing = BIAYA_FINISHING_SATUAN[finishing] * Math.max(jumlahCetak, 0);
  const subtotal = biayaCetak + biayaFinishing;

  return {
    unit,
    subtotal,
    breakdown: [
      {
        label: `Cetak Stiker ${jenisMesin} ${jenisKertas} (${jumlahCetak} ${unit} x Rp${hargaPokok.toLocaleString(
          "id-ID"
        )})`,
        amount: biayaCetak,
      },
      ...(finishing !== "Lembaran"
        ? [{ label: `Finishing ${finishing} (${jumlahCetak} ${unit})`, amount: biayaFinishing }]
        : []),
    ],
  };
}
