// src/app/member/pesanan/[orderId]/CountdownSection.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Countdown from "@/components/ui/Countdown";

interface CountdownSectionProps {
  expiredAt: Date;
  snapRedirectUrl: string | null;
}

export default function CountdownSection({ expiredAt, snapRedirectUrl }: CountdownSectionProps) {
  const router = useRouter();
  const [isExpired, setIsExpired] = useState(false);

  return (
    <div className="mb-8 flex flex-col items-start justify-between gap-4 rounded-2xl border border-yellow-200 bg-yellow-50 p-5 sm:flex-row sm:items-center dark:border-yellow-900 dark:bg-yellow-950/40">
      <div>
        <p className="mb-1 text-sm font-medium text-yellow-800 dark:text-yellow-400">
          Selesaikan pembayaran sebelum:
        </p>
        <Countdown
          targetDate={expiredAt}
          onExpire={() => {
            setIsExpired(true);
            // Sinkronkan tampilan dengan status DIBATALKAN dari server
            // (cron `cancel-expired` yang benar-benar mengubah status di DB —
            // ini hanya me-refresh UI supaya pengguna langsung lihat perubahan
            // begitu cron berikutnya jalan, tanpa perlu reload manual).
            router.refresh();
          }}
        />
      </div>

      {!isExpired && snapRedirectUrl && (
        <a
          href={snapRedirectUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark"
        >
          Lanjutkan Pembayaran
        </a>
      )}
    </div>
  );
}
