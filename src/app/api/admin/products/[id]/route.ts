import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { ProductCategory } from "@prisma/client";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const categories = new Set(Object.values(ProductCategory));

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  return session?.user?.role === "ADMIN";
}

function parseUpdateInput(input: Record<string, unknown>) {
  const data: Record<string, unknown> = {};

  if (typeof input.slug === "string") {
    const slug = input.slug.trim().toLowerCase();
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      return { error: "Slug wajib berupa huruf kecil, angka, dan tanda hubung." };
    }
    data.slug = slug;
  }
  if (typeof input.name === "string") data.name = input.name.trim();
  if (typeof input.shortDescription === "string") data.shortDescription = input.shortDescription.trim();
  if (typeof input.imageUrl === "string") data.imageUrl = input.imageUrl.trim();
  if (typeof input.category === "string") {
    if (!categories.has(input.category as ProductCategory)) {
      return { error: "Kategori produk tidak valid." };
    }
    data.category = input.category as ProductCategory;
  }
  if (input.startingPrice !== undefined) {
    const startingPrice = Number(input.startingPrice);
    if (!Number.isInteger(startingPrice) || startingPrice < 0) {
      return { error: "Harga awal harus berupa angka bulat minimal 0." };
    }
    data.startingPrice = startingPrice;
  }
  if (typeof input.isActive === "boolean") data.isActive = input.isActive;

  if (Object.keys(data).length === 0) {
    return { error: "Tidak ada data yang diubah." };
  }
  if (typeof data.name === "string" && !data.name) {
    return { error: "Nama produk wajib diisi." };
  }
  if (typeof data.shortDescription === "string" && !data.shortDescription) {
    return { error: "Deskripsi singkat wajib diisi." };
  }
  if (typeof data.imageUrl === "string" && !data.imageUrl) {
    return { error: "URL gambar wajib diisi." };
  }

  return { data };
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ message: "Akses hanya untuk admin." }, { status: 403 });
  }

  const { id } = await params;
  const parsed = parseUpdateInput(await request.json());
  if ("error" in parsed) {
    return NextResponse.json({ message: parsed.error }, { status: 400 });
  }

  try {
    const product = await prisma.product.update({ where: { id }, data: parsed.data });
    return NextResponse.json(product);
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json({ message: "Slug produk sudah digunakan." }, { status: 409 });
    }
    return NextResponse.json({ message: "Produk gagal diperbarui." }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ message: "Akses hanya untuk admin." }, { status: 403 });
  }

  const { id } = await params;
  const product = await prisma.product.update({
    where: { id },
    data: { isActive: false },
  });
  return NextResponse.json(product);
}
