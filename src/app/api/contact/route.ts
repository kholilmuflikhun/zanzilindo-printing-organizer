// src/app/api/contact/route.ts
import { NextRequest, NextResponse } from "next/server";
import { sendWhatsAppMessage } from "@/lib/whatsapp";

interface ContactBody {
  name: string;
  contact: string; // email atau nomor telepon pengirim
  message: string;
}

export async function POST(req: NextRequest) {
  const { name, contact, message }: ContactBody = await req.json();

  if (!name || !contact || !message) {
    return NextResponse.json(
      { message: "Nama, kontak, dan pesan wajib diisi" },
      { status: 400 }
    );
  }

  // TODO: SIMPAN_KE_DATABASE jika Anda ingin riwayat pesan kontak tersimpan
  // (belum ada model Prisma untuk ini — tambahkan model `ContactMessage` di
  // `prisma/schema.prisma` jika diperlukan).

  await sendWhatsAppMessage(
    `📩 Pesan baru dari Halaman Kontak\nNama: ${name}\nKontak: ${contact}\nPesan: ${message}`
  );

  return NextResponse.json({ message: "Pesan berhasil dikirim" }, { status: 201 });
}
