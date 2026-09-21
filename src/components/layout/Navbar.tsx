// src/components/layout/Navbar.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { ShoppingCart, X, Menu } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { useCart } from "@/context/CartContext";

const NAV_LINKS = [
  { href: "/", label: "Beranda" },
  { href: "/produk", label: "Produk" },
  { href: "/simulator", label: "Simulator" },
  { href: "/kontak", label: "Kontak" },
  { href: "/about-us", label: "About Us" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session, status } = useSession();
  const { items } = useCart();
  const cartCount = items.length;

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur dark:border-gray-800 dark:bg-gray-950/90">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
        <Link href="/" className="text-xl font-bold text-brand">
          Zanzilindo
        </Link>

        {/* Menu desktop */}
        <ul className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm font-medium text-gray-700 transition hover:text-brand dark:text-gray-200"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          <Link href="/member/cart" aria-label="Keranjang" className="relative">
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 dark:border-gray-700">
              <ShoppingCart size={18} />
            </span>
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-brand px-1 text-[10px] font-semibold text-white">
                {cartCount}
              </span>
            )}
          </Link>
          <ThemeToggle />
          {status === "authenticated" ? (
            <>
              <Link
                href="/member"
                className="text-sm font-medium text-gray-700 hover:text-brand dark:text-gray-200"
              >
                {session.user?.name ?? "Member"}
              </Link>
              {session.user?.role === "ADMIN" && (
                <Link
                  href="/admin/produk"
                  className="text-sm font-medium text-gray-700 hover:text-brand dark:text-gray-200"
                >
                  Admin
                </Link>
              )}
              <button
                onClick={() => signOut()}
                className="rounded-full border border-brand px-4 py-1.5 text-sm font-medium text-brand transition hover:bg-brand hover:text-white"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-gray-700 hover:text-brand dark:text-gray-200"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-brand px-4 py-1.5 text-sm font-medium text-white transition hover:bg-brand-dark"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Tombol hamburger mobile */}
        <button
          className="flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 md:hidden dark:border-gray-700"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="Buka menu"
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      {/* Menu mobile */}
      {mobileOpen && (
        <div className="border-t border-gray-100 px-4 pb-4 md:hidden dark:border-gray-800">
          <ul className="flex flex-col gap-3 pt-3">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-3">
                <ThemeToggle />
                <Link href="/member/cart" onClick={() => setMobileOpen(false)} className="relative">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 dark:border-gray-700">
                    <ShoppingCart size={18} />
                  </span>
                  {cartCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-brand px-1 text-[10px] font-semibold text-white">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </div>
              {status === "authenticated" ? (
                <div className="flex items-center gap-3">
                  {session.user?.role === "ADMIN" && (
                    <Link href="/admin/produk" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-brand">
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={() => signOut()}
                    className="rounded-full border border-brand px-4 py-1.5 text-sm font-medium text-brand"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Link href="/login" className="text-sm font-medium">
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="rounded-full bg-brand px-4 py-1.5 text-sm font-medium text-white"
                  >
                    Register
                  </Link>
                </div>
              )}
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
