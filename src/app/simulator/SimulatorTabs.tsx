// src/app/simulator/SimulatorTabs.tsx
"use client";

import { useState } from "react";
import clsx from "clsx";
import SpinBukuSimulator from "./SpinBukuSimulator";
import KalkulatorHargaGlobal from "./KalkulatorHargaGlobal";

type TabKey = "spin-buku" | "kalkulator-harga";

const TABS: { key: TabKey; label: string }[] = [
  { key: "spin-buku", label: "Simulator Spin Buku" },
  { key: "kalkulator-harga", label: "Kalkulator Harga" },
];

export default function SimulatorTabs() {
  const [activeTab, setActiveTab] = useState<TabKey>("spin-buku");

  return (
    <div>
      {/* Tab switch */}
      <div className="mb-6 flex gap-2 rounded-full border border-gray-200 bg-gray-50 p-1 dark:border-gray-800 dark:bg-gray-900">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={clsx(
              "flex-1 rounded-full px-4 py-2 text-sm font-medium transition",
              activeTab === tab.key
                ? "bg-brand text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Konten tab — hanya satu yang dirender, state kalkulator lain di-reset saat pindah tab */}
      {activeTab === "spin-buku" ? <SpinBukuSimulator /> : <KalkulatorHargaGlobal />}
    </div>
  );
}
