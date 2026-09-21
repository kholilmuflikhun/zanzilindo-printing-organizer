// src/hooks/useCountdown.ts
"use client";

import { useEffect, useState } from "react";

export interface CountdownValue {
  totalMs: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

function computeCountdown(targetTime: number): CountdownValue {
  const totalMs = Math.max(targetTime - Date.now(), 0);
  const hours = Math.floor(totalMs / (1000 * 60 * 60));
  const minutes = Math.floor((totalMs / (1000 * 60)) % 60);
  const seconds = Math.floor((totalMs / 1000) % 60);
  return { totalMs, hours, minutes, seconds, isExpired: totalMs <= 0 };
}

/**
 * Hitung mundur real-time ke `targetDate`. Dipakai untuk countdown 1x24 jam
 * batas pembayaran Midtrans (Checkout & Tracking Pesanan).
 * `onExpire` dipanggil TEPAT SEKALI saat totalMs mencapai 0.
 */
export function useCountdown(targetDate: Date | string, onExpire?: () => void): CountdownValue {
  const targetTime = new Date(targetDate).getTime();
  const [value, setValue] = useState<CountdownValue>(() => computeCountdown(targetTime));

  useEffect(() => {
    if (computeCountdown(targetTime).isExpired) return;

    const interval = setInterval(() => {
      const next = computeCountdown(targetTime);
      setValue(next);
      if (next.isExpired) {
        clearInterval(interval);
        onExpire?.();
      }
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetTime]);

  return value;
}
