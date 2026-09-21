#!/usr/bin/env bash
# generate-project.sh
# Menghasilkan struktur folder + file boilerplate untuk proyek Zanzilindo.
# Jalankan dari folder tempat kamu ingin membuat proyek:
#   bash generate-project.sh
set -e

ROOT="zanzilindo"

echo "==> Membuat struktur direktori di ./${ROOT} ..."

mkdir -p "$ROOT"/{prisma,public/images,scripts}
mkdir -p "$ROOT"/src/app/{produk,simulator,kontak,about-us,faq,privacy-policy}
mkdir -p "$ROOT"/src/app/produk/\[slug\]
mkdir -p "$ROOT"/src/app/\(auth\)/{login,register}
mkdir -p "$ROOT"/src/app/member/{cart,checkout,pesanan}
mkdir -p "$ROOT"/src/app/member/pesanan/\[orderId\]
mkdir -p "$ROOT"/src/app/api/auth/\[...nextauth\]
mkdir -p "$ROOT"/src/app/api/checkout
mkdir -p "$ROOT"/src/app/api/midtrans/{notification,cancel-expired}
mkdir -p "$ROOT"/src/app/api/whatsapp/notify
mkdir -p "$ROOT"/src/components/{layout,home,product/calculators,cart,order,review,ui}
mkdir -p "$ROOT"/src/lib/{pricing,seo}
mkdir -p "$ROOT"/src/hooks
mkdir -p "$ROOT"/src/context
mkdir -p "$ROOT"/src/types

echo "==> Membuat file boilerplate dasar ..."

cat > "$ROOT/.env.example" <<'EOF'
# ====== Salin file ini menjadi .env.local dan isi dengan nilai asli ======

# --- Database ---
DATABASE_URL="postgresql://user:password@host:5432/zanzilindo" # TODO: GANTI_DENGAN_DATABASE_URL_ANDA

# --- NextAuth ---
NEXTAUTH_SECRET="" # TODO: GANTI_DENGAN_RANDOM_STRING (openssl rand -base64 32)
NEXTAUTH_URL="http://localhost:3000" # TODO: GANTI ke domain Vercel saat production

# --- Google OAuth ---
GOOGLE_CLIENT_ID="" # TODO: GANTI_DENGAN_GOOGLE_CLIENT_ID_ANDA
GOOGLE_CLIENT_SECRET="" # TODO: GANTI_DENGAN_GOOGLE_CLIENT_SECRET_ANDA

# --- Midtrans ---
MIDTRANS_SERVER_KEY="" # TODO: GANTI_DENGAN_MIDTRANS_SERVER_KEY_ANDA
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY="" # TODO: GANTI_DENGAN_MIDTRANS_CLIENT_KEY_ANDA — WAJIB prefix NEXT_PUBLIC_ karena dipakai Snap.js di browser (client key memang didesain publik oleh Midtrans, beda dengan server key)
MIDTRANS_IS_PRODUCTION="false" # ganti "true" saat go-live (dipakai server: lib/midtrans.ts)
NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION="false" # WAJIB SAMA dengan MIDTRANS_IS_PRODUCTION di atas — dipakai client untuk pilih URL Snap.js sandbox vs production

# --- Cron (Vercel Cron Jobs) ---
CRON_SECRET="" # TODO: GANTI_DENGAN_RANDOM_STRING (openssl rand -base64 32) — melindungi /api/midtrans/cancel-expired dari diakses publik

# --- WhatsApp Notification (contoh: Fonnte / WA Business API) ---
WHATSAPP_API_URL="https://api.fonnte.com/send" # TODO: GANTI_JIKA_PAKAI_PROVIDER_LAIN
WHATSAPP_API_TOKEN="" # TODO: GANTI_DENGAN_TOKEN_WA_ANDA
ADMIN_WHATSAPP_NUMBER="6281234567890" # TODO: GANTI_DENGAN_NOMOR_WA_ADMIN
EOF

cat > "$ROOT/.gitignore" <<'EOF'
node_modules/
.next/
.env.local
.env
.vercel
*.log
EOF

cat > "$ROOT/package.json" <<'EOF'
{
  "name": "zanzilindo",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "postinstall": "prisma generate",
    "prisma:seed": "tsx prisma/seed.ts",
    "prisma:migrate": "prisma migrate dev"
  },
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  },
  "dependencies": {
    "next": "^14.2.5",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "next-auth": "^4.24.7",
    "@auth/prisma-adapter": "^2.4.2",
    "@prisma/client": "^5.17.0",
    "bcryptjs": "^2.4.3",
    "framer-motion": "^11.3.19",
    "midtrans-client": "^1.3.1",
    "lucide-react": "^0.454.0",
    "clsx": "^2.1.1"
  },
  "devDependencies": {
    "typescript": "^5.5.4",
    "@types/react": "^18.3.3",
    "@types/node": "^20.14.14",
    "@types/bcryptjs": "^2.4.6",
    "tailwindcss": "^3.4.7",
    "postcss": "^8.4.40",
    "autoprefixer": "^10.4.19",
    "prisma": "^5.17.0",
    "tsx": "^4.16.5"
  }
}
EOF

cat > "$ROOT/tsconfig.json" <<'EOF'
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
EOF

cat > "$ROOT/tailwind.config.ts" <<'EOF'
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#DC2626", // TODO: SESUAIKAN_MERAH_BRAND_ANDA jika ada hex resmi
          dark: "#991B1B",
          light: "#FEE2E2",
        },
      },
    },
  },
  plugins: [],
};
export default config;
EOF

cat > "$ROOT/next.config.mjs" <<'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" }, // TODO: PERSEMPIT_KE_DOMAIN_CDN_ANDA sebelum production
    ],
  },
};
export default nextConfig;
EOF

touch "$ROOT/src/app/globals.css"

echo "==> Selesai. Struktur proyek dibuat di ./${ROOT}"
echo "==> Langkah berikutnya:"
echo "    cd ${ROOT} && npm install"
echo "    Lalu salin source code krusial dari README/pesan chat ke path masing-masing."
