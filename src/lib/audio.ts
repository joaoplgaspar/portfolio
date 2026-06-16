/**
 * Áudio do site, centralizado num singleton (Web Audio API, sem assets).
 * - drone ambiente grave (liga/desliga pelo SoundToggle)
 * - thunder(): estrondo sincronizado com os relâmpagos do Hero
 *
 * Nada toca sem o usuário ligar o som (respeita o autoplay dos browsers).
 */
let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let enabled = false;
const listeners = new Set<(on: boolean) => void>();

function ensure(): AudioContext {
  if (ctx) return ctx;
  const c = new AudioContext();
  const m = c.createGain();
  m.gain.value = 0;
  m.connect(c.destination);

  const filter = c.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 600;
  filter.Q.value = 5;
  filter.connect(m);

  for (const f of [55, 82.41, 110, 164.81]) {
    const o = c.createOscillator();
    o.type = "sine";
    o.frequency.value = f;
    const g = c.createGain();
    g.gain.value = 0.22;
    o.connect(g).connect(filter);
    o.start();
  }

  const lfo = c.createOscillator();
  lfo.frequency.value = 0.07;
  const lg = c.createGain();
  lg.gain.value = 280;
  lfo.connect(lg).connect(filter.frequency);
  lfo.start();

  ctx = c;
  master = m;
  return c;
}

export function isAudioOn(): boolean {
  return enabled;
}

export function subscribeAudio(cb: (on: boolean) => void): () => void {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export async function toggleAudio(): Promise<void> {
  const c = ensure();
  await c.resume();
  enabled = !enabled;
  if (master) {
    const now = c.currentTime;
    master.gain.cancelScheduledValues(now);
    master.gain.setTargetAtTime(enabled ? 0.05 : 0, now, enabled ? 0.8 : 0.4);
  }
  for (const l of listeners) l(enabled);
}

/** Estrondo de trovão (ruído filtrado com queda de graves). Só soa se o som estiver ligado. */
export function thunder(): void {
  if (!enabled || !ctx) return;
  const c = ctx;
  const now = c.currentTime;
  const dur = 1.7;

  const buffer = c.createBuffer(1, Math.floor(c.sampleRate * dur), c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;

  const noise = c.createBufferSource();
  noise.buffer = buffer;

  const lp = c.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.setValueAtTime(900, now);
  lp.frequency.exponentialRampToValueAtTime(110, now + dur);

  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, now);
  g.gain.linearRampToValueAtTime(0.5, now + 0.06);
  g.gain.exponentialRampToValueAtTime(0.0001, now + dur);

  noise.connect(lp).connect(g).connect(c.destination);
  noise.start(now);
  noise.stop(now + dur);
}
