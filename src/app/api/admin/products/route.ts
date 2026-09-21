import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { ProductCategory } from "@prisma/client";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const categories = new Set(Object.values(ProductCategory));

type ProductInput = {
  slug?: unknown;
  name?: unknown;
  category?: unknown;
  shortDescription?: unknown;
  imageUrl?: unknown;
  startingPrice?: unknown;
  isActive?: unknown;
};

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  return session?.user?.role === "ADMIN";
}

function parseProductInput(input: ProductInput) {
  const slug = typeof input.slug === "string" ? input.slug.trim().toLowerCase() : "";
  const name = typeof input.name === "string" ? input.name.trim() : "";
  const category = typeof input.category === "string" ? input.category : "";
  const shortDescription =
    typeof input.shortDescription === "string" ? input.shortDescription.trim() : "";
  const imageUrl = typeof input.imageUrl === "string" ? input.imageUrl.trim() : "";
  const startingPrice =
    typeof input.startingPrice === "number" && Number.isInteger(input.startingPrice)
      ? input.startingPrice
      : Number(input.startingPrice);

  if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return { error: "Slug wajib berupa huruf kecil, angka, dan tanda hubung." };
  }
  if (!name || !shortDescription || !imageUrl) {
    return { error: "Nama, deskripsi singkat, dan URL gambar wajib diisi." };
  }
  if (!categories.has(category as ProductCategory)) {
    return { error: "Kategori produk tidak valid." };
  }
  if (!Number.isInteger(startingPrice) || startingPrice < 0) {
    return { error: "Harga awal harus berupa angka bulat minimal 0." };
  }

  return {
    data: {
      slug,
      name,
      category: category as ProductCategory,
      shortDescription,
      imageUrl,
      startingPrice,
      ...(typeof input.isActive === "boolean" ? { isActive: input.isActive } : {}),
    },
  };
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ message: "Akses hanya untuk admin." }, { status: 403 });
  }

  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(products);
}

export async function POST(request: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ message: "Akses hanya untuk admin." }, { status: 403 });
  }

  const parsed = parseProductInput(await request.json());
  if ("error" in parsed) {
    return NextResponse.json({ message: parsed.error }, { status: 400 });
  }

  try {
    const product = await prisma.product.create({ data: parsed.data });
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json({ message: "Slug produk sudah digunakan." }, { status: 409 });
    }
    return NextResponse.json({ message: "Produk gagal dibuat." }, { status: 500 });
  }
}
