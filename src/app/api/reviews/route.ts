// src/app/api/reviews/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";

interface CreateReviewBody {
  orderId: string;
  productId: string;
  rating: number;
  comment?: string;
}

/**
 * Aturan bisnis (WAJIB, sesuai spesifikasi): ulasan hanya boleh dibuat jika
 * - user login,
 * - order tsb benar milik user yang login (bukan order orang lain),
 * - order berisi productId yang mau diulas,
 * - status order sudah DITERIMA.
 * Semua validasi ini dilakukan DI SINI (server-side), bukan hanya di UI,
 * supaya tidak bisa dilewati lewat pemanggilan API langsung.
 */
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Silakan login terlebih dahulu" }, { status: 401 });
  }

  const { orderId, productId, rating, comment }: CreateReviewBody = await req.json();

  if (!orderId || !productId || !rating) {
    return NextResponse.json(
      { message: "orderId, productId, dan rating wajib diisi" },
      { status: 400 }
    );
  }

  if (rating < 1 || rating > 5) {
    return NextResponse.json({ message: "Rating harus antara 1-5" }, { status: 400 });
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });

  if (!order || order.userId !== session.user.id) {
    return NextResponse.json({ message: "Pesanan tidak ditemukan" }, { status: 404 });
  }

  if (order.status !== OrderStatus.DITERIMA) {
    return NextResponse.json(
      { message: "Ulasan hanya bisa diberikan setelah pesanan berstatus Diterima" },
      { status: 403 }
    );
  }

  const itemExists = order.items.some((item) => item.productId === productId);
  if (!itemExists) {
    return NextResponse.json(
      { message: "Produk ini tidak ada di dalam pesanan tersebut" },
      { status: 400 }
    );
  }

  const alreadyReviewed = await prisma.review.findUnique({
    where: {
      userId_orderId_productId: {
        userId: session.user.id,
        orderId,
        productId,
      },
    },
  });

  if (alreadyReviewed) {
    return NextResponse.json(
      { message: "Anda sudah mengulas produk ini untuk pesanan tersebut" },
      { status: 409 }
    );
  }

  const review = await prisma.review.create({
    data: {
      userId: session.user.id,
      orderId,
      productId,
      rating,
      comment,
    },
  });

  return NextResponse.json(review, { status: 201 });
}

/**
 * Daftar ulasan untuk satu produk — dipakai `ReviewList.tsx` yang sudah
 * disematkan di `app/produk/[slug]/page.tsx`.
 */
export async function GET(req: NextRequest) {
  const productId = req.nextUrl.searchParams.get("productId");

  if (!productId) {
    return NextResponse.json({ message: "productId wajib diisi" }, { status: 400 });
  }

  const reviews = await prisma.review.findMany({
    where: { productId },
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true, image: true } } },
  });

  return NextResponse.json(reviews);
}
