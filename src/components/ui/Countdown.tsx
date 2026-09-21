// src/components/ui/Countdown.tsx
"use client";

import { useCountdown } from "@/hooks/useCountdown";

interface CountdownProps {
  targetDate: Date | string;
  onExpire?: () => void;
  label?: string;
}

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

export default function Countdown({ targetDate, onExpire, label }: CountdownProps) {
  const { hours, minutes, seconds, isExpired } = useCountdown(targetDate, onExpire);

  if (isExpired) {
    return <p className="text-sm font-semibold text-red-600">Waktu pembayaran telah habis.</p>;
  }

  const isUrgent = hours === 0 && minutes < 30; // TODO: SESUAIKAN_AMBANG_URGENT jika perlu

  return (
    <div>
      {label && <p className="mb-1 text-xs text-gray-500 dark:text-gray-400">{label}</p>}
      <p
        className={`font-mono text-2xl font-bold tabular-nums ${
          isUrgent ? "text-red-600" : "text-brand"
        }`}
      >
        {pad(hours)}:{pad(minutes)}:{pad(seconds)}
      </p>
    </div>
  );
}
