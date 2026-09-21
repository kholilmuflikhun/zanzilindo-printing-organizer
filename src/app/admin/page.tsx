import type { Metadata } from "next";
import AdminDashboard from "@/app/admin/AdminDashboard";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Pusat pengelolaan Zanzilindo.",
};

export default function AdminPage() {
  return <AdminDashboard />;
}
