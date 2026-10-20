"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { useEnable3D } from "@/lib/useEnable3D";
import { useInView } from "@/lib/useInView";

const HeroObject = dynamic(() => import("@/components/three/HeroObject"), {
  ssr: false,
});

/** Decide 3D (desktop, sem reduced-motion) vs fallback estático. */
export default function Hero3DMount() {
  const enabled = useEnable3D();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);

  return (
    <div ref={ref} aria-hidden className="absolute inset-0">
      {enabled ? (
        <HeroObject active={inView} />
      ) : (
        // fallback estático: silhueta do "produto" (LCP-safe, sem JS pesado)
        <div className="flex h-full items-center justify-center">
          <div className="relative h-[68%] w-[52%] rounded-[6px] border border-line bg-raised shadow-2xl shadow-black/40">
            <span className="absolute bottom-6 left-1/2 h-[3px] w-1/2 -translate-x-1/2 bg-accent" />
          </div>
        </div>
      )}
    </div>
  );
}
