// src/app/api/midtrans/cancel-expired/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";

/**
 * Dipanggil oleh Vercel Cron (lihat `vercel.json` di root proyek) secara
 * berkala untuk membatalkan otomatis order yang statusnya masih
 * MENUNGGU_PEMBAYARAN tapi sudah melewati `expiredAt` (batas 1x24 jam).
 *
 * Dilindungi header Authorization berisi CRON_SECRET — Vercel Cron otomatis
 * mengirim header ini jika `CRON_SECRET` diset di Environment Variables;
 * TODO: PASTIKAN CRON_SECRET diisi di Vercel sebelum production, kalau tidak
 * endpoint ini bisa dipanggil siapa saja (meski dampaknya cuma membatalkan
 * order yang memang sudah expired, tetap sebaiknya dikunci).
 */
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const result = await prisma.order.updateMany({
    where: {
      status: OrderStatus.MENUNGGU_PEMBAYARAN,
      expiredAt: { lt: new Date() },
    },
    data: { status: OrderStatus.DIBATALKAN },
  });

  return NextResponse.json({ cancelledCount: result.count });
}
