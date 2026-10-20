import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Next 16: convenção "proxy" (substitui "middleware").
export default createMiddleware(routing);

export const config = {
  // roda em tudo, menos api, assets internos e arquivos com extensão
  // e a imagem de compartilhamento: /en/opengraph-image redirecionava (307),
  // e robô de rede social nem sempre segue redirecionamento.
  matcher: ["/((?!api|_next|_vercel|.*opengraph-image|.*\\..*).*)"],
};
