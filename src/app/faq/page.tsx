// src/app/faq/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ — Pertanyaan yang Sering Diajukan",
  description:
    "Jawaban atas pertanyaan umum seputar layanan percetakan Zanzilindo: pemesanan, pembayaran, pengiriman, dan garansi produk.",
};

// TODO: TAMBAH/GANTI_PERTANYAAN_SESUAI_KEBUTUHAN_BISNIS_ANDA
const FAQ_ITEMS = [
  {
    question: "Berapa lama waktu pengerjaan pesanan?",
    answer:
      "Waktu pengerjaan bervariasi tergantung kategori produk dan jumlah cetak, umumnya 1-3 hari kerja setelah pembayaran terverifikasi.",
  },
  {
    question: "Metode pembayaran apa saja yang didukung?",
    answer:
      "Pembayaran diproses melalui Midtrans, mendukung transfer bank, e-wallet, kartu kredit/debit, dan QRIS.",
  },
  {
    question: "Apa yang terjadi jika saya tidak membayar dalam 1x24 jam?",
    answer:
      "Pesanan akan otomatis dibatalkan oleh sistem jika pembayaran tidak diselesaikan dalam batas waktu 1x24 jam sejak checkout.",
  },
  {
    question: "Kapan saya bisa memberikan ulasan produk?",
    answer:
      "Ulasan produk hanya dapat diberikan setelah status pesanan berubah menjadi 'Diterima' pada halaman Tracking Pesanan.",
  },
];

export default function FaqPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 lg:px-8">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <h1 className="mb-8 text-3xl font-bold">Pertanyaan yang Sering Diajukan</h1>

      <div className="space-y-6">
        {FAQ_ITEMS.map((item) => (
          <div
            key={item.question}
            className="rounded-2xl border border-gray-200 p-5 dark:border-gray-800"
          >
            <h2 className="mb-2 text-lg font-semibold">{item.question}</h2>
            <p className="text-gray-600 dark:text-gray-300">{item.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
