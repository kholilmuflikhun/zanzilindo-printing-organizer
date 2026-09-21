// src/lib/pricing/brosurPricing.ts
import { BrosurVariables, PriceResult } from "./types";

/**
 * TODO: GANTI_DENGAN_HARGA_POKOK_ASLI_ANDA — data dummy untuk keperluan
 * development UI. Harga per rim, dikelompokkan mesin + kualitas kertas.
 */
const HARGA_POKOK_PER_RIM: Record<string, number> = {
  "Offset-Standar": 350000,
  "Offset-Premium": 550000,
  "Digital Printing-Standar": 400000,
  "Digital Printing-Premium": 600000,
};

const BIAYA_LIPATAN_PER_RIM = 25000; // TODO: GANTI_DENGAN_HARGA_ASLI — dikenakan per lipatan tambahan (lipatan 2)
const BIAYA_SISI_TAMBAHAN_PER_RIM = 75000; // TODO: GANTI_DENGAN_HARGA_ASLI — cetak 2 sisi

export function calculateBrosurPrice(vars: BrosurVariables): PriceResult {
  const { jenisMesin, kualitasKertas, lipatan, sisiCetak, jumlahCetak } = vars;

  const key = `${jenisMesin}-${kualitasKertas}`;
  const hargaPokokPerRim = HARGA_POKOK_PER_RIM[key] ?? 0;

  const biayaCetak = hargaPokokPerRim * Math.max(jumlahCetak, 0);
  const biayaLipatan = lipatan === 2 ? BIAYA_LIPATAN_PER_RIM * Math.max(jumlahCetak, 0) : 0;
  const biayaSisi = sisiCetak === 2 ? BIAYA_SISI_TAMBAHAN_PER_RIM * Math.max(jumlahCetak, 0) : 0;

  const subtotal = biayaCetak + biayaLipatan + biayaSisi;

  return {
    unit: "rim",
    subtotal,
    breakdown: [
      {
        label: `Cetak Brosur (${jumlahCetak} rim x Rp${hargaPokokPerRim.toLocaleString("id-ID")}/rim)`,
        amount: biayaCetak,
      },
      ...(lipatan === 2
        ? [{ label: `Biaya Lipatan 2x (${jumlahCetak} rim)`, amount: biayaLipatan }]
        : []),
      ...(sisiCetak === 2
        ? [{ label: `Cetak 2 Sisi (${jumlahCetak} rim)`, amount: biayaSisi }]
        : []),
    ],
  };
}
