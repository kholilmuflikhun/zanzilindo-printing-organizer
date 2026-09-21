// src/components/review/ReviewList.tsx
import { Star } from "lucide-react";
import { prisma } from "@/lib/prisma";

interface ReviewListProps {
  productId: string;
}

// Server component memanggil Prisma langsung (bukan fetch ke /api/reviews)
// untuk menghindari round-trip HTTP yang tidak perlu saat sudah di server.
// GET /api/reviews tetap dipertahankan untuk kebutuhan client-side (mis. jika
// nanti ada infinite scroll ulasan).
export default async function ReviewList({ productId }: ReviewListProps) {
  const reviews = await prisma.review.findMany({
    where: { productId },
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true } } },
  });

  if (reviews.length === 0) {
    return (
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Belum ada ulasan untuk produk ini.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="rounded-xl border border-gray-200 p-4 text-sm dark:border-gray-800"
        >
          <div className="mb-1 flex items-center justify-between">
            <span className="font-medium">{review.user.name ?? "Pengguna Zanzilindo"}</span>
            <span aria-label={`Rating ${review.rating} dari 5`} className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={14}
                  className={
                    star <= review.rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300 dark:text-gray-600"
                  }
                />
              ))}
            </span>
          </div>
          {review.comment && (
            <p className="text-gray-600 dark:text-gray-300">{review.comment}</p>
          )}
        </div>
      ))}
    </div>
  );
}
