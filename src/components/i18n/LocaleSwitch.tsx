"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export default function LocaleSwitch() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex items-center gap-2 text-label">
      {routing.locales.map((loc, i) => (
        <span key={loc} className="flex items-center gap-2">
          {i > 0 && <span aria-hidden className="text-muted/50">/</span>}
          <button
            type="button"
            onClick={() => router.replace(pathname, { locale: loc })}
            aria-current={loc === locale ? "true" : undefined}
            className={
              loc === locale
                ? "text-fg"
                : "text-muted transition-colors hover:text-fg"
            }
          >
            {loc.toUpperCase()}
          </button>
        </span>
      ))}
    </div>
  );
}
