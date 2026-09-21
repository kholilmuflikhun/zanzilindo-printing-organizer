// src/lib/pricing/kartuNamaPricing.ts
import { KartuNamaVariables, PriceResult } from "./types";

// TODO: GANTI_DENGAN_HARGA_POKOK_ASLI_ANDA — harga per box (1 box = 100 pcs).
const HARGA_POKOK_PER_BOX: Record<string, number> = {
  Ivory: 35000,
  Sintetis: 60000,
}; // TODO: TAMBAH_JENIS_KERTAS_LAIN

const BIAYA_SISI_TAMBAHAN_PER_BOX = 10000; // TODO: GANTI_DENGAN_HARGA_ASLI — cetak 2 sisi

export function calculateKartuNamaPrice(vars: KartuNamaVariables): PriceResult {
  const { jenisKertas, sisiCetak, jumlah } = vars;

  const hargaPokokPerBox = HARGA_POKOK_PER_BOX[jenisKertas] ?? 0;
  const biayaCetak = hargaPokokPerBox * Math.max(jumlah, 0);
  const biayaSisi = sisiCetak === 2 ? BIAYA_SISI_TAMBAHAN_PER_BOX * Math.max(jumlah, 0) : 0;
  const subtotal = biayaCetak + biayaSisi;

  return {
    unit: "box",
    subtotal,
    breakdown: [
      {
        label: `Kartu Nama ${jenisKertas} (${jumlah} box x Rp${hargaPokokPerBox.toLocaleString(
          "id-ID"
        )})`,
        amount: biayaCetak,
      },
      ...(sisiCetak === 2
        ? [{ label: `Cetak 2 Sisi (${jumlah} box)`, amount: biayaSisi }]
        : []),
    ],
  };
}
