"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

/** Preloader temático: "iniciando transmissão" em Gotham, some quando a página carrega. */
export default function Preloader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let hideTimer: ReturnType<typeof setTimeout>;
    const finish = () => {
      hideTimer = setTimeout(() => setVisible(false), 1300);
    };
    if (document.readyState === "complete") {
      finish();
    } else {
      window.addEventListener("load", finish, { once: true });
    }
    const fallback = setTimeout(() => setVisible(false), 3200);
    return () => {
      clearTimeout(hideTimer);
      clearTimeout(fallback);
      window.removeEventListener("load", finish);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gotham"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            className="anim-signal text-6xl"
            style={{ filter: "drop-shadow(0 0 24px rgba(255,210,63,0.6))" }}
          >
            🦇
          </div>
          <div className="mt-8 h-[3px] w-48 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full"
              style={{ background: "var(--color-bat)" }}
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
            />
          </div>
          <div className="mt-4 font-mono text-xs uppercase tracking-[0.3em] text-ink/50">
            iniciando transmissão
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
