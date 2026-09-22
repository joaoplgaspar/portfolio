"use client";

import { useRef, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import {
  buildInfo,
  useCapabilities,
  useClock,
  useFps,
  useLcp,
  useOnScreen,
} from "@/lib/telemetry";

/**
 * Barra de telemetria — o site mostrando as próprias vísceras.
 *
 * Equivalente ao relógio/globo do xiangyidesign (ver
 * docs/teardown-xiangyidesign.md), mas com identidade de engenheiro: em vez de
 * fuso e moodboard, o que este site sabe sobre si mesmo — hora, build, quadros
 * por segundo, LCP medido neste visitante, capacidade de GPU.
 *
 * Nada aqui é decorativo e nada é estimado: campo sem medição não é exibido.
 * É o tipo de detalhe que um técnico confere em três segundos — e se um
 * número estiver inventado, some junto a credibilidade do resto do site.
 */

/** Dígitos rolam ao trocar; o resto do texto fica parado. */
function Odometer({ value }: { value: string }) {
  return (
    <span className="tabular-nums">
      {value.split("").map((char, i) =>
        /\d/.test(char) ? (
          // A `key` inclui o dígito de propósito: quando ele muda, o React
          // remonta o span e a animação de CSS recomeça. Dígito que não mudou
          // mantém a key e fica parado.
          <span key={`${i}-${char}`} className="tele-digit">
            {char}
          </span>
        ) : (
          <span key={i}>{char}</span>
        ),
      )}
    </span>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <span className="tele-field">
      <span className="tele-label">{label}</span>
      <span className="tele-value">{children}</span>
    </span>
  );
}

export default function Telemetry({ className = "" }: { className?: string }) {
  const t = useTranslations("telemetry");
  const ref = useRef<HTMLDivElement>(null);

  const onScreen = useOnScreen(ref);
  const clock = useClock();
  const fps = useFps(onScreen);
  const lcp = useLcp();
  const caps = useCapabilities();
  const build = buildInfo();

  return (
    <div
      ref={ref}
      className={`tele ${className}`}
      // Muda a cada segundo: anunciar isso num live region seria um leitor de
      // tela falando um relógio para sempre. O conteúdo é informativo, não
      // essencial — a hora e o local também estão no rodapé em texto normal.
      role="group"
      aria-label={t("aria")}
    >
      <Field label={t("place")}>
        {clock ? <Odometer value={clock} /> : <span className="tele-idle">--:--:--</span>}
      </Field>

      {build && (
        <Field label={t("build")}>
          <span className="tele-raw">{build.sha}</span>
          {build.stamp && <span className="tele-dim"> · {build.stamp}</span>}
        </Field>
      )}

      {fps !== null && (
        <Field label={t("fps")}>
          <Odometer value={String(fps)} />
        </Field>
      )}

      {lcp !== null && (
        <Field label={t("lcp")}>
          <span className="tele-raw tabular-nums">{lcp.toFixed(2)}s</span>
        </Field>
      )}

      {caps?.gl && (
        <Field label={t("gpu")}>
          {caps.gl}
          <span className="tele-dim"> · DPR {caps.dpr}</span>
        </Field>
      )}

      <span className="tele-field">
        <span className="relative flex size-[5px]">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent-lift opacity-60" />
          <span className="relative inline-flex size-[5px] rounded-full bg-accent-lift" />
        </span>
        <span className="tele-value">{t("availability")}</span>
      </span>
    </div>
  );
}
