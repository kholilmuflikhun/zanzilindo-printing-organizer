// src/components/product/ProductGridList.tsx
import Link from "next/link";
import { ProductDetail } from "@/lib/products";
import { formatRupiah } from "@/lib/utils/format";

interface ProductGridListProps {
  products: ProductDetail[];
  view: "grid" | "list";
}

/**
 * Komponen murni presentasi (tidak ada hooks) — aman dirender langsung dari
 * server component (`app/produk/page.tsx`). Mode tampilan ("grid" | "list")
 * dikontrol lewat query string ?tampilan=, dibaca & diteruskan oleh page.tsx.
 */
export default function ProductGridList({ products, view }: ProductGridListProps) {
  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 p-10 text-center text-sm text-gray-500 dark:border-gray-700">
        Tidak ada produk yang cocok dengan filter ini.
      </div>
    );
  }

  if (view === "list") {
    return (
      <div className="space-y-3">
        {products.map((product) => (
          <Link
            key={product.slug}
            href={`/produk/${product.slug}`}
            className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 transition hover:shadow-sm dark:border-gray-800 dark:bg-gray-900"
          >
            {/* TODO: GANTI_DENGAN_next/image SETELAH domain gambar asli dikonfigurasi */}
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-[10px] text-gray-400 dark:bg-gray-800">
              {product.name}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{product.name}</p>
              <p className="mt-1 line-clamp-1 text-sm text-gray-500 dark:text-gray-400">
                {product.shortDescription}
              </p>
              <p className="mt-1 text-sm font-semibold text-brand">
                Mulai {formatRupiah(product.startingPrice)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <Link
          key={product.slug}
          href={`/produk/${product.slug}`}
          className="rounded-2xl border border-gray-200 bg-white p-3 transition hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
        >
          <div className="mb-3 flex h-32 items-center justify-center rounded-xl bg-gray-100 text-xs text-gray-400 dark:bg-gray-800">
            {product.name}
          </div>
          <p className="line-clamp-2 text-sm font-medium">{product.name}</p>
          <p className="mt-1 text-sm font-semibold text-brand">
            Mulai {formatRupiah(product.startingPrice)}
          </p>
        </Link>
      ))}
    </div>
  );
}
