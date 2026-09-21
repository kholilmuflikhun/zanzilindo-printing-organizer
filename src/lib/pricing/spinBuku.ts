// src/lib/pricing/spinBuku.ts

export interface SpinBukuVariables {
  jumlahHalaman: number;
  jenisKertasIsi: string;
  gramasiKertasIsi: 70 | 80;
  jenisCover: "Hardcover" | "Softcover";
}

/**
 * TODO: GANTI_DENGAN_DATA_BULK_KERTAS_ASLI (biasanya didapat dari spesifikasi
 * supplier kertas — "bulk" = ketebalan per lembar, bukan sekadar gramasi).
 * Data di bawah adalah estimasi umum industri percetakan, dalam milimeter
 * per LEMBAR (bukan per halaman — 1 lembar = 2 halaman, bolak-balik).
 */
const KETEBALAN_KERTAS_MM_PER_LEMBAR: Record<string, number> = {
  "HVS-70": 0.09,
  "HVS-80": 0.1,
  "Book Paper-70": 0.115,
  "Book Paper-80": 0.125,
  "Art Paper-70": 0.08,
  "Art Paper-80": 0.09,
};
const KETEBALAN_DEFAULT_MM_PER_LEMBAR = 0.1; // fallback jika kombinasi kertas belum ada di tabel

// TODO: GANTI_DENGAN_UKURAN_ASLI — perkiraan tambahan tebal cover (board + laminasi untuk hardcover).
const KETEBALAN_COVER_MM: Record<SpinBukuVariables["jenisCover"], number> = {
  Hardcover: 3,
  Softcover: 0.3,
};

/**
 * Menghitung estimasi ketebalan spin (punggung) buku dalam milimeter.
 * Rumus: (jumlah halaman / 2) x ketebalan kertas per lembar + tebal cover.
 */
export function calculateSpinThickness(vars: SpinBukuVariables): number {
  const key = `${vars.jenisKertasIsi}-${vars.gramasiKertasIsi}`;
  const ketebalanPerLembar = KETEBALAN_KERTAS_MM_PER_LEMBAR[key] ?? KETEBALAN_DEFAULT_MM_PER_LEMBAR;

  const jumlahLembar = Math.max(vars.jumlahHalaman, 0) / 2;
  const tebalIsi = jumlahLembar * ketebalanPerLembar;
  const tebalCover = KETEBALAN_COVER_MM[vars.jenisCover];

  return Math.round((tebalIsi + tebalCover) * 100) / 100; // bulatkan 2 desimal
}
