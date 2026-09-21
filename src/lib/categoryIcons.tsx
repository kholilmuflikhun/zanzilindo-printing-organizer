// src/lib/categoryIcons.tsx
import {
  Image,
  FileText,
  Receipt,
  BookOpen,
  Printer,
  Contact,
  File,
  Tag,
  Calendar,
  Gift,
  type LucideIcon,
} from "lucide-react";

/**
 * Satu sumber ikon per kategori produk (slug kebab-case, sama seperti
 * CATEGORY_OPTIONS di lib/products.ts). Pisah dari lib/products.ts karena
 * itu murni data layer (dipakai server & client), sedangkan ini komponen
 * ikon (React) — tapi keduanya WAJIB sinkron kalau ada kategori baru.
 */
export const CATEGORY_ICON: Record<string, LucideIcon> = {
  banner: Image,
  brosur: FileText,
  "buku-nota": Receipt,
  "buku-custom": BookOpen,
  "cetak-a3-plus": Printer,
  "kartu-nama": Contact,
  dokumen: File,
  stiker: Tag,
  kalender: Calendar,
  merchandise: Gift,
};

/** Fallback jika suatu saat ada slug kategori yang belum dipetakan di atas. */
export const DEFAULT_CATEGORY_ICON: LucideIcon = Printer;
