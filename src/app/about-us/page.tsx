// src/app/about-us/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { Wallet, Zap, ShieldCheck, Wrench, type LucideIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Kenali Zanzilindo lebih dekat — penyedia layanan percetakan digital printing, offset, dan merchandise custom terpercaya.",
};

// TODO: GANTI_SEMUA_KONTEN_DI_BAWAH_DENGAN_PROFIL_ASLI_PERUSAHAAN_ANDA
const KEUNGGULAN: { title: string; description: string; icon: LucideIcon }[] = [
  {
    title: "Harga Transparan",
    description: "Kalkulator harga real-time di setiap produk, tanpa nego alot dan tanpa biaya tersembunyi.",
    icon: Wallet,
  },
  {
    title: "Proses Cepat",
    description: "Sebagian besar pesanan selesai dalam 1-3 hari kerja setelah pembayaran terverifikasi.",
    icon: Zap,
  },
  {
    title: "Kualitas Terjamin",
    description: "Bahan dan mesin cetak berkualitas untuk hasil yang konsisten di setiap pesanan.",
    icon: ShieldCheck,
  },
  {
    title: "Layanan Lengkap",
    description: "Dari kartu nama hingga merchandise custom, semua kebutuhan cetak dalam satu tempat.",
    icon: Wrench,
  },
];

export default function AboutUsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
      <h1 className="mb-4 text-3xl font-bold">Tentang Zanzilindo</h1>

      <p className="mb-6 text-gray-600 dark:text-gray-300">
        Zanzilindo adalah penyedia layanan percetakan digital printing, offset, dan merchandise
        custom yang berfokus pada kemudahan pemesanan online. Kami percaya proses cetak tidak
        harus rumit — cukup pilih produk, atur variasi sesuai kebutuhan, lihat harga secara
        real-time, lalu pesan.
        {/* TODO: GANTI_DENGAN_CERITA_PERUSAHAAN_ASLI_ANDA (kapan berdiri, latar belakang, dll) */}
      </p>

      <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 p-5 dark:border-gray-800">
          <h2 className="mb-1 font-semibold">Visi</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Menjadi mitra percetakan online terpercaya bagi individu dan bisnis di seluruh
            Indonesia. {/* TODO: GANTI_DENGAN_VISI_ASLI */}
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 p-5 dark:border-gray-800">
          <h2 className="mb-1 font-semibold">Misi</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Memberikan layanan cetak yang cepat, transparan, dan berkualitas melalui teknologi
            digital. {/* TODO: GANTI_DENGAN_MISI_ASLI */}
          </p>
        </div>
      </div>

      <h2 className="mb-4 text-xl font-bold">Kenapa Memilih Kami?</h2>
      <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {KEUNGGULAN.map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-gray-200 p-5 dark:border-gray-800"
          >
            <item.icon size={24} className="text-brand" />
            <h3 className="mt-2 font-semibold">{item.title}</h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{item.description}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col items-start gap-4 rounded-2xl bg-gray-900 p-8 text-white sm:flex-row sm:items-center sm:justify-between dark:bg-gray-800">
        <div>
          <h2 className="text-lg font-bold">Siap memesan produk cetak Anda?</h2>
          <p className="mt-1 text-sm text-white/70">
            Jelajahi katalog produk kami atau hubungi tim untuk konsultasi.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/produk"
            className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark"
          >
            Lihat Produk
          </Link>
          <Link
            href="/kontak"
            className="rounded-full border border-white/30 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Kontak Kami
          </Link>
        </div>
      </div>
    </div>
  );
}
