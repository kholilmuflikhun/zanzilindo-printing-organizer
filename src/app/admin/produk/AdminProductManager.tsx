"use client";

import { FormEvent, useEffect, useState } from "react";
import { Pencil, Plus, Power, RefreshCw, Trash2, X } from "lucide-react";

const CATEGORY_OPTIONS = [
  ["BANNER", "Banner"],
  ["BROSUR", "Brosur"],
  ["BUKU_NOTA", "Buku Nota"],
  ["BUKU_CUSTOM", "Buku Custom"],
  ["CETAK_A3_PLUS", 'Cetak "A3+"'],
  ["KARTU_NAMA", "Kartu Nama"],
  ["DOKUMEN", "Dokumen"],
  ["STIKER", "Stiker"],
  ["KALENDER", "Kalender"],
  ["MERCHANDISE", "Merchandise"],
] as const;

type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  shortDescription: string;
  imageUrl: string;
  startingPrice: number;
  isActive: boolean;
};

type FormState = Omit<Product, "id" | "isActive"> & { isActive: boolean };

const emptyForm: FormState = {
  slug: "",
  name: "",
  category: "BANNER",
  shortDescription: "",
  imageUrl: "",
  startingPrice: 0,
  isActive: true,
};

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function AdminProductManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showInactive, setShowInactive] = useState(false);

  async function loadProducts() {
    setIsLoading(true);
    const response = await fetch("/api/admin/products", { cache: "no-store" });
    const data = await response.json();
    if (!response.ok) {
      setError(data.message ?? "Produk gagal dimuat.");
    } else {
      setProducts(data);
      setError(null);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    void loadProducts();
  }, []);

  function startCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setError(null);
  }

  function startEdit(product: Product) {
    setEditingId(product.id);
    setForm({
      slug: product.slug,
      name: product.name,
      category: product.category,
      shortDescription: product.shortDescription,
      imageUrl: product.imageUrl,
      startingPrice: product.startingPrice,
      isActive: product.isActive,
    });
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setError(null);

    const response = await fetch(
      editingId ? `/api/admin/products/${editingId}` : "/api/admin/products",
      {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      }
    );
    const data = await response.json();

    if (!response.ok) {
      setError(data.message ?? "Produk gagal disimpan.");
    } else {
      await loadProducts();
      startCreate();
    }
    setIsSaving(false);
  }

  async function setProductActive(product: Product, isActive: boolean) {
    const response = await fetch(`/api/admin/products/${product.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive }),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.message ?? "Status produk gagal diubah.");
      return;
    }
    setProducts((current) => current.map((item) => (item.id === product.id ? data : item)));
  }

  async function handleDelete(product: Product) {
    if (!window.confirm(`Nonaktifkan produk “${product.name}”?`)) return;
    await setProductActive(product, false);
  }

  const visibleProducts = products.filter((product) => showInactive || product.isActive);

  return (
    <div>
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">Admin</p>
          <h1 className="mt-1 text-3xl font-bold">Kelola Produk</h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Tambahkan dan perbarui katalog yang tampil di halaman produk.
          </p>
        </div>
        <button
          type="button"
          onClick={startCreate}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark"
        >
          <Plus size={17} /> Produk Baru
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,360px)_1fr]">
        <form
          onSubmit={handleSubmit}
          className="h-fit space-y-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">{editingId ? "Edit Produk" : "Produk Baru"}</h2>
            {editingId && (
              <button type="button" onClick={startCreate} aria-label="Batal edit" className="text-gray-500 hover:text-brand">
                <X size={18} />
              </button>
            )}
          </div>

          <label className="block text-sm font-medium">
            Nama Produk
            <input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 font-normal dark:border-gray-700 dark:bg-gray-800" />
          </label>
          <label className="block text-sm font-medium">
            Slug URL
            <input required value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} placeholder="contoh-produk" className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 font-normal dark:border-gray-700 dark:bg-gray-800" />
          </label>
          <label className="block text-sm font-medium">
            Kategori
            <select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 font-normal dark:border-gray-700 dark:bg-gray-800">
              {CATEGORY_OPTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </label>
          <label className="block text-sm font-medium">
            Harga Mulai
            <input required min={0} type="number" value={form.startingPrice} onChange={(event) => setForm({ ...form, startingPrice: Number(event.target.value) })} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 font-normal dark:border-gray-700 dark:bg-gray-800" />
          </label>
          <label className="block text-sm font-medium">
            URL Gambar
            <input required type="url" value={form.imageUrl} onChange={(event) => setForm({ ...form, imageUrl: event.target.value })} placeholder="/images/produk.jpg" className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 font-normal dark:border-gray-700 dark:bg-gray-800" />
          </label>
          <label className="block text-sm font-medium">
            Deskripsi Singkat
            <textarea required rows={3} value={form.shortDescription} onChange={(event) => setForm({ ...form, shortDescription: event.target.value })} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 font-normal dark:border-gray-700 dark:bg-gray-800" />
          </label>
          <label className="flex items-center gap-2 text-sm font-medium">
            <input type="checkbox" checked={form.isActive} onChange={(event) => setForm({ ...form, isActive: event.target.checked })} /> Produk aktif
          </label>
          {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-300">{error}</p>}
          <button disabled={isSaving} className="w-full rounded-full bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60">
            {isSaving ? "Menyimpan..." : editingId ? "Simpan Perubahan" : "Tambah Produk"}
          </button>
        </form>

        <section>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Daftar Produk ({visibleProducts.length})</h2>
            <div className="flex items-center gap-3 text-sm">
              <label className="flex items-center gap-2 text-gray-600 dark:text-gray-300"><input type="checkbox" checked={showInactive} onChange={(event) => setShowInactive(event.target.checked)} /> Tampilkan nonaktif</label>
              <button type="button" onClick={() => void loadProducts()} aria-label="Muat ulang produk" className="rounded-lg border border-gray-200 p-2 hover:text-brand dark:border-gray-700"><RefreshCw size={16} /></button>
            </div>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
            {isLoading ? <p className="p-6 text-sm text-gray-500">Memuat produk...</p> : visibleProducts.length === 0 ? <p className="p-6 text-sm text-gray-500">Belum ada produk.</p> : (
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase text-gray-500 dark:border-gray-800 dark:bg-gray-950"><tr><th className="px-4 py-3">Produk</th><th className="px-4 py-3">Kategori</th><th className="px-4 py-3">Harga Mulai</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Aksi</th></tr></thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {visibleProducts.map((product) => <tr key={product.id} className="align-middle"><td className="px-4 py-4"><p className="font-semibold">{product.name}</p><p className="text-xs text-gray-500">/{product.slug}</p></td><td className="px-4 py-4">{CATEGORY_OPTIONS.find(([value]) => value === product.category)?.[1] ?? product.category}</td><td className="px-4 py-4">{formatRupiah(product.startingPrice)}</td><td className="px-4 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-medium ${product.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>{product.isActive ? "Aktif" : "Nonaktif"}</span></td><td className="px-4 py-4"><div className="flex justify-end gap-2"><button type="button" onClick={() => startEdit(product)} aria-label={`Edit ${product.name}`} className="rounded-lg border border-gray-200 p-2 hover:text-brand dark:border-gray-700"><Pencil size={16} /></button>{product.isActive ? <button type="button" onClick={() => void handleDelete(product)} aria-label={`Nonaktifkan ${product.name}`} className="rounded-lg border border-gray-200 p-2 text-red-600 hover:bg-red-50 dark:border-gray-700"><Trash2 size={16} /></button> : <button type="button" onClick={() => void setProductActive(product, true)} aria-label={`Aktifkan ${product.name}`} className="rounded-lg border border-gray-200 p-2 text-green-600 hover:bg-green-50 dark:border-gray-700"><Power size={16} /></button>}</div></td></tr>)}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
