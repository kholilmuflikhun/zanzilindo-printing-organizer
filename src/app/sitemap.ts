// src/app/sitemap.ts
import type { MetadataRoute } from "next";
import { getAllProductSlugs } from "@/lib/products";

const SITE_URL = "https://zanzilindo.com"; // TODO: GANTI_DENGAN_DOMAIN_ASLI_ANDA

// Daftar kategori produk statis — dipakai untuk halaman listing per kategori.
// TODO: SESUAIKAN_JIKA_STRUKTUR_URL_KATEGORI_BERBEDA (misal /produk/kategori/banner)
const PRODUCT_CATEGORIES = [
  "banner",
  "brosur",
  "buku-nota",
  "buku-custom",
  "cetak-a3-plus",
  "kartu-nama",
  "dokumen",
  "stiker",
  "kalender",
  "merchandise",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/produk`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/simulator`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/kontak`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/about-us`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/faq`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/privacy-policy`, changeFrequency: "yearly", priority: 0.3 },
  ];

  const categoryPages: MetadataRoute.Sitemap = PRODUCT_CATEGORIES.map((category) => ({
    url: `${SITE_URL}/produk?kategori=${category}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const productEntries = await getAllProductSlugs();
  const productPages: MetadataRoute.Sitemap = productEntries.map((product) => ({
    url: `${SITE_URL}/produk/${product.slug}`,
    lastModified: product.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticPages, ...categoryPages, ...productPages];
}
