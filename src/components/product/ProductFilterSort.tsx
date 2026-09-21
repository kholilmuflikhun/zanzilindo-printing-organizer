// src/components/product/ProductFilterSort.tsx
"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { LayoutGrid, List } from "lucide-react";
import { CATEGORY_OPTIONS, ProductFilter, PriceSort } from "@/lib/products";

const FILTER_OPTIONS: { value: ProductFilter; label: string }[] = [
  { value: "relevan", label: "Relevan" },
  { value: "populer", label: "Populer" },
  { value: "baru", label: "Baru" },
  { value: "terlaris", label: "Terlaris" },
];

interface ProductFilterSortProps {
  activeCategory?: string;
  activeFilter: ProductFilter;
  activePriceSort?: PriceSort;
  activeView: "grid" | "list";
}

/**
 * Semua kontrol di komponen ini bekerja dengan cara yang sama: baca query
 * string saat ini, ubah satu key, lalu `router.push` ke URL baru. Ini
 * sengaja dipilih (bukan React state biasa) supaya filter/sort/tampilan bisa
 * di-bookmark, di-share, dan tetap benar saat halaman di-refresh — karena
 * `app/produk/page.tsx` membaca query string yang sama untuk fetch data di server.
 */
export default function ProductFilterSort({
  activeCategory,
  activeFilter,
  activePriceSort,
  activeView,
}: ProductFilterSortProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function updateParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === null) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="mb-6 space-y-4">
      {/* Filter kategori */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => updateParam("kategori", null)}
          className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
            !activeCategory
              ? "border-brand bg-brand text-white"
              : "border-gray-300 text-gray-600 hover:border-brand dark:border-gray-700 dark:text-gray-300"
          }`}
        >
          Semua
        </button>
        {CATEGORY_OPTIONS.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => updateParam("kategori", cat.slug)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
              activeCategory === cat.slug
                ? "border-brand bg-brand text-white"
                : "border-gray-300 text-gray-600 hover:border-brand dark:border-gray-700 dark:text-gray-300"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Filter Relevan / Populer / Baru / Terlaris */}
        <div className="flex flex-wrap gap-2">
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => updateParam("filter", opt.value)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                activeFilter === opt.value
                  ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900"
                  : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {/* Sorting harga */}
          <select
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm dark:border-gray-700 dark:bg-gray-800"
            value={activePriceSort ?? ""}
            onChange={(e) => updateParam("urut", e.target.value || null)}
          >
            <option value="">Urutkan Harga</option>
            <option value="asc">Harga: Rendah ke Tinggi</option>
            <option value="desc">Harga: Tinggi ke Rendah</option>
          </select>

          {/* Toggle grid/list */}
          <div className="flex overflow-hidden rounded-lg border border-gray-300 dark:border-gray-700">
            <button
              onClick={() => updateParam("tampilan", "grid")}
              aria-label="Tampilan grid"
              className={`flex items-center px-3 py-1.5 text-sm ${
                activeView === "grid"
                  ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900"
                  : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => updateParam("tampilan", "list")}
              aria-label="Tampilan list"
              className={`flex items-center px-3 py-1.5 text-sm ${
                activeView === "list"
                  ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900"
                  : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
