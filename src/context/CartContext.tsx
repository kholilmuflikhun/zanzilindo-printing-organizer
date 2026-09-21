// src/context/CartContext.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";

export interface CartItem {
  id: string; // id unik baris cart (bukan productId — 1 produk bisa ada 2x dengan variasi beda)
  productId: string;
  productSlug: string;
  productName: string;
  category: string;
  unitPrice: number; // hasil kalkulator saat "Tambah ke Keranjang" ditekan
  quantity: number;
  variableSummary: string; // ringkasan variasi yang dipilih, contoh: "Indoor, Polos, 2x1m"
  checked: boolean; // checklist — hanya item checked yang ikut checkout
}

interface CartContextValue {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "id" | "checked">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  toggleChecked: (id: string) => void;
  toggleAllChecked: (checked: boolean) => void;
  removeCheckedItems: () => void;
  checkedItems: CartItem[];
  checkedSubtotal: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);
const STORAGE_KEY = "zanzilindo-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Muat cart dari localStorage sekali saat mount (client-only — hindari mismatch SSR).
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) setItems(JSON.parse(saved));
    } catch {
      // localStorage rusak/tidak valid — mulai dari cart kosong, jangan crash app.
    }
    setIsHydrated(true);
  }, []);

  // Simpan setiap kali items berubah, tapi jangan menimpa storage dengan
  // array kosong sebelum load awal selesai (isHydrated).
  useEffect(() => {
    if (!isHydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, isHydrated]);

  function addItem(item: Omit<CartItem, "id" | "checked">) {
    const newItem: CartItem = {
      ...item,
      id: `${item.productId}-${Date.now()}`,
      checked: true, // item baru langsung tercentang, sesuai ekspektasi umum e-commerce
    };
    setItems((prev) => [...prev, newItem]);
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function updateQuantity(id: string, quantity: number) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity: Math.max(1, quantity) } : i)));
  }

  function toggleChecked(id: string) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, checked: !i.checked } : i)));
  }

  function toggleAllChecked(checked: boolean) {
    setItems((prev) => prev.map((i) => ({ ...i, checked })));
  }

  function removeCheckedItems() {
    setItems((prev) => prev.filter((i) => !i.checked));
  }

  const checkedItems = items.filter((i) => i.checked);
  const checkedSubtotal = checkedItems.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        toggleChecked,
        toggleAllChecked,
        removeCheckedItems,
        checkedItems,
        checkedSubtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart harus dipakai di dalam <CartProvider>");
  return ctx;
}
