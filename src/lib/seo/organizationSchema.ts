// src/lib/seo/organizationSchema.ts

const SITE_URL = "https://zanzilindo.com"; // TODO: GANTI_DENGAN_DOMAIN_ASLI_ANDA

/**
 * Mengembalikan objek JSON-LD schema.org/Organization.
 * Dipasang di root layout (lihat instruksi di bawah) agar terbaca di semua
 * halaman, atau bisa juga hanya dipasang di halaman Home/About Us saja.
 */
export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Zanzilindo",
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo.png`, // TODO: GANTI_DENGAN_PATH_LOGO_ASLI_ANDA
    description:
      "Zanzilindo menyediakan layanan percetakan digital printing, offset, dan merchandise custom dengan kalkulator harga real-time dan proses pemesanan online.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "TODO: GANTI_DENGAN_ALAMAT_LENGKAP",
      addressLocality: "TODO: GANTI_KOTA",
      addressRegion: "TODO: GANTI_PROVINSI",
      postalCode: "TODO: GANTI_KODE_POS",
      addressCountry: "ID",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "TODO: GANTI_NOMOR_TELEPON_BISNIS", // format: +62...
      contactType: "customer service",
      areaServed: "ID",
      availableLanguage: ["Indonesian"],
    },
    sameAs: [
      // TODO: TAMBAHKAN_LINK_SOSMED_ASLI_ANDA (Instagram, Facebook, TikTok, dll)
      "https://instagram.com/zanzilindo",
      "https://facebook.com/zanzilindo",
    ],
  };
}
