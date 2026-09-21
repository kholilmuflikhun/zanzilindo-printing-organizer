"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ExternalLink, Package, Pencil, RefreshCw, ShieldCheck, Star, Trash2, Users } from "lucide-react";

const ORDER_STATUSES = [
  ["MENUNGGU_PEMBAYARAN", "Menunggu Pembayaran"],
  ["TERVERIFIKASI", "Terverifikasi"],
  ["DIKEMAS", "Dikemas"],
  ["PICKUP", "Pickup"],
  ["DALAM_PENGIRIMAN", "Dalam Pengiriman"],
  ["DITERIMA", "Diterima"],
  ["DIBATALKAN", "Dibatalkan"],
] as const;

type DashboardData = {
  stats: { userCount: number; productCount: number; activeProductCount: number; orderCount: number; reviewCount: number };
  recentUsers: { id: string; name: string | null; email: string | null; role: "CUSTOMER" | "ADMIN"; createdAt: string }[];
  recentOrders: { id: string; status: string; grossAmount: number; createdAt: string; user: { name: string | null; email: string | null } }[];
  recentReviews: { id: string; rating: number; comment: string | null; createdAt: string; user: { name: string | null }; product: { name: string } }[];
};

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("id-ID", { dateStyle: "medium" });
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function loadDashboard() {
    setIsLoading(true);
    const response = await fetch("/api/admin/dashboard", { cache: "no-store" });
    const payload = await response.json();
    if (!response.ok) setError(payload.message ?? "Dashboard gagal dimuat.");
    else { setData(payload); setError(null); }
    setIsLoading(false);
  }

  useEffect(() => { void loadDashboard(); }, []);

  async function updateUserRole(id: string, role: "CUSTOMER" | "ADMIN") {
    const response = await fetch("/api/admin/dashboard", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entity: "user", id, role }),
    });
    const payload = await response.json();
    if (!response.ok) { setError(payload.message ?? "Role gagal diubah."); return; }
    setData((current) => current ? { ...current, recentUsers: current.recentUsers.map((user) => user.id === id ? { ...user, role: payload.role } : user) } : current);
  }

  async function updateOrderStatus(id: string, status: string) {
    const response = await fetch("/api/admin/dashboard", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entity: "order", id, status }),
    });
    const payload = await response.json();
    if (!response.ok) { setError(payload.message ?? "Status pesanan gagal diubah."); return; }
    setData((current) => current ? { ...current, recentOrders: current.recentOrders.map((order) => order.id === id ? { ...order, status: payload.status } : order) } : current);
  }

  async function deleteReview(id: string) {
    if (!window.confirm("Hapus ulasan ini dari katalog?")) return;
    const response = await fetch("/api/admin/dashboard", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entity: "review", id }),
    });
    const payload = await response.json();
    if (!response.ok) { setError(payload.message ?? "Ulasan gagal dihapus."); return; }
    setData((current) => current ? { ...current, recentReviews: current.recentReviews.filter((review) => review.id !== id), stats: { ...current.stats, reviewCount: current.stats.reviewCount - 1 } } : current);
  }

  const statCards = data ? [
    { label: "Pengguna", value: data.stats.userCount, Icon: Users },
    { label: "Produk Aktif", value: data.stats.activeProductCount, Icon: Package },
    { label: "Total Produk", value: data.stats.productCount, Icon: Package },
    { label: "Pesanan", value: data.stats.orderCount, Icon: ExternalLink },
    { label: "Ulasan", value: data.stats.reviewCount, Icon: Star },
  ] : [];

  return (
    <div>
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">Admin Global</p><h1 className="mt-1 text-3xl font-bold">Dashboard Zanzilindo</h1><p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Kelola katalog, pelanggan, pesanan, dan ulasan dari satu tempat.</p></div>
        <div className="flex gap-2"><button type="button" onClick={() => void loadDashboard()} aria-label="Muat ulang dashboard" className="rounded-lg border border-gray-200 p-2 hover:text-brand dark:border-gray-700"><RefreshCw size={17} /></button><Link href="/admin/produk" className="inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"><Package size={16} /> Kelola Produk</Link></div>
      </div>

      {error && <p className="mb-5 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-300">{error}</p>}
      {isLoading || !data ? <p className="text-sm text-gray-500">Memuat dashboard...</p> : <>
        <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {statCards.map(({ label, value, Icon }) => <div key={label} className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"><Icon size={20} className="text-brand" /><p className="mt-3 text-2xl font-bold">{value}</p><p className="text-sm text-gray-500">{label}</p></div>)}
        </div>

        <div className="grid gap-8 xl:grid-cols-2">
          <section className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"><div className="flex items-center gap-2 border-b border-gray-200 p-5 dark:border-gray-800"><Users size={18} className="text-brand" /><h2 className="font-semibold">Pengguna Terbaru</h2></div><div className="divide-y divide-gray-100 dark:divide-gray-800">{data.recentUsers.map((user) => <div key={user.id} className="flex items-center justify-between gap-3 p-4"><div className="min-w-0"><p className="truncate text-sm font-semibold">{user.name ?? "Tanpa nama"}</p><p className="truncate text-xs text-gray-500">{user.email ?? "Tanpa email"} · {formatDate(user.createdAt)}</p></div><select value={user.role} onChange={(event) => void updateUserRole(user.id, event.target.value as "CUSTOMER" | "ADMIN")} aria-label={`Role ${user.email ?? user.id}`} className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs dark:border-gray-700 dark:bg-gray-800"><option value="CUSTOMER">Customer</option><option value="ADMIN">Admin</option></select></div>)}{data.recentUsers.length === 0 && <p className="p-5 text-sm text-gray-500">Belum ada pengguna.</p>}</div></section>

          <section className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"><div className="flex items-center gap-2 border-b border-gray-200 p-5 dark:border-gray-800"><ExternalLink size={18} className="text-brand" /><h2 className="font-semibold">Pesanan Terbaru</h2></div><div className="divide-y divide-gray-100 dark:divide-gray-800">{data.recentOrders.map((order) => <div key={order.id} className="flex items-center justify-between gap-3 p-4"><div className="min-w-0"><p className="font-mono text-xs font-semibold">{order.id}</p><p className="truncate text-xs text-gray-500">{order.user.name ?? order.user.email ?? "Pengguna"} · {formatRupiah(order.grossAmount)}</p></div><select value={order.status} onChange={(event) => void updateOrderStatus(order.id, event.target.value)} aria-label={`Status ${order.id}`} className="max-w-[170px] rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs dark:border-gray-700 dark:bg-gray-800">{ORDER_STATUSES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div>)}{data.recentOrders.length === 0 && <p className="p-5 text-sm text-gray-500">Belum ada pesanan.</p>}</div></section>

          <section className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:xl:col-span-2"><div className="flex items-center gap-2 border-b border-gray-200 p-5 dark:border-gray-800"><Star size={18} className="text-brand" /><h2 className="font-semibold">Moderasi Ulasan</h2></div><div className="grid divide-y divide-gray-100 dark:divide-gray-800 xl:grid-cols-2 xl:divide-x xl:divide-y-0">{data.recentReviews.map((review) => <div key={review.id} className="flex items-start justify-between gap-4 p-4"><div><p className="text-sm font-semibold">{review.product.name} · {review.rating}/5</p><p className="text-xs text-gray-500">{review.user.name ?? "Pengguna"} · {formatDate(review.createdAt)}</p>{review.comment && <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{review.comment}</p>}</div><button type="button" onClick={() => void deleteReview(review.id)} aria-label="Hapus ulasan" className="rounded-lg border border-gray-200 p-2 text-red-600 hover:bg-red-50 dark:border-gray-700"><Trash2 size={16} /></button></div>)}{data.recentReviews.length === 0 && <p className="p-5 text-sm text-gray-500">Belum ada ulasan.</p>}</div></section>
        </div>
      </>}
    </div>
  );
}
