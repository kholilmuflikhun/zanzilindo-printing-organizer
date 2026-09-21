// src/lib/pricing/bukuNotaPricing.ts
import { BukuNotaVariables, PriceResult } from "./types";

// TODO: GANTI_DENGAN_HARGA_POKOK_ASLI_ANDA — data dummy per rim, per jenis kertas + jumlah rangkap.
const HARGA_POKOK_PER_RIM: Record<string, number> = {
  "HVS-1": 300000,
  "HVS-2": 500000,
  "HVS-3": 700000,
  "NCR-1": 400000,
  "NCR-2": 650000,
  "NCR-3": 900000,
};

const BIAYA_FINISHING_PER_RIM: Record<BukuNotaVariables["finishing"], number> = {
  "Jilid Lem": 20000, // TODO: GANTI_DENGAN_HARGA_ASLI
  "Jilid Spiral": 30000,
  "Tanpa Finishing": 0,
};

export function calculateBukuNotaPrice(vars: BukuNotaVariables): PriceResult {
  const { jenisKertas, jumlahRangkap, finishing, jumlahCetak } = vars;

  const key = `${jenisKertas}-${jumlahRangkap}`;
  const hargaPokokPerRim = HARGA_POKOK_PER_RIM[key] ?? 0;
  const biayaFinishingPerRim = BIAYA_FINISHING_PER_RIM[finishing];

  const biayaCetak = hargaPokokPerRim * Math.max(jumlahCetak, 0);
  const biayaFinishing = biayaFinishingPerRim * Math.max(jumlahCetak, 0);
  const subtotal = biayaCetak + biayaFinishing;

  return {
    unit: "rim",
    subtotal,
    breakdown: [
      {
        label: `Cetak Buku Nota ${jumlahRangkap} Rangkap (${jumlahCetak} rim x Rp${hargaPokokPerRim.toLocaleString(
          "id-ID"
        )}/rim)`,
        amount: biayaCetak,
      },
      ...(finishing !== "Tanpa Finishing"
        ? [{ label: `Finishing ${finishing} (${jumlahCetak} rim)`, amount: biayaFinishing }]
        : []),
    ],
  };
}
