// src/lib/pricing/kalenderPricing.ts
import { KalenderVariables, PriceResult } from "./types";

// TODO: GANTI_DENGAN_HARGA_POKOK_ASLI_ANDA — harga per pcs, per jenis kalender.
const HARGA_POKOK_PER_PCS: Record<KalenderVariables["jenisKalender"], number> = {
  Dinding: 25000,
  Meja: 20000,
};

const BIAYA_FINISHING_PER_PCS: Record<KalenderVariables["finishing"], number> = {
  "Spiral Besi": 5000, // TODO: GANTI_DENGAN_HARGA_ASLI
  "Spiral Plastik": 3000,
  "Plat Besi": 8000,
};

export function calculateKalenderPrice(vars: KalenderVariables): PriceResult {
  const { jenisKalender, sisiCetak, finishing, jumlahCetak } = vars;

  const hargaPokokPerPcs = HARGA_POKOK_PER_PCS[jenisKalender];
  const biayaFinishingPerPcs = BIAYA_FINISHING_PER_PCS[finishing];
  const pengaliSisi = sisiCetak === 2 ? 1.5 : 1; // TODO: SESUAIKAN_PENGALI sesuai kebijakan harga Anda

  const biayaCetak = hargaPokokPerPcs * pengaliSisi * Math.max(jumlahCetak, 0);
  const biayaFinishing = biayaFinishingPerPcs * Math.max(jumlahCetak, 0);
  const subtotal = biayaCetak + biayaFinishing;

  return {
    unit: "pcs",
    subtotal,
    breakdown: [
      {
        label: `Kalender ${jenisKalender} ${sisiCetak} Sisi (${jumlahCetak} pcs)`,
        amount: biayaCetak,
      },
      { label: `Finishing ${finishing} (${jumlahCetak} pcs)`, amount: biayaFinishing },
    ],
  };
}
