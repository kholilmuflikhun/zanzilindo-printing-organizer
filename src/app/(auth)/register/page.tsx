// src/app/(auth)/register/page.tsx
import type { Metadata } from "next";
import RegisterForm from "./RegisterForm";

export const metadata: Metadata = {
  title: "Daftar Akun",
  description: "Buat akun Zanzilindo untuk mulai memesan produk percetakan dan merchandise custom.",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
