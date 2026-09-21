// src/components/layout/Footer.tsx
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white py-10 dark:border-gray-800 dark:bg-gray-950">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 sm:grid-cols-3 lg:px-8">
        <div>
          <p className="text-lg font-bold text-brand">Zanzilindo</p>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Solusi percetakan digital, offset & merchandise custom.
          </p>
        </div>
        <div>
          <p className="mb-2 text-sm font-semibold">Perusahaan</p>
          <ul className="space-y-1 text-sm text-gray-500 dark:text-gray-400">
            <li>
              <Link href="/about-us">Tentang Kami</Link>
            </li>
            <li>
              <Link href="/kontak">Kontak</Link>
            </li>
            <li>
              <Link href="/faq">FAQ</Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="mb-2 text-sm font-semibold">Legal</p>
          <ul className="space-y-1 text-sm text-gray-500 dark:text-gray-400">
            <li>
              <Link href="/privacy-policy">Kebijakan Privasi</Link>
            </li>
          </ul>
        </div>
      </div>
      <p className="mt-8 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} Zanzilindo. Seluruh hak cipta dilindungi.
      </p>
    </footer>
  );
}
