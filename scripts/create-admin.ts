// scripts/create-admin.ts
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const SALT_ROUNDS = 10; // sama dengan api/register/route.ts

interface ParsedArgs {
  email?: string;
  username?: string;
  password?: string;
  name?: string;
}

function parseArgs(argv: string[]): ParsedArgs {
  const result: ParsedArgs = {};
  for (let i = 0; i < argv.length; i++) {
    const key = argv[i];
    if (key === "--email") result.email = argv[++i];
    else if (key === "--username") result.username = argv[++i];
    else if (key === "--password") result.password = argv[++i];
    else if (key === "--name") result.name = argv[++i];
  }
  return result;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (!args.email || !args.password) {
    console.error(
      'Penggunaan: npx tsx scripts/create-admin.ts --email <email> --password <password> [--username <username>] [--name "Nama Lengkap"]'
    );
    process.exit(1);
  }

  if (args.password.length < 8) {
    console.error("Password minimal 8 karakter.");
    process.exit(1);
  }

  const email = args.email.trim().toLowerCase();
  const username = args.username?.trim().toLowerCase();
  const name = args.name?.trim() || "Admin";

  const passwordHash = await bcrypt.hash(args.password, SALT_ROUNDS);

  const existing = await prisma.user.findFirst({
    where: { OR: [{ email }, ...(username ? [{ username }] : [])] },
  });

  if (existing) {
    const updated = await prisma.user.update({
      where: { id: existing.id },
      data: { passwordHash, role: "ADMIN", ...(username ? { username } : {}) },
    });
    console.log(`✓ User sudah ada — di-UPDATE jadi ADMIN: ${updated.email} (id: ${updated.id})`);
  } else {
    const created = await prisma.user.create({
      data: { email, username, name, passwordHash, role: "ADMIN" },
    });
    console.log(`✓ User ADMIN baru dibuat: ${created.email} (id: ${created.id})`);
  }

  console.log("Sekarang login lewat halaman /login pakai email/username + password yang baru saja diisi.");
}

main()
  .catch((err) => {
    console.error("Gagal membuat/update admin:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });