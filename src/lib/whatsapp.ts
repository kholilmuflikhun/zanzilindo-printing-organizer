// src/lib/whatsapp.ts

// TODO: GANTI_JIKA_PAKAI_PROVIDER_WA_LAIN (contoh di sini pakai gaya Fonnte).
// Provider lain umumnya cuma beda endpoint & format header/body — struktur
// fungsi ini tetap bisa dipakai.
const WHATSAPP_API_URL = process.env.WHATSAPP_API_URL ?? "";
const WHATSAPP_API_TOKEN = process.env.WHATSAPP_API_TOKEN ?? "";
const ADMIN_WHATSAPP_NUMBER = process.env.ADMIN_WHATSAPP_NUMBER ?? "";

/**
 * Mengirim pesan WhatsApp ke nomor admin/pemilik website.
 * Dipanggil saat: (1) ada checkout baru, (2) pembayaran Midtrans sukses.
 * Fungsi ini sengaja "fail-safe": jika gagal kirim WA, tidak melempar error
 * yang membatalkan proses checkout/pembayaran — hanya dicatat di log.
 */
export async function sendWhatsAppMessage(message: string, to: string = ADMIN_WHATSAPP_NUMBER) {
  if (!WHATSAPP_API_URL || !WHATSAPP_API_TOKEN || !to) {
    console.warn("[WhatsApp] Konfigurasi belum lengkap — pesan tidak dikirim.", { message });
    return;
  }

  try {
    const res = await fetch(WHATSAPP_API_URL, {
      method: "POST",
      headers: {
        Authorization: WHATSAPP_API_TOKEN, // TODO: SESUAIKAN_FORMAT_HEADER dengan provider Anda
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        target: to,
        message,
      }),
    });

    if (!res.ok) {
      console.error("[WhatsApp] Gagal mengirim notifikasi:", await res.text());
    }
  } catch (err) {
    console.error("[WhatsApp] Error saat mengirim notifikasi:", err);
  }
}
