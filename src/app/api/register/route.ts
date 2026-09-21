// src/app/api/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const SALT_ROUNDS = 10; // TODO: SESUAIKAN jika kebutuhan keamanan/performa berbeda

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const normalizedUsername = typeof body.username === "string" ? body.username.trim().toLowerCase() : "";
  const normalizedEmail = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!name || !normalizedUsername || !normalizedEmail || !password) {
    return NextResponse.json({ message: "Nama, username, email, dan password wajib diisi" }, { status: 400 });
  }

  if (!/^[a-z0-9_]{3,30}$/.test(normalizedUsername)) {
    return NextResponse.json({ message: "Username harus 3-30 karakter dan hanya berisi huruf, angka, atau garis bawah" }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    return NextResponse.json({ message: "Format email tidak valid" }, { status: 400 });
  }

  if (password.length < 8) {
    return NextResponse.json({ message: "Password minimal 8 karakter" }, { status: 400 });
  }

  const existingUser = await prisma.user.findFirst({
    where: { OR: [{ email: normalizedEmail }, { username: normalizedUsername }] },
  });

  if (existingUser) {
    return NextResponse.json({ message: "Email atau username sudah terdaftar" }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  try {
    const user = await prisma.user.create({
      data: {
        name,
        username: normalizedUsername,
        email: normalizedEmail,
        passwordHash,
        role: "CUSTOMER",
      },
    });

    return NextResponse.json(
      { id: user.id, name: user.name, username: user.username, email: user.email },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ message: "Email atau username sudah terdaftar" }, { status: 409 });
    }

    console.error("Register failed:", error);
    return NextResponse.json({ message: "Registrasi gagal, coba lagi nanti." }, { status: 500 });
  }
}
