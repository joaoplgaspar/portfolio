import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import AdminClient from "./AdminClient";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <AdminClient />;
}
