// src/app/privacy-policy/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kebijakan Privasi",
  description: "Kebijakan privasi Zanzilindo mengenai pengumpulan, penggunaan, dan perlindungan data pengguna.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 lg:px-8">
      <h1 className="mb-6 text-3xl font-bold">Kebijakan Privasi</h1>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Terakhir diperbarui: {/* TODO: GANTI_TANGGAL_TERBARU */}9 September 2026
      </p>

      <div className="space-y-6 text-gray-700 dark:text-gray-300">
        <section>
          <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
            1. Data yang Kami Kumpulkan
          </h2>
          {/* TODO: SESUAIKAN_ISI_DENGAN_KEBIJAKAN_BISNIS_ASLI_ANDA */}
          <p>
            Kami mengumpulkan data yang Anda berikan saat mendaftar akun, melakukan pemesanan, dan
            login menggunakan Google, meliputi nama, alamat email, nomor telepon, dan riwayat
            pesanan.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
            2. Penggunaan Data
          </h2>
          <p>
            Data digunakan untuk memproses pesanan, mengirim notifikasi status pesanan (termasuk
            melalui WhatsApp), dan meningkatkan kualitas layanan.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
            3. Pembayaran
          </h2>
          <p>
            Transaksi pembayaran diproses oleh pihak ketiga (Midtrans) yang memiliki kebijakan
            privasi dan standar keamanan tersendiri. Kami tidak menyimpan data kartu pembayaran
            Anda.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
            4. Hak Pengguna
          </h2>
          <p>
            Anda berhak mengakses, memperbarui, atau meminta penghapusan data pribadi Anda dengan
            menghubungi kami melalui halaman Kontak.
          </p>
        </section>
      </div>
    </div>
  );
}
