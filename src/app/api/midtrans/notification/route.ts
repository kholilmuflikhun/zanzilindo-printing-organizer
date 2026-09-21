// src/app/api/midtrans/notification/route.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyMidtransSignature } from "@/lib/midtrans";
import { sendWhatsAppMessage } from "@/lib/whatsapp";
import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";

/**
 * Endpoint ini didaftarkan sebagai "Payment Notification URL" di Dashboard
 * Midtrans. Midtrans akan mengirim POST ke sini setiap status transaksi
 * berubah (pending, settlement, expire, cancel, deny).
 */

// Memetakan transaction_status dari Midtrans ke OrderStatus internal kita.
// Mengembalikan null untuk status yang tidak perlu mengubah data (mis. "pending").
function mapMidtransStatusToOrderStatus(transactionStatus: string): OrderStatus | null {
  switch (transactionStatus) {
    case "settlement":
    case "capture":
      return OrderStatus.TERVERIFIKASI;
    case "expire":
    case "cancel":
    case "deny":
      return OrderStatus.DIBATALKAN;
    default:
      return null; // "pending" dll — belum ada perubahan status yang perlu disimpan
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { order_id, status_code, gross_amount, transaction_status, signature_key } = body;

  const isValid = verifyMidtransSignature({
    order_id,
    status_code,
    gross_amount,
    signature_key,
  });

  if (!isValid) {
    return NextResponse.json({ message: "Invalid signature" }, { status: 403 });
  }

  const order = await prisma.order.findUnique({ where: { id: order_id } });
  if (!order) {
    // Selalu balas 200 ke Midtrans meski order_id tidak ditemukan di sisi kita,
    // supaya Midtrans tidak retry notifikasi ini tanpa henti.
    console.warn(`[Midtrans Webhook] Order tidak ditemukan: ${order_id}`);
    return NextResponse.json({ message: "Order not found, acknowledged" }, { status: 200 });
  }

  const newStatus = mapMidtransStatusToOrderStatus(transaction_status);

  if (newStatus && newStatus !== order.status) {
    await prisma.order.update({ where: { id: order_id }, data: { status: newStatus } });

    if (newStatus === OrderStatus.TERVERIFIKASI) {
      // Notifikasi WhatsApp real-time ke admin saat pembayaran sukses.
      await sendWhatsAppMessage(
        `✅ Pembayaran DITERIMA untuk Order #${order_id}\nTotal: Rp${Number(
          gross_amount
        ).toLocaleString("id-ID")}\nStatus: Lanjut ke proses Pengemasan.`
      );
    }
  }

  return NextResponse.json({ message: "OK" }, { status: 200 });
}
