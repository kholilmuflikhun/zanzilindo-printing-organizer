// src/app/api/checkout/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createMidtransTransaction } from "@/lib/midtrans";
import { sendWhatsAppMessage } from "@/lib/whatsapp";
import { prisma } from "@/lib/prisma";

interface CheckoutItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Silakan login terlebih dahulu" }, { status: 401 });
  }

  const { items }: { items: CheckoutItem[] } = await req.json();

  if (!items?.length) {
    return NextResponse.json({ message: "Keranjang kosong" }, { status: 400 });
  }

  const grossAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const orderId = `ZNZ-${Date.now()}`; // TODO: GANTI_DENGAN_GENERATOR_ORDER_ID_SESUAI_KEBUTUHAN jika perlu format khusus
  const expiredAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // batas 1x24 jam

  // Simpan order + item ke database SEBELUM memanggil Midtrans, supaya
  // order_id yang dikirim ke Midtrans sudah pasti tercatat di sisi kita.
  await prisma.order.create({
    data: {
      id: orderId,
      userId: session.user.id,
      status: "MENUNGGU_PEMBAYARAN",
      grossAmount,
      expiredAt,
      items: {
        create: items.map((item) => ({
          productId: item.productId,
          productName: item.productName,
          price: item.price,
          quantity: item.quantity,
        })),
      },
    },
  });

  let snapTransaction;
  try {
    snapTransaction = await createMidtransTransaction({
      orderId,
      grossAmount,
      customerName: session.user.name ?? "Pelanggan",
      customerEmail: session.user.email ?? "",
      customerPhone: "-", // TODO: AMBIL_DARI_PROFIL_USER (User.phone) jika sudah diisi
      itemDetails: items.map((item) => ({
        id: item.productId,
        price: item.price,
        quantity: item.quantity,
        name: item.productName,
      })),
    });
  } catch (err) {
    // Jika Midtrans gagal, batalkan order yang baru dibuat agar tidak
    // menggantung di status MENUNGGU_PEMBAYARAN tanpa token pembayaran.
    await prisma.order.update({ where: { id: orderId }, data: { status: "DIBATALKAN" } });
    console.error("[Checkout] Gagal membuat transaksi Midtrans:", err);
    return NextResponse.json({ message: "Gagal memproses pembayaran, coba lagi." }, { status: 502 });
  }

  // Simpan redirect_url Snap supaya user bisa "Lanjutkan Pembayaran" dari
  // halaman Tracking Pesanan jika popup Snap saat checkout ditutup/gagal.
  await prisma.order.update({
    where: { id: orderId },
    data: { snapRedirectUrl: snapTransaction.redirect_url },
  });

  // Notifikasi WhatsApp real-time ke admin saat ada checkout baru.
  await sendWhatsAppMessage(
    `🛒 Checkout baru — Order #${orderId}\nPelanggan: ${session.user.name}\nTotal: Rp${grossAmount.toLocaleString(
      "id-ID"
    )}\nMenunggu pembayaran (batas 1x24 jam).`
  );

  return NextResponse.json({
    orderId,
    snapToken: snapTransaction.token,
    redirectUrl: snapTransaction.redirect_url,
  });
}
