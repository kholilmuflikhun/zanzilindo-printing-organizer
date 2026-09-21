// src/app/api/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const SALT_ROUNDS = 10; // TODO: SESUAIKAN jika kebutuhan keamanan/performa berbeda

export async function POST(req: NextRequest) {
  const { name, email, password } = await req.json();

  if (!name || !email || !password) {
    return NextResponse.json({ message: "Nama, email, dan password wajib diisi" }, { status: 400 });
  }

  if (password.length < 8) {
    return NextResponse.json({ message: "Password minimal 8 karakter" }, { status: 400 });
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return NextResponse.json({ message: "Email sudah terdaftar" }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: { name, email, passwordHash, role: "CUSTOMER" },
  });

  // Jangan pernah mengembalikan passwordHash ke client.
  return NextResponse.json({ id: user.id, name: user.name, email: user.email }, { status: 201 });
}
