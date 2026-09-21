// src/app/produk/page.tsx
import type { Metadata } from "next";
import { Suspense } from "react";
import { getProducts, CATEGORY_OPTIONS, ProductFilter, PriceSort } from "@/lib/products";
import ProductFilterSort from "@/components/product/ProductFilterSort";
import ProductGridList from "@/components/product/ProductGridList";

export const dynamic = "force-dynamic";

interface ProdukPageProps {
  searchParams: {
    kategori?: string;
    filter?: string;
    urut?: string;
    tampilan?: string;
  };
}

const VALID_FILTERS: ProductFilter[] = ["relevan", "populer", "baru", "terlaris"];
const VALID_PRICE_SORTS: PriceSort[] = ["asc", "desc"];

export async function generateMetadata({ searchParams }: ProdukPageProps): Promise<Metadata> {
  const category = CATEGORY_OPTIONS.find((c) => c.slug === searchParams.kategori);

  return {
    title: category ? `Produk ${category.label}` : "Semua Produk",
    description: category
      ? `Katalog produk ${category.label} Zanzilindo — cetak berkualitas dengan harga transparan.`
      : "Jelajahi seluruh katalog produk percetakan Zanzilindo: banner, brosur, kartu nama, merchandise, dan lainnya.",
  };
}

export default async function ProdukPage({ searchParams }: ProdukPageProps) {
  const activeCategory = searchParams.kategori;
  const activeFilter: ProductFilter = VALID_FILTERS.includes(searchParams.filter as ProductFilter)
    ? (searchParams.filter as ProductFilter)
    : "relevan";
  const activePriceSort: PriceSort | undefined = VALID_PRICE_SORTS.includes(
    searchParams.urut as PriceSort
  )
    ? (searchParams.urut as PriceSort)
    : undefined;
  const activeView: "grid" | "list" = searchParams.tampilan === "list" ? "list" : "grid";

  const products = await getProducts({
    categorySlug: activeCategory,
    filter: activeFilter,
    priceSort: activePriceSort,
  });

  const categoryLabel = CATEGORY_OPTIONS.find((c) => c.slug === activeCategory)?.label;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      <h1 className="mb-1 text-2xl font-bold">{categoryLabel ? `Produk ${categoryLabel}` : "Semua Produk"}</h1>
      <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
        {products.length} produk ditemukan.
      </p>

      {/*
        ProductFilterSort memakai useSearchParams() (via usePathname/useRouter
        yang bergantung pada current URL) — dibungkus Suspense sesuai
        ketentuan App Router, pola yang sama dipakai di LoginForm (batch 6).
      */}
      <Suspense fallback={null}>
        <ProductFilterSort
          activeCategory={activeCategory}
          activeFilter={activeFilter}
          activePriceSort={activePriceSort}
          activeView={activeView}
        />
      </Suspense>

      <ProductGridList products={products} view={activeView} />
    </div>
  );
}
