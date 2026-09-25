import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // EN é o padrão: o público é quem contrata fora do Brasil.
  // EN sem prefixo (/), PT prefixado (/pt).
  locales: ["en", "pt"],
  defaultLocale: "en",
  localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];
