// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import AuthProvider from "@/context/AuthProvider";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getOrganizationSchema } from "@/lib/seo/organizationSchema";

export const metadata: Metadata = {
  title: {
    default: "Zanzilindo — Solusi Percetakan Digital, Offset & Merchandise",
    template: "%s | Zanzilindo",
  },
  description:
    "Zanzilindo menyediakan layanan percetakan digital printing, offset, dan merchandise custom dengan kalkulator harga real-time dan proses pemesanan online.",
  metadataBase: new URL("https://zanzilindo.com"), // TODO: GANTI_DENGAN_DOMAIN_ASLI_ANDA
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "Zanzilindo",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        {/* Organization Schema (JSON-LD) — dibaca Google untuk Knowledge Panel & rich results */}
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(getOrganizationSchema()) }}
        />
      </head>
      <body className="bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100 antialiased">
        <AuthProvider>
          <ThemeProvider>
            <CartProvider>
              <Navbar />
              <main className="min-h-screen">{children}</main>
              <Footer />
            </CartProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
