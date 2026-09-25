import { redirect } from "@/i18n/navigation";

// O índice de trabalho agora é a própria home. Mantém o link antigo funcionando.
export default async function WorkRedirect({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect({ href: "/", locale });
}
