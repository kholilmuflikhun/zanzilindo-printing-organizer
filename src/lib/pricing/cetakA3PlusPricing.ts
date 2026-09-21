// src/lib/pricing/cetakA3PlusPricing.ts
import { CetakA3PlusVariables, PriceResult } from "./types";

// TODO: GANTI_DENGAN_HARGA_POKOK_ASLI_ANDA — harga per lembar, per jenis kertas.
const HARGA_POKOK_PER_LEMBAR: Record<string, number> = {
  Ivory: 3000,
  Chromo: 3500,
  Vynil: 5000,
  Transparant: 6000,
  "Art Paper": 2500,
  Aster: 4000,
  BC: 3200,
  Linen: 4500,
  Hammer: 4500,
}; // TODO: TAMBAH_JENIS_KERTAS_LAIN sesuai kebutuhan

const BIAYA_FINISHING_PER_LEMBAR: Record<CetakA3PlusVariables["finishing"], number> = {
  "Potong Cross": 500, // TODO: GANTI_DENGAN_HARGA_ASLI
  Kisscut: 1500,
  Diecut: 3000,
  Lembaran: 0,
};

export function calculateCetakA3PlusPrice(vars: CetakA3PlusVariables): PriceResult {
  const { jenisKertas, finishing, jumlahCetak } = vars;

  const hargaPokokPerLembar = HARGA_POKOK_PER_LEMBAR[jenisKertas] ?? 0;
  const biayaFinishingPerLembar = BIAYA_FINISHING_PER_LEMBAR[finishing];

  const biayaCetak = hargaPokokPerLembar * Math.max(jumlahCetak, 0);
  const biayaFinishing = biayaFinishingPerLembar * Math.max(jumlahCetak, 0);
  const subtotal = biayaCetak + biayaFinishing;

  return {
    unit: "lembar",
    subtotal,
    breakdown: [
      {
        label: `Cetak ${jenisKertas} (${jumlahCetak} lembar x Rp${hargaPokokPerLembar.toLocaleString(
          "id-ID"
        )})`,
        amount: biayaCetak,
      },
      ...(finishing !== "Lembaran"
        ? [{ label: `Finishing ${finishing} (${jumlahCetak} lembar)`, amount: biayaFinishing }]
        : []),
    ],
  };
}
