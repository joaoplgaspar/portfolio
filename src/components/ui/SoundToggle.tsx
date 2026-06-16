"use client";

import { useRef, useState } from "react";

/**
 * Trilha sonora ambiente sintetizada na hora (Web Audio API), sem nenhum asset.
 * Um drone grave e cinematográfico, bem sutil. Começa desligado (políticas de autoplay).
 */
export default function SoundToggle() {
  const [on, setOn] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);

  function build(ctx: AudioContext) {
    const master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 600;
    filter.Q.value = 5;
    filter.connect(master);

    // acorde grave (A1, E2, A2, E3)
    for (const f of [55, 82.41, 110, 164.81]) {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = f;
      const g = ctx.createGain();
      g.gain.value = 0.22;
      osc.connect(g).connect(filter);
      osc.start();
    }

    // LFO lento no cutoff = movimento "respirando"
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.07;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 280;
    lfo.connect(lfoGain).connect(filter.frequency);
    lfo.start();

    masterRef.current = master;
  }

  async function toggle() {
    let ctx = ctxRef.current;
    if (!ctx) {
      ctx = new AudioContext();
      ctxRef.current = ctx;
      build(ctx);
    }
    await ctx.resume();
    const master = masterRef.current;
    if (!master) return;
    const now = ctx.currentTime;
    master.gain.cancelScheduledValues(now);
    master.gain.setTargetAtTime(on ? 0 : 0.05, now, on ? 0.4 : 0.8);
    setOn(!on);
  }

  return (
    <button
      onClick={toggle}
      aria-label={on ? "Desligar som ambiente" : "Ligar som ambiente"}
      title="Som ambiente"
      className="fixed bottom-5 left-5 z-[60] grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-gotham/70 text-lg backdrop-blur transition-colors hover:bg-white/10"
    >
      <span aria-hidden>{on ? "🔊" : "🔈"}</span>
    </button>
  );
}
