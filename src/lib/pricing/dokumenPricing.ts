// src/lib/pricing/dokumenPricing.ts
import { DokumenVariables, PriceResult } from "./types";

// TODO: GANTI_DENGAN_HARGA_POKOK_ASLI_ANDA — harga per lembar.
const HARGA_POKOK_PER_LEMBAR: Record<string, number> = {
  HVS: 300,
  "HVS Warna": 500,
}; // TODO: TAMBAH_JENIS_KERTAS_LAIN

export function calculateDokumenPrice(vars: DokumenVariables): PriceResult {
  const { jenisKertas, sisiCetak, jumlahCetak } = vars;

  const hargaPokokPerLembar = HARGA_POKOK_PER_LEMBAR[jenisKertas] ?? 0;
  const pengaliSisi = sisiCetak === 2 ? 1.8 : 1; // TODO: SESUAIKAN_PENGALI — 2 sisi tidak selalu 2x harga

  const subtotal = hargaPokokPerLembar * pengaliSisi * Math.max(jumlahCetak, 0);

  return {
    unit: "lembar",
    subtotal,
    breakdown: [
      {
        label: `Cetak Dokumen ${jenisKertas} ${sisiCetak} Sisi (${jumlahCetak} lembar x Rp${(
          hargaPokokPerLembar * pengaliSisi
        ).toLocaleString("id-ID")})`,
        amount: subtotal,
      },
    ],
  };
}
