// src/app/member/cart/page.tsx
import type { Metadata } from "next";
import CartTable from "@/components/cart/CartTable";

export const metadata: Metadata = {
  title: "Keranjang Saya",
};

export default function CartPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Keranjang Saya</h1>
      <CartTable />
    </div>
  );
}
