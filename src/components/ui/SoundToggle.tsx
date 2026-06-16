"use client";

import { useSyncExternalStore } from "react";
import { isAudioOn, subscribeAudio, toggleAudio } from "@/lib/audio";

/** Liga/desliga o áudio do site (drone ambiente + trovões do Hero). */
export default function SoundToggle() {
  const on = useSyncExternalStore(subscribeAudio, isAudioOn, () => false);

  return (
    <button
      onClick={() => {
        void toggleAudio();
      }}
      aria-label={on ? "Desligar som ambiente" : "Ligar som ambiente"}
      title="Som ambiente"
      className="fixed bottom-5 left-5 z-[60] grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-gotham/70 text-lg backdrop-blur transition-colors hover:bg-white/10"
    >
      <span aria-hidden>{on ? "🔊" : "🔈"}</span>
    </button>
  );
}
