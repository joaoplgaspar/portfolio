import Container from "@/components/layout/Container";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  return (
    <Container className="flex min-h-screen flex-col justify-center gap-5">
      <p className="text-label text-accent-lift">404</p>
      <h1 className="max-w-[14ch] font-display text-[clamp(2.6rem,7vw,5rem)] font-semibold leading-[0.95] tracking-tight text-balance">
        Página não encontrada.
      </h1>
      <p className="max-w-md text-lg text-muted">
        O link se perdeu — mas o trabalho está aqui.
      </p>
      <Link
        href="/"
        className="mt-2 w-fit text-label text-muted transition-colors hover:text-fg"
      >
        ← Ir para o início
      </Link>
    </Container>
  );
}
