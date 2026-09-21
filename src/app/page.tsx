// src/app/page.tsx
import Link from "next/link";
import BannerSlider from "@/components/home/BannerSlider";
import ProductCarousel from "@/components/home/ProductCarousel";
import { getAllProducts, CATEGORY_OPTIONS } from "@/lib/products";
import { CATEGORY_ICON, DEFAULT_CATEGORY_ICON } from "@/lib/categoryIcons";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const latestProducts = await getAllProducts(12);

  return (
    <div>
      <div className="mx-auto max-w-7xl px-4 pt-6 lg:px-8">
        <BannerSlider />
      </div>

      {/* Shortcut kategori */}
      <section className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <h2 className="mb-4 text-xl font-bold">Kategori Produk</h2>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
          {CATEGORY_OPTIONS.map((cat) => {
            const Icon = CATEGORY_ICON[cat.slug] ?? DEFAULT_CATEGORY_ICON;
            return (
              <Link
                key={cat.slug}
                href={`/produk?kategori=${cat.slug}`}
                className="flex flex-col items-center gap-2 rounded-2xl border border-gray-200 bg-white p-4 text-center transition hover:border-brand hover:shadow-sm dark:border-gray-800 dark:bg-gray-900"
              >
                <Icon size={24} className="text-brand" />
                <span className="text-xs font-medium">{cat.label}</span>
              </Link>
            );
          })}
        </div>
      </section>

      <ProductCarousel title="Produk Terbaru" products={latestProducts} />

      {/* CTA Simulator */}
      <section className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <div className="flex flex-col items-start gap-4 rounded-2xl bg-gray-900 p-8 text-white sm:flex-row sm:items-center sm:justify-between dark:bg-gray-800">
          <div>
            <h2 className="text-xl font-bold">Belum yakin berapa perkiraan harganya?</h2>
            <p className="mt-1 text-sm text-white/70">
              Coba Kalkulator Harga Global atau Simulator Spin Buku di menu Simulator.
            </p>
          </div>
          <Link
            href="/simulator"
            className="shrink-0 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark"
          >
            Buka Simulator
          </Link>
        </div>
      </section>
    </div>
  );
}
