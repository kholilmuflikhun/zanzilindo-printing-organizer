// src/app/kontak/page.tsx
import type { Metadata } from "next";
import { MapPin, MessageCircle, Mail, Clock } from "lucide-react";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Kontak",
  description:
    "Hubungi Zanzilindo untuk konsultasi pesanan percetakan, penawaran khusus, atau pertanyaan lainnya.",
};

// TODO: GANTI_SEMUA_DATA_KONTAK_DI_BAWAH_DENGAN_DATA_ASLI_BISNIS_ANDA
const CONTACT_INFO = {
  address: "Jl. Contoh Alamat No. 123, Bobotsari, Purbalingga, Jawa Tengah",
  whatsapp: "+62 812-3456-7890",
  email: "halo@zanzilindo.com",
  operationalHours: "Senin - Sabtu, 08.00 - 17.00 WIB",
  mapsEmbedUrl: "https://www.google.com/maps?q=Bobotsari,+Purbalingga&output=embed", // TODO: GANTI_DENGAN_LOKASI_ASLI
};

export default function KontakPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 lg:px-8">
      <h1 className="mb-2 text-3xl font-bold">Hubungi Kami</h1>
      <p className="mb-8 text-gray-600 dark:text-gray-300">
        Ada pertanyaan seputar produk atau ingin konsultasi pesanan custom? Kirim pesan lewat
        form di bawah, atau hubungi kami langsung.
      </p>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div>
          <h2 className="mb-4 text-lg font-semibold">Informasi Kontak</h2>
          <ul className="space-y-4 text-sm">
            <li className="flex gap-3">
              <MapPin size={18} className="shrink-0 text-brand" />
              <span className="text-gray-700 dark:text-gray-300">{CONTACT_INFO.address}</span>
            </li>
            <li className="flex gap-3">
              <MessageCircle size={18} className="shrink-0 text-brand" />
              <a
                href={`https://wa.me/${CONTACT_INFO.whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-brand dark:text-gray-300"
              >
                {CONTACT_INFO.whatsapp} (WhatsApp)
              </a>
            </li>
            <li className="flex gap-3">
              <Mail size={18} className="shrink-0 text-brand" />
              <a
                href={`mailto:${CONTACT_INFO.email}`}
                className="text-gray-700 hover:text-brand dark:text-gray-300"
              >
                {CONTACT_INFO.email}
              </a>
            </li>
            <li className="flex gap-3">
              <Clock size={18} className="shrink-0 text-brand" />
              <span className="text-gray-700 dark:text-gray-300">
                {CONTACT_INFO.operationalHours}
              </span>
            </li>
          </ul>

          <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800">
            <iframe
              src={CONTACT_INFO.mapsEmbedUrl}
              className="h-64 w-full"
              loading="lazy"
              title="Lokasi Zanzilindo"
            />
          </div>
        </div>

        <div>
          <h2 className="mb-4 text-lg font-semibold">Kirim Pesan</h2>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
