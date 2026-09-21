# Zanzilindo — E-Commerce Percetakan (Next.js + TypeScript + Tailwind)

Website e-commerce percetakan (digital printing, offset, merchandise) dengan
kalkulator harga real-time, pembayaran Midtrans, notifikasi WhatsApp, dan
Auth Google. Dibangun dengan Next.js App Router agar SEO & performa maksimal.

> Dokumen ini adalah bagian 1 dari paket deliverable. Source code krusial
> (Navbar, Kalkulator Harga, Integrasi Midtrans, Integrasi WhatsApp, Auth
> Google) ada di pesan-pesan berikutnya dalam percakapan ini — salin setiap
> file ke path yang tertulis di judul code block-nya.

---

## 1. Tech Stack

| Layer          | Pilihan                                             |
|----------------|------------------------------------------------------|
| Framework      | Next.js 14 (App Router, Server Components)           |
| Bahasa         | TypeScript                                            |
| Styling        | Tailwind CSS (+ dark mode `class` strategy)          |
| Auth           | NextAuth.js (Credentials + Google OAuth) + @auth/prisma-adapter |
| Payment        | Midtrans Snap (Sandbox → Production)                  |
| Notifikasi     | WhatsApp Business API / Fonnte (HTTP webhook)         |
| Database       | Prisma ORM + PostgreSQL (rekomendasi: Supabase/Neon)  |
| Deployment     | Vercel                                                |
| Animasi        | Framer Motion                                          |

---

## 2. Struktur Direktori (Directory Structure)

```
zanzilindo/
├── README.md
├── package.json
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── vercel.json                       # selesai (batch 9) — jadwal Vercel Cron untuk cancel-expired
├── .env.example                      # TODO: isi semua API key di sini
├── .env.local                        # (gitignored) salinan .env.example berisi key asli
│
├── prisma/
│   ├── schema.prisma                 # model User, Product, Order, OrderItem, Review, dll
│   └── seed.ts                       # data awal (3 produk contoh) — `npm run prisma:seed`
│
├── public/
│   ├── robots.txt
│   ├── llms.txt
│   ├── sitemap.xml                   # fallback statis (dinamis via app/sitemap.ts)
│   └── images/
│
├── src/
│   ├── app/
│   │   ├── layout.tsx                # root layout + metadata dasar + AuthProvider + ThemeProvider
│   │   ├── page.tsx                  # selesai (batch 6) — Home: BannerSlider + shortcut kategori + ProductCarousel
│   │   ├── globals.css
│   │   ├── sitemap.ts                # sitemap.xml dinamis (Next.js metadata route)
│   │   ├── robots.ts                 # robots.txt dinamis
│   │   │
│   │   ├── produk/                   # selesai (batch 8)
│   │   │   ├── page.tsx              # listing produk (grid/list, filter Relevan/Populer/Baru/Terlaris, sorting harga)
│   │   │   └── [slug]/
│   │   │       └── page.tsx          # detail produk + meta tags dinamis (generateMetadata)
│   │   │                             # (kalkulator dirender via components/product/CategoryCalculator.tsx)
│   │   │
│   │   ├── simulator/                # selesai (batch 5)
│   │   │   ├── page.tsx              # server component, export metadata, render <SimulatorTabs/>
│   │   │   ├── SimulatorTabs.tsx     # client — tab switch: Spin Buku <-> Kalkulator Harga
│   │   │   ├── SpinBukuSimulator.tsx
│   │   │   └── KalkulatorHargaGlobal.tsx
│   │   │
│   │   ├── kontak/                   # selesai (batch 7)
│   │   │   ├── page.tsx              # info kontak bisnis + Maps embed + form pesan
│   │   │   └── ContactForm.tsx       # client — kirim pesan via POST /api/contact
│   │   ├── about-us/page.tsx         # selesai (batch 7) — profil, visi/misi, keunggulan
│   │   ├── faq/page.tsx
│   │   ├── privacy-policy/page.tsx
│   │   │
│   │   ├── (auth)/                   # selesai (batch 6) — route group, tidak memengaruhi URL (/login, /register)
│   │   │   ├── login/
│   │   │   │   ├── page.tsx                  # server component + metadata, bungkus <Suspense><LoginForm/></Suspense>
│   │   │   │   └── LoginForm.tsx             # client — Credentials login + tombol "Login with Google"
│   │   │   └── register/
│   │   │       ├── page.tsx
│   │   │       └── RegisterForm.tsx          # client — daftar via /api/register, lalu auto-login
│   │   │
│   │   ├── member/                           # selesai (batch 9)
│   │   │   ├── layout.tsx                    # guard SERVER-SIDE: getServerSession + redirect jika belum login
│   │   │   ├── page.tsx                      # dashboard member
│   │   │   ├── cart/page.tsx
│   │   │   ├── checkout/
│   │   │   │   ├── page.tsx
│   │   │   │   └── CheckoutClient.tsx        # client — panggil /api/checkout, buka Midtrans Snap popup
│   │   │   └── pesanan/
│   │   │       ├── page.tsx                  # daftar pesanan
│   │   │       └── [orderId]/
│   │   │           ├── page.tsx              # tracking pesanan (server) + form ulasan (jika status diterima)
│   │   │           └── CountdownSection.tsx  # client — Countdown + tombol "Lanjutkan Pembayaran"
│   │   │
│   │   └── api/
│   │       ├── auth/[...nextauth]/route.ts
│   │       ├── register/route.ts             # buat user baru, hash password bcrypt
│   │       ├── contact/route.ts              # selesai (batch 7) — kirim notifikasi WA saat ada pesan Kontak
│   │       ├── reviews/route.ts              # selesai (batch 7) — POST (validasi status DITERIMA) + GET per produk
│   │       ├── checkout/route.ts             # buat order + trigger Midtrans Snap token + simpan snapRedirectUrl
│   │       ├── midtrans/
│   │       │   ├── notification/route.ts     # webhook Midtrans (server-to-server)
│   │       │   └── cancel-expired/route.ts   # selesai (batch 9) — cron: batalkan order lewat 1x24 jam
│   │       └── whatsapp/notify/route.ts      # kirim notifikasi WA ke admin
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx                    # selesai (batch 9) — + badge jumlah item cart
│   │   │   ├── Footer.tsx
│   │   │   └── ThemeToggle.tsx
│   │   ├── home/                             # selesai (batch 6)
│   │   │   ├── BannerSlider.tsx              # swipe mode (touch), autoplay, panah + dot navigation
│   │   │   └── ProductCarousel.tsx           # scroll horizontal + tombol navigasi
│   │   ├── product/
│   │   │   ├── ProductGridList.tsx           # selesai (batch 8) — presentasi murni, mode grid/list
│   │   │   ├── ProductFilterSort.tsx         # selesai (batch 8) — kontrol via query string (bookmark-able)
│   │   │   ├── CategoryCalculator.tsx        # resolver: pilih kalkulator sesuai product.category
│   │   │   ├── AddToCartPanel.tsx            # selesai (batch 9) — bungkus CategoryCalculator + tombol Tambah ke Keranjang
│   │   │   └── calculators/
│   │   │       ├── BannerCalculator.tsx       # selesai (batch 1)
│   │   │       ├── BrosurCalculator.tsx       # selesai (batch 4)
│   │   │       ├── BukuNotaCalculator.tsx     # selesai (batch 4)
│   │   │       ├── BukuCustomCalculator.tsx   # selesai (batch 4) — tebalSpin masih input manual
│   │   │       ├── CetakA3PlusCalculator.tsx  # selesai (batch 4)
│   │   │       ├── KartuNamaCalculator.tsx    # selesai (batch 4)
│   │   │       ├── DokumenCalculator.tsx      # selesai (batch 4)
│   │   │       ├── StikerCalculator.tsx       # selesai (batch 4)
│   │   │       ├── KalenderCalculator.tsx     # selesai (batch 4)
│   │   │       └── MerchandiseCalculator.tsx  # selesai (batch 4) — harga estimasi awal
│   │   ├── cart/
│   │   │   └── CartTable.tsx                  # selesai (batch 9) — checklist, ubah qty, hapus, subtotal
│   │   ├── order/                             # selesai (batch 9)
│   │   │   ├── OrderTrackingStepper.tsx
│   │   │   └── OrderStatusBadge.tsx
│   │   ├── review/
│   │   │   ├── ReviewList.tsx                 # selesai (batch 7) — server component, tampilkan ulasan di halaman produk
│   │   │   └── ReviewForm.tsx                 # selesai (batch 9) — bintang + komentar, POST /api/reviews
│   │   └── ui/
│   │       └── Countdown.tsx                  # selesai (batch 9) — dipakai Checkout & Tracking
│   │                                          # (Button, Card, Tabs, Modal, dll — primitives lain menyusul sesuai kebutuhan)
│   │
│   ├── lib/
│   │   ├── auth.ts                            # konfigurasi NextAuth (Google + Credentials + PrismaAdapter)
│   │   ├── prisma.ts                          # instance PrismaClient singleton
│   │   ├── products.ts                        # query Prisma katalog produk + CATEGORY_OPTIONS (satu sumber) + getProducts (filter/sort)
│   │   ├── orders.ts                          # selesai (batch 9) — query pesanan dengan cek kepemilikan, label & urutan status
│   │   ├── midtrans.ts                        # helper Snap API (createTransaction, verifySignature)
│   │   ├── whatsapp.ts                        # helper kirim pesan WA
│   │   ├── pricing/
│   │   │   ├── types.ts                       # tipe & interface variabel harga tiap kategori
│   │   │   ├── bannerPricing.ts               # rumus hitung Banner (Panjang x Lebar x Harga Pokok/meter)
│   │   │   ├── brosurPricing.ts
│   │   │   ├── bukuNotaPricing.ts
│   │   │   ├── bukuCustomPricing.ts
│   │   │   ├── cetakA3PlusPricing.ts
│   │   │   ├── kartuNamaPricing.ts
│   │   │   ├── dokumenPricing.ts
│   │   │   ├── stikerPricing.ts
│   │   │   ├── kalenderPricing.ts
│   │   │   ├── merchandisePricing.ts
│   │   │   └── spinBuku.ts                    # rumus tebal spin — dipakai Simulator & BukuCustomCalculator
│   │   ├── utils/
│   │   │   └── format.ts                      # formatRupiah — dipakai semua kalkulator & halaman produk
│   │   └── seo/
│   │       └── organizationSchema.ts          # JSON-LD Organization Schema
│   │
│   ├── hooks/
│   │   └── useCountdown.ts                    # selesai (batch 9) — hitung mundur generik + onExpire
│   │
│   ├── context/
│   │   ├── ThemeContext.tsx
│   │   ├── AuthProvider.tsx                   # selesai (batch 6) — wrapper SessionProvider NextAuth (WAJIB di root layout)
│   │   └── CartContext.tsx                    # selesai (batch 9) — cart localStorage + checklist (useCart di file yang sama)
│   │
│   └── types/
│       ├── index.ts
│       └── next-auth.d.ts                     # selesai (batch 9) — augmentation Session.user.id (WAJIB, tanpa ini build gagal)
│
└── scripts/
    └── generate-project.sh                    # script Node/Bash generator struktur folder
```

**Kenapa struktur ini?**
- `app/api/midtrans/notification` terpisah dari `app/api/checkout` supaya webhook
  (dipanggil server Midtrans) dan endpoint checkout (dipanggil dari browser)
  punya siklus hidup dan validasi keamanan yang berbeda (signature key vs session user).
- Semua rumus harga diisolasi di `lib/pricing/*` (bukan di dalam komponen React)
  agar bisa di-unit-test terpisah dan tidak circular-import dengan komponen UI.
- Tiap kalkulator kategori (`components/product/calculators/*`) adalah komponen
  client (`"use client"`) kecil yang HANYA mengurus state form + memanggil fungsi
  pricing — logic hitung tidak pernah ditulis ulang di dalam komponen.

---

## 3. Cara Menjalankan di Localhost

```bash
# 1. Generate struktur folder dari script (kalau belum pernah)
bash scripts/generate-project.sh
cd zanzilindo

# 2. Salin seluruh source code (src/, prisma/, public/, vercel.json) dari
#    hasil chat/zip ke folder ini, lalu install dependency
npm install

# 3. Siapkan environment variables
cp .env.example .env.local
# → buka .env.local, isi minimal: DATABASE_URL, NEXTAUTH_SECRET
#   (boleh kosongkan dulu MIDTRANS_*/GOOGLE_*/WHATSAPP_* saat awal development —
#   fitur terkait akan error kalau dipakai, tapi sisanya tetap jalan)

# 4. Siapkan database (WAJIB Postgres — lihat lib/prisma.ts & schema.prisma)
#    Paling cepat untuk lokal: bikin database gratis di neon.tech / Supabase,
#    lalu tempel connection string-nya ke DATABASE_URL di .env.local.
npx prisma migrate dev --name init   # bikin semua tabel dari schema.prisma
npm run prisma:seed                  # isi 10 produk contoh (1 per kategori)

# 5. Jalankan development server
npm run dev
```

Buka **http://localhost:3000** — Home, Produk, Simulator, FAQ, Privacy Policy
sudah bisa langsung dipakai tanpa API key apa pun. Yang butuh env var:
- **Login Google** → butuh `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET` (Google Cloud Console → OAuth Consent Screen + Credentials, redirect URI: `http://localhost:3000/api/auth/callback/google`)
- **Checkout/Bayar Sekarang** → butuh `MIDTRANS_SERVER_KEY` + `NEXT_PUBLIC_MIDTRANS_CLIENT_KEY` (daftar [Midtrans Sandbox](https://dashboard.sandbox.midtrans.com), gratis)
- **Notifikasi WA** → butuh `WHATSAPP_API_URL`/`WHATSAPP_API_TOKEN` (mis. akun [Fonnte](https://fonnte.com))

> Register + Login pakai email/password TIDAK butuh env var tambahan apa pun
> selain `DATABASE_URL` — cara tercepat untuk mulai coba-coba fitur Member Area.

---

## 4. Panduan Upload ke GitHub

```bash
# Dari dalam folder zanzilindo/ (setelah langkah localhost di atas selesai)
git init
git add .
git commit -m "chore: initial scaffold Zanzilindo e-commerce"

# Buat repo baru di github.com (JANGAN centang "Initialize with README")
git branch -M main
git remote add origin https://github.com/USERNAME/zanzilindo.git
git push -u origin main
```

> **PENTING:** pastikan `.env.local` ada di `.gitignore` (sudah disiapkan
> di boilerplate) — JANGAN pernah commit API key Midtrans/Google/WhatsApp/
> `DATABASE_URL`/`CRON_SECRET`.

---

## 5. Panduan Deploy ke Vercel

1. Login ke [vercel.com](https://vercel.com) → **Add New Project**.
2. Import repo GitHub `zanzilindo` yang baru dipush.
3. Framework Preset: Vercel akan otomatis mendeteksi **Next.js** — biarkan default.
4. Pada bagian **Environment Variables**, tambahkan SEMUA variabel dari
   `.env.example`:
   - `DATABASE_URL` — pakai Postgres production (Neon/Supabase/Vercel Postgres)
   - `NEXTAUTH_SECRET`, `NEXTAUTH_URL` (isi `https://domainkamu.vercel.app`)
   - `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
   - `MIDTRANS_SERVER_KEY`, `NEXT_PUBLIC_MIDTRANS_CLIENT_KEY`,
     `MIDTRANS_IS_PRODUCTION`, `NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION`
     (dua variabel `IS_PRODUCTION` ini **WAJIB diisi nilai yang sama**)
   - `WHATSAPP_API_URL`, `WHATSAPP_API_TOKEN`, `ADMIN_WHATSAPP_NUMBER`
   - `CRON_SECRET` (random string — lindungi endpoint `cancel-expired`, lihat poin 8)
5. Klik **Deploy**.
6. Setelah live, jalankan migrasi database ke Postgres production (dari
   komputer lokal, dengan `DATABASE_URL` di `.env.local` diarahkan sementara
   ke database production):
   ```bash
   npx prisma migrate deploy
   npm run prisma:seed   # opsional, kalau ingin data awal yang sama
   ```
7. Daftarkan URL webhook Midtrans di Dashboard Midtrans (Settings →
   Configuration → Payment Notification URL):
   `https://domainkamu.vercel.app/api/midtrans/notification`
8. Cron pembatalan order (`vercel.json`, jadwal sekali sehari pada 00:00 UTC) aktif otomatis
   begitu deploy — Vercel akan mengirim header `Authorization: Bearer
   <CRON_SECRET>` ke `/api/midtrans/cancel-expired`. Pastikan `CRON_SECRET`
   di poin 4 sudah diisi. (Vercel Cron tersedia di plan Hobby dengan batas
   jumlah eksekusi/hari — cek kuota di dashboard Vercel kamu.)
9. Setiap `git push` ke branch `main` otomatis trigger redeploy (CI/CD bawaan Vercel).

---

## 6. Format Change Log

> Aturan: setiap ada perubahan/penambahan fitur, tambahkan entri BARU di
> **paling atas** daftar di bawah. **Jangan pernah menghapus log lama.**

```
## [Unreleased]
- (kosongkan, isi saat ada perubahan berikutnya)

## [0.9.2] - 2026-09-19
### Changed
- **Seluruh ikon UI emoji diganti ikon modern** (`lucide-react`, SVG outline)
  di 15 file: `Navbar.tsx` (cart, menu hamburger), `ThemeToggle.tsx` (sun/moon),
  `ProductFilterSort.tsx` (grid/list), `BannerSlider.tsx` & `ProductCarousel.tsx`
  (chevron navigasi), Home `page.tsx` (10 ikon kategori — lihat `lib/categoryIcons.tsx`
  di bawah), `member/page.tsx` (cart/package), `OrderTrackingStepper.tsx`
  (check/x-circle), `AddToCartPanel.tsx` (check/cart), `ReviewForm.tsx` +
  `ReviewList.tsx` (star rating, filled kuning untuk yang aktif),
  `member/pesanan/[orderId]/page.tsx` (check + star kecil di status "sudah
  diulas"), `kontak/page.tsx` (map-pin/message-circle/mail/clock),
  `about-us/page.tsx` (wallet/zap/shield-check/wrench).
- Tombol "Login/Daftar dengan Google" (`LoginForm.tsx`, `RegisterForm.tsx`):
  emoji placeholder diganti **logo Google asli 4 warna** (`GoogleIcon.tsx`,
  SVG resmi) — bukan ikon Lucide, karena ini brand mark, bukan ikon generik.
  Ini menutup TODO `GANTI_DENGAN_ICON_GOOGLE_ASLI` yang tercatat sejak batch 6.
### Added
- `lib/categoryIcons.tsx`: satu sumber pemetaan slug kategori → komponen
  ikon Lucide (`CATEGORY_ICON`), menggantikan `CATEGORY_EMOJI` yang
  sebelumnya hanya didefinisikan lokal di `app/page.tsx`. WAJIB disinkronkan
  manual dengan `CATEGORY_OPTIONS` (`lib/products.ts`) kalau ada kategori baru.
- `components/ui/GoogleIcon.tsx`: logo Google SVG resmi, dipakai bersama oleh
  Login & Register.
- `lucide-react` ditambahkan ke `package.json` boilerplate (`scripts/generate-project.sh`).
### Notes
- Emoji yang SENGAJA dipertahankan (bukan ikon UI, jadi tidak diganti):
  sapaan "👋" di teks salam `member/page.tsx`, dan emoji di dalam ISI PESAN
  WhatsApp yang dikirim ke HP admin (`api/checkout/route.ts`,
  `api/midtrans/notification/route.ts`, `api/contact/route.ts`) — itu teks
  polos yang dibaca manusia di WhatsApp, bukan elemen ikon yang dirender di web.
- Audit: seluruh 32 nama ikon Lucide yang dipakai (`Sun`, `ShoppingCart`,
  `LayoutGrid`, dst) diverifikasi PROGRAMATIK benar-benar ada di
  `lucide-react@0.454.0` (bukan cuma asumsi nama) sebelum dikemas.

## [0.9.1] - 2026-09-15
### Added
- **README**: section baru "Cara Menjalankan di Localhost" (sebelumnya tidak
  ada sama sekali — langsung loncat dari generate script ke git init tanpa
  langkah `npm install` → `.env.local` → `prisma migrate dev` → `prisma:seed`
  → `npm run dev` yang jelas).
### Changed
- **README panduan Vercel**: env var diperbarui mengikuti rename batch 9
  (`MIDTRANS_CLIENT_KEY` → `NEXT_PUBLIC_MIDTRANS_CLIENT_KEY`), ditambah
  `NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION` dan `CRON_SECRET` yang sebelumnya
  tidak disebut sama sekali di panduan deploy (padahal WAJIB untuk cron
  `cancel-expired` berfungsi). Ditambah langkah `prisma migrate deploy` ke
  database production dan catatan soal kuota Vercel Cron di plan Hobby.
### Audit
- **Audit dijalankan SUNGGUHAN, bukan cuma baca kode**: `bash
  scripts/generate-project.sh` dieksekusi, source code digabung, `npm install`
  benar-benar dijalankan (142 package, 0 konflik dependency), lalu `npx tsc
  --noEmit` dijalankan untuk cek tipe.
- Hasil: 16 error TypeScript muncul, SEMUA sudah ditelusuri satu per satu ke
  akar penyebabnya: `prisma generate` gagal di sandbox audit ini karena
  domain `binaries.prisma.sh` diblokir jaringan (403 Forbidden) — bukan bug
  di kode. Tanpa Prisma client ter-generate, semua tipe yang bergantung
  padanya (`OrderStatus`, `ProductCategory`, `Order`, dst) otomatis hilang,
  termasuk 3 error "implicit any" yang cuma efek berantai dari itu (bukan
  masalah independen). **0 bug independen ditemukan.**
- Sudah dicoba paksa pakai WASM engine (`PRISMA_CLIENT_ENGINE_TYPE=wasm`)
  untuk hindari fetch binary — tetap gagal karena `schema-engine` juga perlu
  di-fetch dari domain yang sama. Ini murni keterbatasan jaringan sandbox
  audit, akan otomatis beres begitu `npm install`/`npx prisma generate`
  dijalankan di komputer kamu sendiri atau di Vercel (keduanya akses internet
  penuh, tidak ada domain yang diblokir).

## [0.9.0] - 2026-09-09
### Fixed
- **Bug tipe TypeScript** — `session.user.id` dipakai di banyak tempat
  (`checkout/route.ts`, `reviews/route.ts`, halaman member baru) tapi belum
  ada type augmentation NextAuth, jadi akan gagal `tsc`/build dengan error
  "Property 'id' does not exist". Diperbaiki dengan `src/types/next-auth.d.ts`.
  `lib/auth.ts` session callback dirapikan (hapus cast manual `as {id?:string}`
  yang sekarang tidak perlu lagi).
- Non-null assertion berantai (`session!.user!.id!`) di dua halaman member
  diganti pengecekan eksplisit + `redirect()` — lebih aman dan lolos strict
  type-check tanpa assertion.
### Added
- Batch 9 (bagian terbesar) — Cart, Checkout, Tracking Pesanan end-to-end:
  - `context/CartContext.tsx`: cart client-side persisten `localStorage`,
    checklist per item (hanya item tercentang yang ikut checkout). Disambungkan
    ke `layout.tsx`. Badge jumlah item ditambahkan ke `Navbar.tsx` (desktop & mobile).
  - **10 kalkulator kategori** (`components/product/calculators/*.tsx`):
    signature `onPriceChange` diperluas jadi `(subtotal, summary?)` — dipakai
    untuk mengisi ringkasan variasi di cart. `CategoryCalculator.tsx` diupdate
    mengikuti.
  - `components/product/AddToCartPanel.tsx`: membungkus `CategoryCalculator`
    + tombol "Tambah ke Keranjang" (redirect ke Login dulu jika belum masuk).
    Disambungkan ke `app/produk/[slug]/page.tsx`, menggantikan pemakaian
    langsung `CategoryCalculator`.
  - `app/member/layout.tsx`: guard SERVER-SIDE (`getServerSession` + `redirect`)
    — halaman member tidak pernah ikut ter-render untuk pengunjung belum login.
  - `app/member/cart/page.tsx` + `components/cart/CartTable.tsx`: checklist,
    ubah qty, hapus item, subtotal item tercentang, tombol Checkout.
  - `hooks/useCountdown.ts` + `components/ui/Countdown.tsx`: hitung mundur
    real-time generik (dipakai Checkout & Tracking), `onExpire` sekali panggil.
  - `app/member/checkout/page.tsx` + `CheckoutClient.tsx`: kirim item
    tercentang ke `POST /api/checkout`, load Midtrans **Snap.js** via
    `next/script`, buka popup pembayaran (`window.snap.pay`), redirect ke
    halaman Tracking pesanan setelah sukses/pending/popup ditutup.
  - `app/api/midtrans/cancel-expired/route.ts` + `vercel.json`: cron sekali
    sehari pada 00:00 UTC, membatalkan otomatis order `MENUNGGU_PEMBAYARAN` yang melewati
    `expiredAt` (implementasi nyata dari "Countdown 1x24 jam" + auto-cancel
    yang sebelumnya cuma placeholder path kosong di struktur direktori).
    Dilindungi header `Authorization: Bearer <CRON_SECRET>`.
  - `lib/orders.ts`: `getOrdersByUser`, `getOrderForUser` (WAJIB cek
    kepemilikan — order milik user lain diperlakukan SAMA seperti order tidak
    ada, supaya tidak bocor info), `ORDER_STATUS_LABEL`, `ORDER_STATUS_FLOW`.
  - `components/order/OrderTrackingStepper.tsx` + `OrderStatusBadge.tsx`.
  - `app/member/pesanan/page.tsx` (daftar pesanan) dan
    `app/member/pesanan/[orderId]/page.tsx` (tracking detail, server
    component) + `CountdownSection.tsx` (client wrapper Countdown + tombol
    "Lanjutkan Pembayaran").
  - `components/review/ReviewForm.tsx`: bintang rating + komentar, POST ke
    `/api/reviews`, hanya dirender di Tracking saat `order.status === DITERIMA`
    DAN item tsb belum diulas — menutup satu-satunya bagian UI yang belum ada
    dari fitur review sejak batch 7.
### Changed
- `prisma/schema.prisma`: `Order` ditambah field `snapRedirectUrl` (String?)
  — menyimpan URL halaman pembayaran Midtrans Snap agar bisa dipakai tombol
  "Lanjutkan Pembayaran" di Tracking jika popup Snap saat checkout
  ditutup/gagal, tanpa perlu generate ulang transaksi Midtrans.
- `app/api/checkout/route.ts`: menyimpan `snapRedirectUrl` ke order setelah
  transaksi Midtrans berhasil dibuat.
- `.env.example`: `MIDTRANS_CLIENT_KEY` diganti `NEXT_PUBLIC_MIDTRANS_CLIENT_KEY`
  (client key memang didesain publik oleh Midtrans, dipakai Snap.js di
  browser — beda dari server key yang harus rahasia), tambah
  `NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION` dan `CRON_SECRET`.
### Notes
- **PENTING setelah `git pull`**: field baru `Order.snapRedirectUrl` di schema
  berarti kamu perlu jalankan `npx prisma migrate dev` lagi untuk sinkronkan
  database lokal.
- Daftarkan cron ini di Vercel dengan set `CRON_SECRET` di Environment
  Variables (Vercel otomatis mengirim header `Authorization: Bearer
  <CRON_SECRET>` saat memanggil cron path di `vercel.json`) — tanpa ini,
  endpoint `cancel-expired` bisa dipanggil publik (dampaknya terbatas, tapi
  tetap sebaiknya dikunci).
- `AddToCartPanel.tsx` punya field "Qty Pesanan Ini" terpisah dari input
  jumlah cetak DI DALAM kalkulator — ada TODO untuk mengevaluasi UX ini,
  berpotensi membingungkan pengguna kalau tidak dijelaskan dengan baik.
- Alur pemesanan sekarang bisa dites end-to-end: Produk → Tambah ke Keranjang
  → Cart → Checkout (Midtrans Sandbox) → Tracking (stepper + countdown) →
  Ulasan (setelah status diubah manual ke DITERIMA, mis. lewat Prisma Studio
  selama admin panel belum dibuat).

## [0.8.0] - 2026-09-09
### Added
- Batch 8 — Halaman Produk (`app/produk/page.tsx`):
  - Listing produk dengan mode **Grid** dan **List** (`ProductGridList.tsx`,
    komponen presentasi murni, tanpa hooks — aman dirender dari server component).
  - Filter kategori (10 kategori) + filter **Relevan / Populer / Baru / Terlaris**
    + sorting harga **Rendah ke Tinggi / Tinggi ke Rendah** (`ProductFilterSort.tsx`).
  - Semua kontrol filter/sort/tampilan bekerja lewat **query string**
    (`?kategori=&filter=&urut=&tampilan=`), bukan React state biasa — supaya
    hasil filter bisa di-bookmark, di-share, dan tetap benar saat halaman
    di-refresh (`app/produk/page.tsx` membaca query string yang sama di server).
  - `lib/products.ts`: fungsi baru `getProducts(options)` dengan `resolveOrderBy`
    — "Baru" diurut `createdAt desc`, "Populer" diproksi dari jumlah ulasan
    (`reviews._count`), "Terlaris" diproksi dari jumlah baris `OrderItem`
    (`orderItems._count`), sorting harga (jika dipilih user) selalu menimpa
    filter di atas.
  - `CATEGORY_OPTIONS`: dipindah ke `lib/products.ts` sebagai **satu sumber**
    daftar kategori (slug + label) — dipakai bersama oleh halaman Produk,
    Home, dan Kalkulator Harga Global (Simulator).
### Changed
- `app/page.tsx` (Home) dan `app/simulator/KalkulatorHargaGlobal.tsx`:
  daftar kategori hardcode masing-masing dihapus, diganti import
  `CATEGORY_OPTIONS` dari `lib/products.ts`.
### Notes
- Filter **Populer** dan **Terlaris** memakai proksi (jumlah ulasan / jumlah
  transaksi) karena belum ada tracking kunjungan produk — cari
  `TODO: GANTI_DENGAN_METRIK_VIEW_COUNT` dan `TODO: PERTIMBANGKAN_SUM_QUANTITY`
  di `lib/products.ts` jika ingin metrik yang lebih akurat.
- Filter **Relevan** untuk saat ini setara dengan "Baru" (`createdAt desc`)
  karena belum ada fitur pencarian teks di halaman Produk — TODO menyusul
  begitu search bar produk dibuat.
- `ProductGridList.tsx` masih pakai placeholder teks (bukan `next/image`)
  sama seperti `ProductCarousel.tsx` di batch 6 — alasan sama: domain CDN
  gambar belum dikonfigurasi di `next.config.mjs`.

## [0.7.0] - 2026-09-09
### Added
- Batch 7 — Halaman Kontak:
  - `app/kontak/page.tsx`: info alamat, WhatsApp (link `wa.me`), email, jam
    operasional, Google Maps embed, dan form pesan.
  - `app/kontak/ContactForm.tsx`: client form, kirim via `POST /api/contact`.
  - `app/api/contact/route.ts`: validasi input, kirim notifikasi WhatsApp ke
    admin berisi nama/kontak/pesan pengirim (memakai ulang `sendWhatsAppMessage`
    dari `lib/whatsapp.ts` — tidak ada logic WA baru yang terpisah).
- Batch 7 — Halaman About Us (`app/about-us/page.tsx`): profil singkat, Visi
  & Misi, 4 poin keunggulan, CTA ke halaman Produk & Kontak.
- `components/review/ReviewList.tsx`: menampilkan daftar ulasan produk
  (rating bintang + komentar) di halaman detail produk — server component,
  query Prisma langsung (tanpa round-trip HTTP ke API sendiri).
### Changed
- `lib/products.ts`: `ProductDetail` ditambah field `id` (Prisma product id,
  bukan slug) — dibutuhkan `ReviewList` untuk query ulasan per produk, dan
  nantinya oleh form ulasan/cart di batch berikutnya.
- `app/produk/[slug]/page.tsx`: menyematkan `<ReviewList productId={product.id} />`
  di bagian bawah halaman. Menutup TODO yang tercatat di `app/api/reviews/route.ts`
  ("SEMATKAN_DI_UI").
### Verified (sudah ada dari pengerjaan sebelumnya, tidak diubah)
- `app/api/reviews/route.ts` (POST + GET) sudah lengkap dan benar sesuai
  spesifikasi: validasi login, kepemilikan order, order harus berstatus
  `DITERIMA`, productId harus ada di dalam order tsb, dan mencegah ulasan
  ganda lewat unique constraint `userId_orderId_productId`. Dicek ulang saat
  audit batch ini — tidak ada perubahan yang diperlukan.
### Notes
- Form PEMBUATAN ulasan (`ReviewForm.tsx`, yang memanggil `POST /api/reviews`)
  belum dibuat — akan disematkan di halaman Tracking Pesanan member (menu
  Member Area) begitu dikerjakan, karena di situlah status `DITERIMA`
  terlihat oleh pemilik pesanan.
- Data kontak (alamat, nomor WA, email, jam operasional) & lokasi Maps di
  `app/kontak/page.tsx` masih placeholder — cari
  `TODO: GANTI_SEMUA_DATA_KONTAK_DI_BAWAH_DENGAN_DATA_ASLI_BISNIS_ANDA`.
- Pesan dari form Kontak belum disimpan ke database (hanya diteruskan sebagai
  notifikasi WA) — tambahkan model `ContactMessage` di `prisma/schema.prisma`
  jika ingin riwayat pesan tersimpan.

## [0.6.0] - 2026-09-09
### Fixed
- **Bug dari batch 1** — `Navbar.tsx` memakai `useSession()` tapi root layout
  belum pernah dibungkus `<SessionProvider>`, yang akan crash saat runtime
  dengan error `[next-auth]: useSession must be wrapped in a <SessionProvider />`.
  Ditemukan & diperbaiki saat audit batch 6.
### Added
- `src/context/AuthProvider.tsx`: wrapper `<SessionProvider>` — disambungkan
  ke `app/layout.tsx` (membungkus `ThemeProvider`), memperbaiki bug di atas.
- Batch 6 — Halaman Home (`app/page.tsx`):
  - `components/home/BannerSlider.tsx`: banner slide dengan swipe mode
    (touch events), autoplay 5 detik, panah navigasi (desktop), dot indicator.
  - `components/home/ProductCarousel.tsx`: carousel horizontal produk
    terbaru dengan tombol geser kiri/kanan, scrollbar disembunyikan.
  - Shortcut 10 kategori produk + CTA ke halaman Simulator.
  - `lib/products.ts`: fungsi baru `getAllProducts(limit)` untuk carousel.
- Batch 6 — Halaman Login & Register:
  - `app/(auth)/login/page.tsx` + `LoginForm.tsx`: login Credentials (email/
    password) via `signIn("credentials")`, tombol "Login with Google" via
    `signIn("google")`, redirect ke `callbackUrl` (default `/member`).
  - `app/(auth)/register/page.tsx` + `RegisterForm.tsx`: daftar via
    `POST /api/register`, lalu auto-login, redirect ke `/member`.
  - `app/api/register/route.ts`: validasi input, cek email duplikat, hash
    password dengan bcrypt (`SALT_ROUNDS = 10`), buat `User` baru role
    `CUSTOMER`. Tidak pernah mengembalikan `passwordHash` ke client.
### Notes
- `LoginForm.tsx` dibungkus `<Suspense>` di `page.tsx` karena memakai
  `useSearchParams()` (untuk baca `callbackUrl`) — wajib di App Router,
  kalau tidak build akan gagal.
- Icon Google di tombol login/register masih emoji placeholder (🔵) — cari
  `TODO: GANTI_DENGAN_ICON_GOOGLE_ASLI` di kedua file form.
- `BannerSlider` & `ProductCarousel` masih pakai gradient/placeholder teks
  sebagai pengganti gambar asli (belum ada `next/image`, karena domain CDN
  gambar belum dikonfigurasi di `next.config.mjs`) — TODO sebelum production.

## [0.5.0] - 2026-09-09
### Added
- Batch 5 — Halaman Simulator lengkap (menu "Simulator" di Navbar):
  - `app/simulator/page.tsx`: server component, `generateMetadata`, merender `<SimulatorTabs/>`.
  - `app/simulator/SimulatorTabs.tsx`: client component tab switch (pill toggle)
    antara "Simulator Spin Buku" dan "Kalkulator Harga" — hanya satu tab
    dirender sekaligus, state kalkulator direset saat pindah tab.
  - `app/simulator/SpinBukuSimulator.tsx`: input jumlah halaman, jenis +
    gramasi kertas isi, jenis cover → estimasi tebal spin real-time (mm & cm).
  - `app/simulator/KalkulatorHargaGlobal.tsx`: dropdown 10 kategori produk +
    memakai ulang `CategoryCalculator` yang sama dengan halaman detail
    produk (bukan komponen terpisah) — plus link "Lihat produk `<kategori>`"
    menuju `/produk?kategori=...`.
  - `lib/pricing/spinBuku.ts`: rumus `calculateSpinThickness` — satu sumber
    kebenaran ketebalan spin, dipakai Simulator DAN `BukuCustomCalculator`.
### Changed
- `lib/pricing/types.ts`: `BukuCustomVariables.tebalSpin` (input manual)
  diganti `jumlahHalaman` (dipakai untuk menghitung tebal spin otomatis).
- `components/product/calculators/BukuCustomCalculator.tsx`: field tebal
  spin sekarang OTOMATIS terhitung dari jumlah halaman + gramasi + jenis
  cover (memanggil `calculateSpinThickness` yang sama dengan Simulator),
  ditampilkan sebagai info read-only, bukan input manual lagi. Ini menutup
  TODO integrasi Spin Buku yang tercatat sejak batch 4.
### Notes
- Data ketebalan kertas di `lib/pricing/spinBuku.ts` (`KETEBALAN_KERTAS_MM_PER_LEMBAR`)
  masih estimasi umum industri — cari `TODO: GANTI_DENGAN_DATA_BULK_KERTAS_ASLI`
  dan sesuaikan dengan data supplier kertas Anda untuk akurasi produksi.
- `KalkulatorHargaGlobal.tsx` sengaja memakai ulang `CategoryCalculator`
  (bukan kalkulator terpisah) agar estimasi di Simulator tidak pernah
  berbeda hasil dari harga final di halaman produk.

## [0.4.0] - 2026-09-09
### Added
- Batch 4 — 9 kalkulator kategori produk sisanya, melengkapi Banner (batch 1):
  Brosur, Buku Nota, Buku Custom, Cetak A3+, Kartu Nama, Dokumen, Stiker,
  Kalender, Merchandise. Masing-masing punya file rumus di `lib/pricing/*.ts`
  + komponen UI di `components/product/calculators/*.tsx`, mengikuti pola
  `BannerCalculator` (state form → `useMemo` → `onPriceChange` callback →
  rincian harga real-time).
- `lib/utils/format.ts`: helper `formatRupiah` bersama — dipakai semua 10
  kalkulator + halaman detail produk (menggantikan duplikasi `Intl.NumberFormat`
  di tiap file).
- `components/product/CategoryCalculator.tsx`: resolver yang memilih
  kalkulator sesuai `product.category` secara otomatis. Kategori tidak
  dikenal ditangani dengan pesan fallback, bukan crash.
- `prisma/seed.ts`: diperluas jadi 10 produk (1 per kategori) supaya semua
  kalkulator langsung bisa dites setelah `npm run prisma:seed`.
### Changed
- `app/produk/[slug]/page.tsx`: `<BannerCalculator />` hardcoded diganti
  `<CategoryCalculator category={product.category} />` — otomatis
  menampilkan kalkulator yang tepat untuk semua 10 kategori.
- `components/product/calculators/BannerCalculator.tsx`: pakai `formatRupiah`
  dari helper bersama (`lib/utils/format.ts`), fungsi lokal duplikat dihapus.
### Notes
- Kategori Stiker: satuan input otomatis berubah label "lembar" (A3+) vs
  "meter" (Indoor/Outdoor) mengikuti pilihan Jenis Mesin.
- Kategori Merchandise: harga masih "estimasi awal" per sub-kategori (lihat
  disclaimer di komponennya) karena variasi bahan/spesifikasi sangat luas —
  TODO menambahkan alur konfirmasi harga manual oleh admin jika diperlukan.
- Kategori Buku Custom: field `tebalSpin` masih input manual — TODO
  mengintegrasikan dengan Simulator Spin Buku (menu Simulator, belum dibuat)
  agar dihitung otomatis dari jumlah halaman.
- Semua data harga pokok di `lib/pricing/*.ts` adalah DATA DUMMY — cari
  `TODO: GANTI_DENGAN_HARGA_POKOK_ASLI_ANDA` di 9 file baru dan sesuaikan
  sebelum production.

## [0.3.0] - 2026-09-09
### Added
- Batch 3 — Prisma schema (`prisma/schema.prisma`): model `User`/`Account`/
  `Session`/`VerificationToken` (kompatibel `@auth/prisma-adapter`), `Product`
  (dengan enum `ProductCategory` untuk 10 kategori), `Order`/`OrderItem`
  (dengan enum `OrderStatus`: MENUNGGU_PEMBAYARAN → TERVERIFIKASI → DIKEMAS →
  PICKUP → DALAM_PENGIRIMAN → DITERIMA / DIBATALKAN), dan `Review` (unique
  constraint agar 1 item hanya bisa diulas 1x per order).
- `src/lib/prisma.ts`: PrismaClient singleton (pola resmi Next.js, cegah
  koneksi berlebih saat hot-reload).
- `prisma/seed.ts`: seed 3 produk contoh, jalankan via `npm run prisma:seed`.
### Changed
- `lib/products.ts`: diganti total dari data dummy ke query Prisma asli
  (`getAllProductSlugs`, `getProductBySlug`, + fungsi baru
  `getProductsByCategorySlug`). Termasuk mapping enum `ProductCategory`
  (SCREAMING_SNAKE_CASE di DB) ke slug kebab-case yang dipakai URL/komponen.
- `lib/auth.ts`: `authorize()` Credentials Provider sekarang query `prisma.user`
  + verifikasi `bcrypt.compare` sungguhan (bukan lagi placeholder `return null`).
  Ditambahkan `PrismaAdapter(prisma)` untuk menyimpan akun Google.
- `app/api/checkout/route.ts`: sekarang benar-benar `prisma.order.create(...)`
  sebelum memanggil Midtrans, dan me-rollback status order jadi `DIBATALKAN`
  jika pemanggilan Midtrans gagal (mencegah order menggantung tanpa token bayar).
- `app/api/midtrans/notification/route.ts`: sekarang query order dari database,
  memetakan `transaction_status` Midtrans ke `OrderStatus` internal, dan hanya
  mengirim notifikasi WA jika status benar-benar berubah (idempotent — aman
  jika Midtrans mengirim webhook yang sama berkali-kali).
- `scripts/generate-project.sh`: `package.json` boilerplate ditambah
  `@auth/prisma-adapter`, `bcryptjs`, `@types/bcryptjs`, `tsx`, dan script
  `prisma:seed` / `prisma:migrate`.
### Notes
- Setelah `npm install`, jalankan `npx prisma migrate dev --name init` untuk
  membuat tabel di database, lalu `npm run prisma:seed` untuk mengisi data awal.
- `Order.id` masih format string manual (`ZNZ-<timestamp>`) sesuai
  `app/api/checkout/route.ts` — TODO jika ingin format lain, ganti generator
  di route tersebut (schema Prisma sudah fleksibel, tidak pakai `@default(cuid())`
  khusus untuk `Order.id` agar formatnya bisa dikontrol manual).
- `Review` belum punya API endpoint (POST /api/reviews) — aturan "hanya boleh
  mengulas setelah status DITERIMA" baru divalidasi di level schema lewat
  relasi `orderId`, validasi aktualnya menyusul di batch Cart/Tracking.

## [0.2.0] - 2026-09-09
### Added
- Batch 2 — File SEO lengkap: `app/robots.ts` (robots.txt dinamis), `app/sitemap.ts`
  (sitemap.xml dinamis mencakup halaman statis, kategori, dan seluruh slug produk),
  `lib/seo/organizationSchema.ts` (JSON-LD Organization, disematkan di root layout),
  `app/faq/page.tsx` (dengan FAQPage Schema JSON-LD), `app/privacy-policy/page.tsx`,
  `public/llms.txt`.
- `lib/products.ts`: helper sementara data produk (dummy) — dipakai sitemap &
  halaman detail produk sebelum Prisma schema (batch 4) siap.
- `app/produk/[slug]/page.tsx`: halaman detail produk dengan `generateMetadata`
  (meta tags dinamis per produk) + Product Schema JSON-LD + Kalkulator Harga
  Produk Spesifik tersemat (contoh pakai `BannerCalculator`).
### Changed
- `app/layout.tsx`: menyematkan `<script type="application/ld+json">` Organization
  Schema di `<head>`.
### Notes
- `lib/products.ts` masih data dummy — WAJIB diganti query Prisma asli begitu
  schema database (batch 4) selesai, atau sitemap/metadata akan menampilkan
  data yang salah di production.
- Domain `https://zanzilindo.com` masih placeholder di beberapa file
  (`robots.ts`, `sitemap.ts`, `organizationSchema.ts`, `llms.txt`) — cari
  `TODO: GANTI_DENGAN_DOMAIN_ASLI_ANDA` dan ganti sebelum deploy production.

## [0.1.0] - 2026-09-09
### Added
- Scaffold awal proyek: struktur folder, README, script generator.
- Source code krusial batch 1: Navbar, BannerCalculator (template pola kalkulator),
  integrasi Midtrans (createTransaction + webhook notification), integrasi
  WhatsApp notify, konfigurasi NextAuth dengan Google Provider.
### Notes
- 9 kalkulator kategori produk lain (Brosur, Buku Nota, Buku Custom, Cetak A3+,
  Kartu Nama, Dokumen, Stiker, Kalender, Merchandise) BELUM diimplementasi —
  ikuti pola `BannerCalculator.tsx` + `lib/pricing/bannerPricing.ts`.
- File SEO (robots.ts, sitemap.ts, organizationSchema.ts, FAQ page, Privacy
  Policy page) BELUM diimplementasi pada batch ini.
```

---

## 7. Status Audit Batch Ini

Kode yang diberikan pada batch 1 (lihat pesan berikutnya) sudah dicek untuk:
- ✅ Tidak ada circular import (pricing logic terpisah dari komponen UI).
- ✅ Semua komponen client diberi `"use client"` di baris pertama.
- ✅ Tidak ada penggunaan variabel/komponen yang belum didefinisikan.
- ⚠️ Placeholder `// TODO:` wajib diisi sebelum production (API key, nomor WA admin, dsb).

**Update batch 7 (Kontak + About Us + endpoint):** halaman Kontak (info +
Maps + form) dan About Us lengkap. Endpoint `POST/GET /api/reviews` ternyata
sudah ada dari pengerjaan sebelumnya dan sudah dicek ulang — implementasinya
benar (validasi login, kepemilikan order, status `DITERIMA`, productId cocok,
cegah ulasan ganda). Ditambahkan `ReviewList.tsx` untuk menampilkan ulasan
di halaman produk, menutup TODO "SEMATKAN_DI_UI" yang sebelumnya tercatat.
Audit otomatis (import + kurung kurawal seimbang) dijalankan ulang — lolos.

**Belum termasuk sampai batch 7** (menyusul di batch berikutnya):
halaman Cart/Checkout/Tracking UI (+ Countdown timer 1x24 jam & cron
pembatalan order expired) — termasuk `ReviewForm.tsx` untuk MEMBUAT ulasan,
yang disematkan di halaman Tracking Pesanan — dan halaman Produk (listing
grid/list + filter/sort).

**Update batch 8 (Halaman Produk):** listing produk grid/list + filter
Relevan/Populer/Baru/Terlaris + sorting harga, semuanya URL-driven (query
string) agar bisa di-bookmark. `CATEGORY_OPTIONS` dirapikan jadi satu sumber
di `lib/products.ts`, menghapus 2 daftar kategori hardcode yang sebelumnya
terpisah di Home dan Kalkulator Harga Global. Audit ulang dijalankan: semua
import `@/...` resolve, dan seluruh named export yang di-import benar-benar
ada di file sumbernya (dicek dengan regex yang memperhitungkan `export async
function`) — 0 warning nyata dari 65 file.

**Belum termasuk sampai batch 8** (satu-satunya yang tersisa untuk alur
pemesanan end-to-end): halaman Cart, Checkout UI, Tracking Pesanan +
Countdown timer 1x24 jam + cron pembatalan order expired + `ReviewForm.tsx`
(disematkan di halaman Tracking, karena di situlah status "Diterima" terlihat
oleh pemilik pesanan).

**Update batch 9 (Cart, Checkout, Tracking — PENUTUP alur pemesanan):**
bagian terbesar & terakhir selesai. Saat audit, ditemukan 2 bug nyata dan
langsung diperbaiki (bukan ditunda ke batch berikutnya):
1. `session.user.id` dipakai di banyak file tapi belum ada NextAuth type
   augmentation → akan gagal build. Diperbaiki via `types/next-auth.d.ts`.
2. Non-null assertion berantai (`session!.user!.id!`) di 2 halaman member,
   diganti pengecekan eksplisit + `redirect()`.

Audit final dijalankan ulang mencakup: import resolve, named-export exists,
DAN pengecekan tambahan "tidak ada `session!.user!` tersisa di codebase" —
semua lolos bersih di 84 file.

**Seluruh spesifikasi awal sudah diimplementasikan.** Yang masih berupa data
dummy/placeholder & perlu disesuaikan sebelum production (semua sudah
ditandai `TODO:` di kodenya masing-masing): harga pokok di 10 file
`lib/pricing/*.ts`, domain asli di file-file SEO, API key Midtrans/Google/
WhatsApp di `.env.local`, gambar produk asli (masih placeholder teks/gradient
karena `next/image` + domain CDN belum dikonfigurasi), dan halaman admin
untuk kelola produk/pesanan (saat ini lewat Prisma Studio atau query manual —
belum ada UI admin, di luar cakupan spesifikasi awal).
