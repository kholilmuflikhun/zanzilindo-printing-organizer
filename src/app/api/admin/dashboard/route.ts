import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { OrderStatus, Role } from "@prisma/client";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  return session?.user?.role === "ADMIN";
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ message: "Akses hanya untuk admin." }, { status: 403 });
  }

  const [userCount, productCount, orderCount, reviewCount, activeProductCount, recentUsers, recentOrders, recentReviews] =
    await prisma.$transaction([
      prisma.user.count(),
      prisma.product.count(),
      prisma.order.count(),
      prisma.review.count(),
      prisma.product.count({ where: { isActive: true } }),
      prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        take: 8,
        select: { id: true, name: true, email: true, role: true, createdAt: true },
      }),
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        select: {
          id: true,
          status: true,
          grossAmount: true,
          createdAt: true,
          user: { select: { name: true, email: true } },
        },
      }),
      prisma.review.findMany({
        orderBy: { createdAt: "desc" },
        take: 8,
        select: {
          id: true,
          rating: true,
          comment: true,
          createdAt: true,
          user: { select: { name: true } },
          product: { select: { name: true } },
        },
      }),
    ]);

  return NextResponse.json({
    stats: { userCount, productCount, activeProductCount, orderCount, reviewCount },
    recentUsers,
    recentOrders,
    recentReviews,
  });
}

export async function PATCH(request: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ message: "Akses hanya untuk admin." }, { status: 403 });
  }

  const body = await request.json();
  if (body.entity === "user" && typeof body.id === "string" && Object.values(Role).includes(body.role)) {
    const currentUser = await getServerSession(authOptions);
    if (currentUser?.user?.id === body.id && body.role !== "ADMIN") {
      return NextResponse.json({ message: "Admin tidak dapat menurunkan role akunnya sendiri." }, { status: 400 });
    }
    const user = await prisma.user.update({ where: { id: body.id }, data: { role: body.role } });
    return NextResponse.json({ id: user.id, role: user.role });
  }

  if (body.entity === "order" && typeof body.id === "string" && Object.values(OrderStatus).includes(body.status)) {
    const order = await prisma.order.update({ where: { id: body.id }, data: { status: body.status } });
    return NextResponse.json({ id: order.id, status: order.status });
  }

  return NextResponse.json({ message: "Perubahan admin tidak valid." }, { status: 400 });
}

export async function DELETE(request: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ message: "Akses hanya untuk admin." }, { status: 403 });
  }

  const body = await request.json();
  if (body.entity !== "review" || typeof body.id !== "string") {
    return NextResponse.json({ message: "Data ulasan tidak valid." }, { status: 400 });
  }

  await prisma.review.delete({ where: { id: body.id } });
  return NextResponse.json({ success: true });
}
