// src/lib/pricing/merchandisePricing.ts
import { MerchandiseVariables, MerchandiseSubKategori, PriceResult } from "./types";

// TODO: GANTI_DENGAN_HARGA_POKOK_ASLI_ANDA — harga dasar per pcs, per sub-kategori.
// Untuk merchandise, harga sangat bergantung pada `spesifikasi` dan `bahan`
// (mis. ukuran plakat, bahan lanyard) — data di bawah adalah harga DASAR
// sebelum penyesuaian manual admin (lihat catatan di bawah fungsi).
const HARGA_DASAR_PER_PCS: Record<MerchandiseSubKategori, number> = {
  Plakat: 50000,
  Piala: 75000,
  "ID Card": 15000,
  "Tali Lanyard": 12000,
  "Cangkir MUG": 25000,
  Topi: 35000,
  "PIN Bros/Magnet": 8000,
  Ganci: 7000,
};

export function calculateMerchandisePrice(vars: MerchandiseVariables): PriceResult {
  const { subKategori, jumlahCetak } = vars;

  const hargaDasarPerPcs = HARGA_DASAR_PER_PCS[subKategori];
  const subtotal = hargaDasarPerPcs * Math.max(jumlahCetak, 0);

  return {
    unit: "pcs",
    subtotal,
    breakdown: [
      {
        label: `${subKategori} (${jumlahCetak} pcs x Rp${hargaDasarPerPcs.toLocaleString("id-ID")})`,
        amount: subtotal,
      },
    ],
  };
}

/**
 * CATATAN: karena variasi bahan & spesifikasi merchandise sangat luas
 * (contoh: ukuran plakat akrilik vs kayu, bahan lanyard woven vs sublim),
 * harga dasar di atas adalah estimasi awal yang ditampilkan real-time ke
 * pengunjung. TODO: TAMBAHKAN_KONFIRMASI_ADMIN sebelum harga final
 * dikirim ke Midtrans jika bisnis Anda perlu menyesuaikan harga manual
 * per pesanan merchandise (mis. via status order tambahan "Menunggu Konfirmasi Harga").
 */
