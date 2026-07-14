import { redirect } from "@/i18n/navigation";

// Contato virou o footer rico. Mantém o link antigo funcionando.
export default async function ContactRedirect({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect({ href: "/", locale });
}
