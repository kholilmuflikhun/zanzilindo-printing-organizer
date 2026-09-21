// src/lib/pricing/types.ts

/** Hasil kalkulasi harga yang dikembalikan setiap fungsi pricing kategori. */
export interface PriceResult {
  subtotal: number;
  breakdown: { label: string; amount: number }[];
  unit: string; // contoh: "meter", "rim", "lembar", "pcs", "box"
}

/** Variabel kalkulator kategori Banner. */
export interface BannerVariables {
  mesin: "Indoor" | "Outdoor";
  jenisBahan: string;
  merkBahan: string;
  kualitasBahan: "Standar" | "Premium";
  gramasi: number; // gsm
  panjang: number; // meter
  lebar: number; // meter
  jumlahCetak: number; // pcs
  finishing: "Mata Ayam" | "Polos";
  jumlahMataAyam: number; // pcs, hanya relevan jika finishing = "Mata Ayam"
}

/** Variabel kalkulator kategori Brosur. */
export interface BrosurVariables {
  jenisMesin: "Offset" | "Digital Printing";
  jenisKertas: string;
  merkKertas: string;
  kualitasKertas: "Standar" | "Premium";
  ukuran: "A4" | "A5" | "F4";
  lipatan: 1 | 2;
  sisiCetak: 1 | 2;
  gramasiKertas: number; // gsm
  jumlahCetak: number; // rim (1 rim = 500 lembar)
}

/** Variabel kalkulator kategori Buku Nota. */
export interface BukuNotaVariables {
  jenisKertas: "HVS" | "NCR";
  jumlahRangkap: 1 | 2 | 3; // ply
  finishing: "Jilid Lem" | "Jilid Spiral" | "Tanpa Finishing";
  jumlahCetak: number; // rim
}

/** Variabel kalkulator kategori Buku Custom. */
export interface BukuCustomVariables {
  jenisKertasIsi: string; // Book Paper, HVS, dll
  jenisCover: "Hardcover" | "Softcover";
  orientasi: "Portrait" | "Landscape";
  jumlahHalaman: number; // dipakai untuk menghitung tebalSpin otomatis — lihat lib/pricing/spinBuku.ts
  ukuranBuku: "A6" | "A5" | "B5" | "A4" | "F4";
  gramasiKertasIsi: 70 | 80;
  jumlahCetak: number; // eksemplar
}

/** Variabel kalkulator kategori Cetak "A3+". */
export interface CetakA3PlusVariables {
  jenisKertas: string; // Ivory, Chromo, Vynil, Transparant, Art Paper, Aster, BC, Linen, Hammer, dll
  gramasi: number; // gsm
  finishing: "Potong Cross" | "Kisscut" | "Diecut" | "Lembaran";
  jumlahCetak: number; // lembar
}

/** Variabel kalkulator kategori Kartu Nama. */
export interface KartuNamaVariables {
  jenisKertas: string; // Ivory, Sintetis, dll
  gramasi: number; // gsm
  sisiCetak: 1 | 2;
  jumlah: number; // box (1 box = 100 pcs)
}

/** Variabel kalkulator kategori Dokumen. */
export interface DokumenVariables {
  jenisKertas: string; // HVS, HVS Warna, dll
  sisiCetak: 1 | 2;
  jumlahCetak: number; // lembar
}

/** Variabel kalkulator kategori Stiker. */
export interface StikerVariables {
  jenisMesin: "A3+" | "Indoor" | "Outdoor";
  jenisKertas: string; // Chromo, Vynil, Transparant, dll
  // Satuan hitung mengikuti mesin: A3+ => lembar, Indoor/Outdoor => meter.
  jumlahCetak: number;
  finishing: "Potong Cross" | "Kisscut" | "Diecut" | "Lembaran";
}

/** Variabel kalkulator kategori Kalender. */
export interface KalenderVariables {
  jenisKalender: "Dinding" | "Meja";
  jumlahBulanPerLembar: 1 | 2 | 3 | 4 | 6 | 12;
  sisiCetak: 1 | 2;
  finishing: "Spiral Besi" | "Spiral Plastik" | "Plat Besi";
  jumlahCetak: number; // pcs
}

/** Sub-kategori Merchandise sesuai spesifikasi. */
export type MerchandiseSubKategori =
  | "Plakat"
  | "Piala"
  | "ID Card"
  | "Tali Lanyard"
  | "Cangkir MUG"
  | "Topi"
  | "PIN Bros/Magnet"
  | "Ganci";

/** Variabel kalkulator kategori Merchandise. */
export interface MerchandiseVariables {
  subKategori: MerchandiseSubKategori;
  spesifikasi: string; // free text: ukuran/model, tergantung sub-kategori
  bahan: string;
  jumlahCetak: number; // pcs
}
