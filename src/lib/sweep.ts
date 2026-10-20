/**
 * Sweep — faixa iridescente oxblood que atravessa a viewport na troca de rota.
 *
 * Um quad em clip space + um fragment shader. Sem three.js, sem geometria:
 * ~60 linhas de GLSL e dois triângulos. O véu que viaja junto com a faixa é o
 * que faz a transição funcionar — a rota troca com a tela coberta, então não se
 * vê a página nova "aparecer". Sem véu isso seria só um enfeite por cima de um
 * corte visível.
 *
 * Mecanismo (ver docs/teardown-xiangyidesign.md): faixa gaussiana cuja
 * inclinação analítica vira uma normal sintética; o matiz anda com essa normal
 * sobre uma paleta cosseno (Inigo Quilez) presa ao vermelho da marca — oxblood
 * → cobre, nunca arco-íris.
 */

const VERT = `
attribute vec2 a;
void main() { gl_Position = vec4(a, 0.0, 1.0); }
`;

const FRAG = `
precision mediump float;

uniform vec2  uRes;
uniform float uTime;
uniform float uProgress;    // 0..1 — posição da faixa no eixo de viagem
uniform float uBandTight;   // maior = faixa mais fina
uniform float uPosStart;
uniform float uPosEnd;
uniform float uDirection;   // 0 = horizontal, 1 = vertical
uniform float uWaveAmount;
uniform float uWaveSpeed;
uniform float uVeilMax;     // opacidade máxima do véu (o que esconde o swap)
uniform vec3  uBg;          // --bg: o véu é a própria superfície do site
uniform vec3  uSpec;        // --sweep-spec: brilho quente, nunca branco puro
uniform vec3  uPalA, uPalB, uPalC, uPalD;

#define PI 3.14159265359

vec3 pal(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
  return a + b * cos(2.0 * PI * (c * t + d));
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  float axis = mix(uv.x, uv.y, uDirection);
  float lat  = mix(uv.y, uv.x, uDirection);   // eixo transversal

  float pos = uPosStart + uProgress * (uPosEnd - uPosStart);
  float tw  = uTime * uWaveSpeed;

  // Borda viva: três senóides de frequências primas entre si, para a
  // ondulação não repetir num período curto e denunciar o truque.
  float wave =
      sin(lat *  6.0 + tw * 1.3) * 0.020
    + sin(lat * 13.0 - tw * 0.9 + 1.4) * 0.012
    + sin(lat * 21.0 + tw * 1.7 + 2.6) * 0.006;
  wave *= uWaveAmount;

  float d    = (axis - pos) - wave;
  float band = exp(-d * d * uBandTight);

  // Normal sintetizada a partir da inclinação da faixa, só no eixo de viagem.
  // O termo de regra da cadeia no eixo transversal é ignorado de propósito:
  // deixar a ondulação vazar para a normal faz o matiz cintilar na frequência
  // da onda, o que lê como "molhado" em vez de "prensado".
  float dh = -2.0 * d * uBandTight * band;
  vec2 slope = vec2(mix(dh, 0.0, uDirection), mix(0.0, dh, uDirection));
  vec3 N = normalize(vec3(-slope.x * 0.18, slope.y * 0.18, 1.0));

  // Rastro no lado que a faixa já passou.
  float trail = pow(clamp(0.5 - d * 1.3, 0.0, 1.0), 2.5) * 0.30;
  float intensity = max(band * 0.95, trail);

  // Véu: sobe e desce ao longo do percurso, cheio atrás da faixa e parcial à
  // frente. No pico (uProgress 0.5) a viewport inteira está coberta — é nesse
  // instante que a rota troca.
  float arc  = pow(4.0 * uProgress * (1.0 - uProgress), 0.55);
  float lead = smoothstep(0.65, -0.25, d);
  float veil = uVeilMax * arc * mix(0.82, 1.0, lead);

  // A faixa entra e sai em 20% de alpha; cheia no meio. Evita que ela
  // apareça de uma vez na borda da tela.
  float entry = mix(0.2, 1.0, 4.0 * uProgress * (1.0 - uProgress));

  // Matiz anda com a normal — mesma ideia da iridescência do name-drop do iOS,
  // mas a paleta cosseno está presa ao vermelho: #2A1414 → #68251E → #A84240.
  float t = N.x * 0.45 + N.y * 0.30 + axis * 1.4 + lat * 0.35 + uTime * 0.04;
  vec3 col = pal(t, uPalA, uPalB, uPalC, uPalD);

  // Luz key fixa, câmera olhando em +z. Sem câmera real, o brilho fica estável
  // em vez de oscilar com o tamanho da viewport.
  vec3 V = vec3(0.0, 0.0, 1.0);
  vec3 L = normalize(vec3(0.35, 0.55, 0.9));
  vec3 H = normalize(L + V);
  float spec = pow(clamp(dot(N, H), 0.0, 1.0), 80.0);
  float fres = pow(1.0 - clamp(dot(N, V), 0.0, 1.0), 3.0);

  // 1.5% de fade nas bordas transversais — só para não expor pixel cru.
  float vfade = smoothstep(0.0, 0.015, lat) * smoothstep(1.0, 0.985, lat);

  vec3 rgb = mix(uBg, col, clamp(intensity * 1.15, 0.0, 1.0));
  rgb += uSpec * (spec * 0.85 + fres * 0.06) * band * vfade;

  // Saída pré-multiplicada (blend ONE / ONE_MINUS_SRC_ALPHA). Com
  // premultipliedAlpha:false e SRC_ALPHA o backbuffer já sai multiplicado e o
  // compositor multiplica de novo — o véu perde corpo e o swap aparece.
  float alpha = clamp(max(veil, intensity * vfade * entry), 0.0, 1.0);
  gl_FragColor = vec4(rgb * alpha, alpha);
}
`;

/** Paleta cosseno em sRGB: oscila #A84240 (accent-lift) → #68251E → #2A1414. */
const PAL = {
  a: [0.41, 0.17, 0.17],
  b: [0.25, 0.09, 0.09],
  c: [1.0, 0.95, 0.88],
  d: [0.0, 0.03, 0.07],
} as const;

/**
 * Ritmo. A faixa anda em **ritmo constante, sempre** — nunca para, nunca
 * desacelera. As duas primeiras versões tentaram encaixar a espera pela rota
 * dentro do movimento (congelando, depois desacelerando) e as duas liam como
 * travamento: qualquer variação de velocidade no meio do percurso denuncia que
 * o site está esperando alguma coisa.
 *
 * A espera saiu do movimento e foi para a **visibilidade**. Entre `COVER_AT` e
 * `UNCOVER_AT` o conteúdo é apagado (o véu já está em ~93% ali, então o degrau
 * não aparece) e o commit do React pode cair a qualquer momento dessa janela
 * sem ser visto. Se a rota demorar mais que a janela, o conteúdo só espera mais
 * um pouco para reaparecer — até `UNCOVER_HARD`. A faixa não fica sabendo.
 */
const TRAVEL = 1080; // percurso inteiro, invariável
const COVER_AT = 0.38; // apaga o conteúdo e dispara a navegação (véu ~93%)
const UNCOVER_AT = 0.68; // devolve o conteúdo (véu ~93% do outro lado)
const UNCOVER_HARD = 0.9; // devolve mesmo sem commit, para não sumir com a página

type Rgb = [number, number, number];

function readColor(name: string, fallback: Rgb): Rgb {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const hex = /^#([0-9a-f]{6})$/i.exec(raw);
  if (!hex) return fallback;
  const n = parseInt(hex[1], 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

const smoothstep01 = (t: number) => t * t * (3 - 2 * t);

export type SweepAxis = "x" | "y";

/**
 * `onCover`: o conteúdo acabou de ser apagado — hora de navegar. Resolve
 * quando a rota nova commitou. `onUncover`: pode devolver o conteúdo.
 */
export type SweepHooks = {
  onCover: () => Promise<unknown>;
  onUncover: () => void;
};

export type SweepOptions = {
  /** 1 = esquerda→direita (ou cima→baixo); -1 = o inverso (voltar). */
  direction?: 1 | -1;
  axis?: SweepAxis;
};

class SweepRenderer {
  private canvas: HTMLCanvasElement | null = null;
  private gl: WebGLRenderingContext | null = null;
  private program: WebGLProgram | null = null;
  private u: Record<string, WebGLUniformLocation | null> = {};
  private raf = 0;
  private failed = false;
  private busy = false;

  attach(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }

  detach() {
    cancelAnimationFrame(this.raf);
    this.raf = 0;
    this.busy = false;
    const ext = this.gl?.getExtension("WEBGL_lose_context");
    ext?.loseContext();
    this.gl = null;
    this.program = null;
    this.u = {};
    this.canvas = null;
  }

  /** Compila fora do caminho crítico para a primeira transição não engasgar. */
  warm() {
    this.init();
  }

  get available() {
    return !this.failed && (this.gl !== null || this.canvas !== null);
  }

  get running() {
    return this.busy;
  }

  private init(): boolean {
    if (this.gl) return true;
    if (this.failed || !this.canvas) return false;

    const gl = this.canvas.getContext("webgl", {
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "low-power",
    });
    if (!gl) {
      this.failed = true;
      return false;
    }

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        gl.deleteShader(s);
        return null;
      }
      return s;
    };

    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    const program = vs && fs ? gl.createProgram() : null;
    if (!vs || !fs || !program) {
      this.failed = true;
      return false;
    }
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      this.failed = true;
      return false;
    }
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    gl.useProgram(program);

    // Dois triângulos cobrindo o clip space inteiro.
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    const loc = gl.getAttribLocation(program, "a");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    for (const name of [
      "uRes",
      "uTime",
      "uProgress",
      "uBandTight",
      "uPosStart",
      "uPosEnd",
      "uDirection",
      "uWaveAmount",
      "uWaveSpeed",
      "uVeilMax",
      "uBg",
      "uSpec",
      "uPalA",
      "uPalB",
      "uPalC",
      "uPalD",
    ]) {
      this.u[name] = gl.getUniformLocation(program, name);
    }

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    this.gl = gl;
    this.program = program;
    return true;
  }

  private resize() {
    const gl = this.gl;
    const canvas = this.canvas;
    if (!gl || !canvas) return;
    // DPR travado em 1.5: é um gradiente suave, 2x não muda nada visível e
    // dobra o custo de fill numa tela 4K.
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const w = Math.round(window.innerWidth * dpr);
    const h = Math.round(window.innerHeight * dpr);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    gl.viewport(0, 0, w, h);
    gl.uniform2f(this.u.uRes, w, h);
  }

  private setConstants(opts: SweepOptions) {
    const gl = this.gl;
    if (!gl) return;
    const axisVertical = opts.axis === "y";
    const back = opts.direction === -1;

    gl.uniform1f(this.u.uDirection, axisVertical ? 1 : 0);
    // A faixa nasce e morre fora da tela (|pos| ≥ 0.85) para o véu nunca
    // piscar nas bordas no primeiro e no último frame.
    gl.uniform1f(this.u.uPosStart, back ? 1.85 : -0.85);
    gl.uniform1f(this.u.uPosEnd, back ? -0.85 : 1.85);
    gl.uniform1f(this.u.uBandTight, 26);
    gl.uniform1f(this.u.uWaveAmount, 1);
    gl.uniform1f(this.u.uWaveSpeed, 1);
    gl.uniform1f(this.u.uVeilMax, 0.97);
    gl.uniform3fv(this.u.uBg, readColor("--bg", [0.106, 0.102, 0.09]));
    gl.uniform3fv(this.u.uSpec, readColor("--sweep-spec", [1.0, 0.965, 0.933]));
    const pal = PAL;
    gl.uniform3fv(this.u.uPalA, pal.a as unknown as number[]);
    gl.uniform3fv(this.u.uPalB, pal.b as unknown as number[]);
    gl.uniform3fv(this.u.uPalC, pal.c as unknown as number[]);
    gl.uniform3fv(this.u.uPalD, pal.d as unknown as number[]);
  }

  private draw(progress: number, timeMs: number) {
    const gl = this.gl;
    if (!gl) return;
    gl.uniform1f(this.u.uProgress, progress);
    gl.uniform1f(this.u.uTime, timeMs / 1000);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  /**
   * Percurso de ritmo constante. `u` é o relógio linear (0..1) e a posição da
   * faixa é `smoothstep(u)` — entra e sai suave, cruza rápido. Nada nesta
   * função espera por nada: as callbacks disparam em pontos fixos do relógio.
   */
  private travel(t0: number, hooks: SweepHooks) {
    return new Promise<void>((resolve) => {
      let u = 0;
      let last = t0;
      let covered = false;
      let uncovered = false;
      let committed = false;

      const step = (now: number) => {
        // Teto só para o caso patológico (aba em segundo plano volta ao
        // primeiro plano e entrega um frame com segundos de intervalo). Um
        // teto baixo demais — 64 ms, por exemplo — faz o relógio perder tempo
        // sempre que a main thread trava, e o percurso estica no relógio de
        // parede justamente quando a rota é pesada.
        const dt = Math.min(now - last, 250);
        last = now;

        u = Math.min(u + dt / TRAVEL, 1);
        this.draw(smoothstep01(u), now - t0);

        if (!covered && u >= COVER_AT) {
          covered = true;
          void Promise.resolve(hooks.onCover()).then(() => {
            committed = true;
          });
        }
        // Devolve o conteúdo assim que a rota commitou, ou no teto — o que
        // vier depois. A faixa segue no mesmo ritmo nos dois casos.
        if (covered && !uncovered && u >= UNCOVER_AT && (committed || u >= UNCOVER_HARD)) {
          uncovered = true;
          hooks.onUncover();
        }

        if (u < 1) {
          this.raf = requestAnimationFrame(step);
        } else {
          if (covered && !uncovered) hooks.onUncover();
          resolve();
        }
      };
      this.raf = requestAnimationFrame(step);
    });
  }

  /**
   * Atravessa a viewport trocando a rota por baixo do véu. Resolve quando a
   * faixa já saiu — mesmo que a rota ainda não tenha commitado.
   */
  async play(opts: SweepOptions, hooks: SweepHooks) {
    if (this.busy || !this.init() || !this.canvas) {
      await hooks.onCover();
      hooks.onUncover();
      return;
    }
    this.busy = true;
    const canvas = this.canvas;
    canvas.style.display = "block";
    this.resize();
    this.setConstants(opts);

    const t0 = performance.now();
    try {
      await this.travel(t0, hooks);
    } finally {
      // Rede de segurança: se o percurso falhar no meio, o conteúdo não pode
      // ficar apagado. `onUncover` é idempotente.
      hooks.onUncover();
      cancelAnimationFrame(this.raf);
      this.raf = 0;
      const gl = this.gl;
      if (gl) {
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
      }
      canvas.style.display = "none";
      this.busy = false;
    }
  }
}

export const sweep = new SweepRenderer();
