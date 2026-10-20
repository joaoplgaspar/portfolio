"use client";

import { useClock } from "@/lib/telemetry";

/** Hora de São Paulo ao vivo. Antes da hidratação, só o fuso. */
export default function LocalTime() {
  const time = useClock();
  return (
    <span className="tabular-nums" suppressHydrationWarning>
      {time ? time.slice(0, 5) : "—"} <span className="text-faint">UTC−3</span>
    </span>
  );
}
