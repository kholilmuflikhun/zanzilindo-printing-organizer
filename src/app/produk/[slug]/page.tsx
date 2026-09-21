// src/app/produk/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/products";
import AddToCartPanel from "@/components/product/AddToCartPanel";
import ReviewList from "@/components/review/ReviewList";
import { formatRupiah } from "@/lib/utils/format";

interface ProductPageProps {
  params: { slug: string };
}

// Meta tags dinamis per halaman produk — WAJIB sesuai spesifikasi SEO.
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    return { title: "Produk Tidak Ditemukan" };
  }

  return {
    title: product.name,
    description: product.shortDescription,
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      images: [{ url: product.imageUrl }],
      type: "website",
    },
    alternates: {
      canonical: `/produk/${product.slug}`, // TODO: PASTIKAN_metadataBase_DI_ROOT_LAYOUT_SUDAH_DIISI_DOMAIN_ASLI
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription,
    image: product.imageUrl,
    offers: {
      "@type": "Offer",
      priceCurrency: "IDR",
      price: product.startingPrice,
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 lg:px-8">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div>
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">{product.shortDescription}</p>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Mulai dari{" "}
            <span className="font-semibold text-brand">{formatRupiah(product.startingPrice)}</span>
          </p>
        </div>

        {/*
          Kalkulator Harga Produk Spesifik — WAJIB ada di setiap halaman detail
          produk sesuai spesifikasi. AddToCartPanel membungkus CategoryCalculator
          (pilih kalkulator sesuai product.category) + tombol "Tambah ke Keranjang".
        */}
        <AddToCartPanel
          productId={product.id}
          productSlug={product.slug}
          productName={product.name}
          category={product.category}
        />
      </div>

      <div className="mt-12">
        <h2 className="mb-4 text-xl font-bold">Ulasan Produk</h2>
        {/*
          Sesuai spesifikasi: ulasan hanya bisa DIBUAT setelah status pesanan
          "Diterima" — form pembuatan ulasan ada di halaman Tracking Pesanan
          member (belum termasuk batch ini), bukan di sini. Halaman ini hanya
          MENAMPILKAN ulasan yang sudah ada.
        */}
        <ReviewList productId={product.id} />
      </div>
    </div>
  );
}
