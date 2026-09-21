// prisma/seed.ts
import { PrismaClient, ProductCategory } from "@prisma/client";

const prisma = new PrismaClient();

// TODO: TAMBAH_PRODUK_ASLI_ANDA di sini, atau buat halaman admin untuk CRUD produk.
// Satu produk contoh per kategori, supaya seluruh 10 kalkulator kategori bisa langsung dites.
const PRODUCTS = [
  {
    slug: "banner-flexi-korea-outdoor",
    name: "Banner Flexi Korea Outdoor",
    category: ProductCategory.BANNER,
    shortDescription:
      "Cetak banner outdoor bahan Flexi Korea, tahan cuaca, cocok untuk promosi luar ruangan.",
    imageUrl: "/images/banner-flexi-korea.jpg", // TODO: GANTI_DENGAN_GAMBAR_ASLI
    startingPrice: 20000,
  },
  {
    slug: "brosur-a4-glossy",
    name: "Brosur A4 Glossy",
    category: ProductCategory.BROSUR,
    shortDescription: "Brosur ukuran A4 finishing glossy, cocok untuk katalog produk.",
    imageUrl: "/images/brosur-a4-glossy.jpg",
    startingPrice: 1500,
  },
  {
    slug: "buku-nota-ncr-2ply",
    name: "Buku Nota NCR 2 Ply",
    category: ProductCategory.BUKU_NOTA,
    shortDescription: "Nota rangkap 2 (putih-kuning), cocok untuk transaksi toko/usaha.",
    imageUrl: "/images/buku-nota-ncr.jpg",
    startingPrice: 500000,
  },
  {
    slug: "buku-yearbook-hardcover",
    name: "Buku Yearbook Hardcover",
    category: ProductCategory.BUKU_CUSTOM,
    shortDescription: "Buku tahunan sekolah cover hardcover, cetak full color.",
    imageUrl: "/images/buku-yearbook.jpg",
    startingPrice: 45000,
  },
  {
    slug: "poster-a3-plus-art-paper",
    name: "Poster A3+ Art Paper",
    category: ProductCategory.CETAK_A3_PLUS,
    shortDescription: "Cetak poster A3+ di atas Art Paper, hasil tajam & warna cerah.",
    imageUrl: "/images/poster-a3-plus.jpg",
    startingPrice: 2500,
  },
  {
    slug: "kartu-nama-ivory",
    name: "Kartu Nama Ivory",
    category: ProductCategory.KARTU_NAMA,
    shortDescription: "Kartu nama bahan Ivory premium, cetak dua sisi.",
    imageUrl: "/images/kartu-nama-ivory.jpg",
    startingPrice: 75000,
  },
  {
    slug: "dokumen-hvs-1-sisi",
    name: "Cetak Dokumen HVS 1 Sisi",
    category: ProductCategory.DOKUMEN,
    shortDescription: "Cetak dokumen HVS satuan lembar, cocok untuk kebutuhan administrasi.",
    imageUrl: "/images/dokumen-hvs.jpg",
    startingPrice: 300,
  },
  {
    slug: "stiker-vynil-outdoor",
    name: "Stiker Vynil Outdoor",
    category: ProductCategory.STIKER,
    shortDescription: "Stiker bahan Vynil tahan air & sinar UV untuk kebutuhan outdoor.",
    imageUrl: "/images/stiker-vynil.jpg",
    startingPrice: 6000,
  },
  {
    slug: "kalender-dinding-2027",
    name: "Kalender Dinding 2027",
    category: ProductCategory.KALENDER,
    shortDescription: "Kalender dinding custom foto/logo perusahaan, finishing spiral.",
    imageUrl: "/images/kalender-dinding.jpg",
    startingPrice: 25000,
  },
  {
    slug: "plakat-akrilik-custom",
    name: "Plakat Akrilik Custom",
    category: ProductCategory.MERCHANDISE,
    shortDescription: "Plakat penghargaan akrilik custom desain & ukuran.",
    imageUrl: "/images/plakat-akrilik.jpg",
    startingPrice: 50000,
  },
];

async function main() {
  for (const product of PRODUCTS) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product,
    });
  }
  console.log(`Seed selesai: ${PRODUCTS.length} produk (1 per kategori).`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
