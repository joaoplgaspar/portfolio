import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["pt", "en"],
  defaultLocale: "pt",
  // PT sem prefixo (/), EN prefixado (/en)
  localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];
