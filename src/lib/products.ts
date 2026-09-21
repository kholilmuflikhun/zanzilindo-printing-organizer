// src/lib/products.ts
import { prisma } from "@/lib/prisma";
import { ProductCategory as PrismaProductCategory, Prisma } from "@prisma/client";

export interface ProductSlugEntry {
  slug: string;
  updatedAt: Date;
}

export interface ProductDetail extends ProductSlugEntry {
  id: string;
  name: string;
  category: string; // kebab-case, contoh: "kartu-nama" — dipakai di URL & komponen kalkulator
  shortDescription: string;
  imageUrl: string;
  startingPrice: number;
}

/**
 * Skema Prisma menyimpan kategori sebagai enum SCREAMING_SNAKE_CASE
 * (mis. KARTU_NAMA), sedangkan URL & komponen kalkulator di frontend memakai
 * kebab-case (mis. "kartu-nama"). Mapping ini menjaga keduanya tetap konsisten
 * di satu tempat saja.
 */
const CATEGORY_ENUM_TO_SLUG: Record<PrismaProductCategory, string> = {
  BANNER: "banner",
  BROSUR: "brosur",
  BUKU_NOTA: "buku-nota",
  BUKU_CUSTOM: "buku-custom",
  CETAK_A3_PLUS: "cetak-a3-plus",
  KARTU_NAMA: "kartu-nama",
  DOKUMEN: "dokumen",
  STIKER: "stiker",
  KALENDER: "kalender",
  MERCHANDISE: "merchandise",
};

/**
 * Satu-satunya sumber daftar kategori (slug + label tampilan) untuk seluruh
 * frontend — dipakai Home (shortcut kategori), halaman Produk (filter
 * kategori), dan Kalkulator Harga Global (Simulator). Sebelumnya tiap
 * tempat itu punya daftar hardcode sendiri-sendiri dengan komentar
 * "TODO: SINKRONKAN" — sekarang cukup import CATEGORY_OPTIONS dari sini.
 */
export const CATEGORY_OPTIONS: { slug: string; label: string }[] = [
  { slug: "banner", label: "Banner" },
  { slug: "brosur", label: "Brosur" },
  { slug: "buku-nota", label: "Buku Nota" },
  { slug: "buku-custom", label: "Buku Custom" },
  { slug: "cetak-a3-plus", label: 'Cetak "A3+"' },
  { slug: "kartu-nama", label: "Kartu Nama" },
  { slug: "dokumen", label: "Dokumen" },
  { slug: "stiker", label: "Stiker" },
  { slug: "kalender", label: "Kalender" },
  { slug: "merchandise", label: "Merchandise" },
];

function toProductDetail(product: {
  id: string;
  slug: string;
  name: string;
  category: PrismaProductCategory;
  shortDescription: string;
  imageUrl: string;
  startingPrice: number;
  updatedAt: Date;
}): ProductDetail {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    category: CATEGORY_ENUM_TO_SLUG[product.category],
    shortDescription: product.shortDescription,
    imageUrl: product.imageUrl,
    startingPrice: product.startingPrice,
    updatedAt: product.updatedAt,
  };
}

function categorySlugToEnum(categorySlug: string): PrismaProductCategory | null {
  const entry = Object.entries(CATEGORY_ENUM_TO_SLUG).find(([, slug]) => slug === categorySlug);
  return entry ? (entry[0] as PrismaProductCategory) : null;
}

export async function getAllProductSlugs(): Promise<ProductSlugEntry[]> {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    select: { slug: true, updatedAt: true },
  });
  return products;
}

/**
 * Mengambil produk terbaru untuk carousel Home. `limit` dibatasi wajar agar
 * carousel tidak memuat ratusan produk sekaligus di initial load.
 */
export async function getAllProducts(limit = 12): Promise<ProductDetail[]> {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return products.map(toProductDetail);
}

export async function getProductBySlug(slug: string): Promise<ProductDetail | null> {
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product || !product.isActive) return null;
  return toProductDetail(product);
}

// ============================================================================
// Halaman Produk (listing): filter + sorting
// ============================================================================

export type ProductFilter = "relevan" | "populer" | "baru" | "terlaris";
export type PriceSort = "asc" | "desc";

export interface GetProductsOptions {
  categorySlug?: string;
  filter?: ProductFilter;
  priceSort?: PriceSort;
}

function resolveOrderBy(
  filter: ProductFilter,
  priceSort?: PriceSort
): Prisma.ProductOrderByWithRelationInput {
  // Sorting harga (jika dipilih user) selalu jadi prioritas utama —
  // menimpa filter kategori di atas, sesuai perilaku umum e-commerce
  // (user yang sudah pilih "Harga Rendah ke Tinggi" tidak ingin itu
  // ditimpa diam-diam oleh filter Populer/Terlaris).
  if (priceSort) {
    return { startingPrice: priceSort };
  }

  switch (filter) {
    case "baru":
      return { createdAt: "desc" };
    case "populer":
      // Proksi popularitas: jumlah ulasan terbanyak.
      // TODO: GANTI_DENGAN_METRIK_VIEW_COUNT jika nanti ada tracking kunjungan produk.
      return { reviews: { _count: "desc" } };
    case "terlaris":
      // Proksi terlaris: jumlah baris OrderItem terbanyak (frekuensi dibeli).
      // TODO: PERTIMBANGKAN_SUM_QUANTITY (bukan hanya jumlah baris) jika ingin
      // "terlaris" dihitung dari total pcs terjual, bukan jumlah transaksi.
      return { orderItems: { _count: "desc" } };
    case "relevan":
    default:
      // Tanpa fitur pencarian teks, "Relevan" belum punya skor sungguhan.
      // TODO: GANTI_DENGAN_SKOR_RELEVANSI_PENCARIAN begitu ada search bar produk.
      return { createdAt: "desc" };
  }
}

export async function getProducts(options: GetProductsOptions = {}): Promise<ProductDetail[]> {
  const { categorySlug, filter = "relevan", priceSort } = options;

  const categoryEnum = categorySlug ? categorySlugToEnum(categorySlug) : null;

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      ...(categoryEnum ? { category: categoryEnum } : {}),
    },
    orderBy: resolveOrderBy(filter, priceSort),
  });

  return products.map(toProductDetail);
}
