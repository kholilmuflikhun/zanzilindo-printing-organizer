// src/lib/midtrans.ts
import crypto from "crypto";

// TODO: GANTI_DENGAN_MIDTRANS_SERVER_KEY_ANDA (isi via .env.local, JANGAN hardcode)
const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY ?? "";
const IS_PRODUCTION = process.env.MIDTRANS_IS_PRODUCTION === "true";

const SNAP_BASE_URL = IS_PRODUCTION
  ? "https://app.midtrans.com/snap/v1/transactions"
  : "https://app.sandbox.midtrans.com/snap/v1/transactions";

export interface CreateTransactionParams {
  orderId: string;
  grossAmount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  itemDetails: { id: string; price: number; quantity: number; name: string }[];
}

export interface SnapTransactionResponse {
  token: string;
  redirect_url: string;
}

/**
 * Membuat transaksi Snap Midtrans dan mengembalikan token pembayaran.
 * Dipanggil dari `app/api/checkout/route.ts` setelah order dibuat di database.
 */
export async function createMidtransTransaction(
  params: CreateTransactionParams
): Promise<SnapTransactionResponse> {
  const authHeader = Buffer.from(`${MIDTRANS_SERVER_KEY}:`).toString("base64");

  // Batas waktu pembayaran 1x24 jam sesuai spesifikasi.
  const expiryDuration = 24;

  const res = await fetch(SNAP_BASE_URL, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Basic ${authHeader}`,
    },
    body: JSON.stringify({
      transaction_details: {
        order_id: params.orderId,
        gross_amount: params.grossAmount,
      },
      customer_details: {
        first_name: params.customerName,
        email: params.customerEmail,
        phone: params.customerPhone,
      },
      item_details: params.itemDetails,
      expiry: {
        unit: "hour",
        duration: expiryDuration,
      },
    }),
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`Gagal membuat transaksi Midtrans: ${res.status} ${errorBody}`);
  }

  return res.json();
}

/**
 * Memverifikasi signature_key yang dikirim Midtrans pada webhook notification,
 * untuk memastikan request benar-benar berasal dari Midtrans (bukan pihak lain).
 * Rumus resmi: SHA512(order_id + status_code + gross_amount + ServerKey)
 */
export function verifyMidtransSignature(payload: {
  order_id: string;
  status_code: string;
  gross_amount: string;
  signature_key: string;
}): boolean {
  const expected = crypto
    .createHash("sha512")
    .update(payload.order_id + payload.status_code + payload.gross_amount + MIDTRANS_SERVER_KEY)
    .digest("hex");

  return expected === payload.signature_key;
}
