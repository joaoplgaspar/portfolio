import createMiddleware from "next-intl/middleware";
import { routing } from "./src/i18n/routing";

export default createMiddleware(routing);

export const config = {
  // roda em tudo, menos api, assets internos e arquivos com extensão
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
