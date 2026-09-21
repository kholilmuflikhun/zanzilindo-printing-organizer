// src/components/home/ProductCarousel.tsx
"use client";

import Link from "next/link";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductDetail } from "@/lib/products";
import { formatRupiah } from "@/lib/utils/format";

interface ProductCarouselProps {
  title: string;
  products: ProductDetail[];
}

export default function ProductCarousel({ title, products }: ProductCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  function scrollByAmount(amount: number) {
    scrollRef.current?.scrollBy({ left: amount, behavior: "smooth" });
  }

  if (products.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">{title}</h2>
        <div className="hidden gap-2 sm:flex">
          <button
            onClick={() => scrollByAmount(-320)}
            aria-label="Geser ke kiri"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 transition hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => scrollByAmount(320)}
            aria-label="Geser ke kanan"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 transition hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex snap-x gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {products.map((product) => (
          <Link
            key={product.slug}
            href={`/produk/${product.slug}`}
            className="w-56 shrink-0 snap-start rounded-2xl border border-gray-200 bg-white p-3 transition hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
          >
            {/* TODO: GANTI_DENGAN_next/image SETELAH domain gambar asli dikonfigurasi di next.config.mjs */}
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
    </section>
  );
}
