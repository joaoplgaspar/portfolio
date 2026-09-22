"use client";

import Image from "next/image";
import { useRef } from "react";
import type { Media } from "@/data/stores";

/**
 * As duas faces de um cartão de projeto. A primeira é o logo (centralizado
 * na prancha) ou a print; a segunda entra no hover: a mídia cadastrada
 * (imagem, GIF ou vídeo da navegação) ou, quando a primeira é logo, a print.
 *
 * Vídeo só toca enquanto o ponteiro está em cima e volta ao início ao sair;
 * `preload="none"` para não pesar a página. Com movimento reduzido não toca —
 * fica o pôster. Sem hover (toque), fica a primeira face.
 */
export default function CardFaces({
  cover,
  logo,
  logoDark,
  media,
  sizes,
  pending,
}: {
  cover?: string;
  logo?: string;
  logoDark?: string;
  media?: Media;
  sizes: string;
  pending: string;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const second: Media | undefined = media ?? (logo && cover ? { kind: "image", src: cover } : undefined);

  const play = () => {
    const v = video.current;
    if (!v || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    v.play().catch(() => {});
  };
  const stop = () => {
    const v = video.current;
    if (!v) return;
    v.pause();
    v.currentTime = 0;
  };

  return (
    <span className="absolute inset-0 block" onMouseEnter={play} onMouseLeave={stop} onFocus={play} onBlur={stop}>
      {/* 1ª face */}
      {logo ? (
        <span className="absolute inset-0 flex items-center justify-center bg-[var(--plate)] p-[14%]">
          <span className={`relative block h-full w-full ${logoDark ? "[:root[data-theme=dark]_&]:hidden" : ""}`}>
            <Image src={logo} alt="" fill sizes="30vw" unoptimized={logo.endsWith(".svg")} className="object-contain" />
          </span>
          {logoDark && (
            <span className="relative hidden h-full w-full [:root[data-theme=dark]_&]:block">
              <Image src={logoDark} alt="" fill sizes="30vw" unoptimized={logoDark.endsWith(".svg")} className="object-contain" />
            </span>
          )}
        </span>
      ) : cover ? (
        <Image src={cover} alt="" fill sizes={sizes} className="object-cover object-top" />
      ) : (
        <span
          className="absolute inset-0 grid place-items-center"
          style={{ backgroundImage: "repeating-linear-gradient(45deg, var(--line) 0 1px, transparent 1px 7px)" }}
        >
          <span className="t-small bg-[var(--bg)] px-2 text-faint">{pending}</span>
        </span>
      )}

      {/* 2ª face, no hover */}
      {second && (
        <span className="absolute inset-0 block opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100 group-focus-visible:opacity-100">
          {second.kind === "video" ? (
            <video
              ref={video}
              src={second.src}
              poster={second.poster}
              muted
              loop
              playsInline
              preload="none"
              className="absolute inset-0 h-full w-full object-cover object-top"
            />
          ) : (
            <Image
              src={second.src}
              alt=""
              fill
              sizes={sizes}
              unoptimized={second.src.endsWith(".gif")}
              className="object-cover object-top"
            />
          )}
        </span>
      )}
    </span>
  );
}
