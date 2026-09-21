import type { Metadata } from "next";
import AdminProductManager from "./AdminProductManager";

export const metadata: Metadata = {
  title: "Kelola Produk",
  description: "Kelola katalog produk Zanzilindo.",
};

export default function AdminProductsPage() {
  return <AdminProductManager />;
}
