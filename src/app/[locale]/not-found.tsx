import Container from "@/components/layout/Container";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  return (
    <Container className="flex min-h-screen flex-col items-center justify-center gap-6 text-center">
      <p className="text-label text-accent-lift">404</p>
      <h1 className="text-display">Página não encontrada</h1>
      <Link
        href="/"
        className="text-label text-muted transition-colors hover:text-fg"
      >
        ← Voltar ao início
      </Link>
    </Container>
  );
}
