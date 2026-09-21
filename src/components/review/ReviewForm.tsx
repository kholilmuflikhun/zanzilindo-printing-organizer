// src/components/review/ReviewForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star, CheckCircle2 } from "lucide-react";

interface ReviewFormProps {
  orderId: string;
  productId: string;
  productName: string;
}

export default function ReviewForm({ orderId, productId, productName }: ReviewFormProps) {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (rating === 0) {
      setError("Pilih rating bintang terlebih dahulu.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, productId, rating, comment }),
    });

    setIsSubmitting(false);

    if (!res.ok) {
      const body = await res.json().catch(() => ({ message: "Gagal mengirim ulasan." }));
      setError(body.message ?? "Gagal mengirim ulasan.");
      return;
    }

    setSubmitted(true);
    router.refresh(); // sinkronkan ulang server component parent (status "sudah diulas")
  }

  if (submitted) {
    return (
      <p className="flex items-center gap-2 rounded-xl bg-green-50 p-3 text-sm text-green-700 dark:bg-green-950 dark:text-green-400">
        <CheckCircle2 size={16} className="shrink-0" />
        Terima kasih! Ulasan Anda untuk {productName} sudah tersimpan.
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-gray-200 p-4 dark:border-gray-800"
    >
      <p className="mb-2 text-sm font-medium">Beri ulasan untuk {productName}</p>

      <div className="mb-3 flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            aria-label={`${star} bintang`}
          >
            <Star
              size={22}
              className={
                (hoverRating || rating) >= star
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300 dark:text-gray-600"
              }
            />
          </button>
        ))}
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Bagaimana kualitas produknya? (opsional)"
        rows={3}
        className="mb-3 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
      />

      {error && <p className="mb-2 text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:opacity-60"
      >
        {isSubmitting ? "Mengirim..." : "Kirim Ulasan"}
      </button>
    </form>
  );
}
