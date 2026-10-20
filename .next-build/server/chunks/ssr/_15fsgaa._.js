module.exports=[88788,a=>{"use strict";var b=a.i(32886),c=a.i(87924);a.s(["default",0,function({locale:a,...d}){if(!a)throw Error(void 0);return(0,c.jsx)(b.IntlProvider,{locale:a,...d})}])},91658,a=>{"use strict";var b=a.i(87924),c=a.i(72131),d=a.i(50944);function e(){window.scrollTo(0,0)}let f=`
attribute vec2 a;
void main() { gl_Position = vec4(a, 0.0, 1.0); }
`,g=`
precision mediump float;

uniform vec2  uRes;
uniform float uTime;
uniform float uProgress;    // 0..1 — posi\xe7\xe3o da faixa no eixo de viagem
uniform float uBandTight;   // maior = faixa mais fina
uniform float uPosStart;
uniform float uPosEnd;
uniform float uDirection;   // 0 = horizontal, 1 = vertical
uniform float uWaveAmount;
uniform float uWaveSpeed;
uniform float uVeilMax;     // opacidade m\xe1xima do v\xe9u (o que esconde o swap)
uniform vec3  uBg;          // --bg: o v\xe9u \xe9 a pr\xf3pria superf\xedcie do site
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

  // Borda viva: tr\xeas sen\xf3ides de frequ\xeancias primas entre si, para a
  // ondula\xe7\xe3o n\xe3o repetir num per\xedodo curto e denunciar o truque.
  float wave =
      sin(lat *  6.0 + tw * 1.3) * 0.020
    + sin(lat * 13.0 - tw * 0.9 + 1.4) * 0.012
    + sin(lat * 21.0 + tw * 1.7 + 2.6) * 0.006;
  wave *= uWaveAmount;

  float d    = (axis - pos) - wave;
  float band = exp(-d * d * uBandTight);

  // Normal sintetizada a partir da inclina\xe7\xe3o da faixa, s\xf3 no eixo de viagem.
  // O termo de regra da cadeia no eixo transversal \xe9 ignorado de prop\xf3sito:
  // deixar a ondula\xe7\xe3o vazar para a normal faz o matiz cintilar na frequ\xeancia
  // da onda, o que l\xea como "molhado" em vez de "prensado".
  float dh = -2.0 * d * uBandTight * band;
  vec2 slope = vec2(mix(dh, 0.0, uDirection), mix(0.0, dh, uDirection));
  vec3 N = normalize(vec3(-slope.x * 0.18, slope.y * 0.18, 1.0));

  // Rastro no lado que a faixa j\xe1 passou.
  float trail = pow(clamp(0.5 - d * 1.3, 0.0, 1.0), 2.5) * 0.30;
  float intensity = max(band * 0.95, trail);

  // V\xe9u: sobe e desce ao longo do percurso, cheio atr\xe1s da faixa e parcial \xe0
  // frente. No pico (uProgress 0.5) a viewport inteira est\xe1 coberta — \xe9 nesse
  // instante que a rota troca.
  float arc  = pow(4.0 * uProgress * (1.0 - uProgress), 0.55);
  float lead = smoothstep(0.65, -0.25, d);
  float veil = uVeilMax * arc * mix(0.82, 1.0, lead);

  // A faixa entra e sai em 20% de alpha; cheia no meio. Evita que ela
  // apare\xe7a de uma vez na borda da tela.
  float entry = mix(0.2, 1.0, 4.0 * uProgress * (1.0 - uProgress));

  // Matiz anda com a normal — mesma ideia da iridesc\xeancia do name-drop do iOS,
  // mas a paleta cosseno est\xe1 presa ao vermelho: #2A1414 → #68251E → #A84240.
  float t = N.x * 0.45 + N.y * 0.30 + axis * 1.4 + lat * 0.35 + uTime * 0.04;
  vec3 col = pal(t, uPalA, uPalB, uPalC, uPalD);

  // Luz key fixa, c\xe2mera olhando em +z. Sem c\xe2mera real, o brilho fica est\xe1vel
  // em vez de oscilar com o tamanho da viewport.
  vec3 V = vec3(0.0, 0.0, 1.0);
  vec3 L = normalize(vec3(0.35, 0.55, 0.9));
  vec3 H = normalize(L + V);
  float spec = pow(clamp(dot(N, H), 0.0, 1.0), 80.0);
  float fres = pow(1.0 - clamp(dot(N, V), 0.0, 1.0), 3.0);

  // 1.5% de fade nas bordas transversais — s\xf3 para n\xe3o expor pixel cru.
  float vfade = smoothstep(0.0, 0.015, lat) * smoothstep(1.0, 0.985, lat);

  vec3 rgb = mix(uBg, col, clamp(intensity * 1.15, 0.0, 1.0));
  rgb += uSpec * (spec * 0.85 + fres * 0.06) * band * vfade;

  // Sa\xedda pr\xe9-multiplicada (blend ONE / ONE_MINUS_SRC_ALPHA). Com
  // premultipliedAlpha:false e SRC_ALPHA o backbuffer j\xe1 sai multiplicado e o
  // compositor multiplica de novo — o v\xe9u perde corpo e o swap aparece.
  float alpha = clamp(max(veil, intensity * vfade * entry), 0.0, 1.0);
  gl_FragColor = vec4(rgb * alpha, alpha);
}
`,h=[.41,.17,.17],i=[.25,.09,.09],j=[1,.95,.88],k=[0,.03,.07];function l(a,b){let c=getComputedStyle(document.documentElement).getPropertyValue(a).trim(),d=/^#([0-9a-f]{6})$/i.exec(c);if(!d)return b;let e=parseInt(d[1],16);return[(e>>16&255)/255,(e>>8&255)/255,(255&e)/255]}let m=new class{canvas=null;gl=null;program=null;u={};raf=0;failed=!1;busy=!1;attach(a){this.canvas=a}detach(){cancelAnimationFrame(this.raf),this.raf=0,this.busy=!1;let a=this.gl?.getExtension("WEBGL_lose_context");a?.loseContext(),this.gl=null,this.program=null,this.u={},this.canvas=null}warm(){this.init()}get available(){return!this.failed&&(null!==this.gl||null!==this.canvas)}get running(){return this.busy}init(){if(this.gl)return!0;if(this.failed||!this.canvas)return!1;let a=this.canvas.getContext("webgl",{alpha:!0,premultipliedAlpha:!0,antialias:!1,depth:!1,stencil:!1,powerPreference:"low-power"});if(!a)return this.failed=!0,!1;let b=(b,c)=>{let d=a.createShader(b);return(a.shaderSource(d,c),a.compileShader(d),a.getShaderParameter(d,a.COMPILE_STATUS))?d:(a.deleteShader(d),null)},c=b(a.VERTEX_SHADER,f),d=b(a.FRAGMENT_SHADER,g),e=c&&d?a.createProgram():null;if(!c||!d||!e||(a.attachShader(e,c),a.attachShader(e,d),a.linkProgram(e),!a.getProgramParameter(e,a.LINK_STATUS)))return this.failed=!0,!1;a.deleteShader(c),a.deleteShader(d),a.useProgram(e);let h=a.createBuffer();a.bindBuffer(a.ARRAY_BUFFER,h),a.bufferData(a.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),a.STATIC_DRAW);let i=a.getAttribLocation(e,"a");for(let b of(a.enableVertexAttribArray(i),a.vertexAttribPointer(i,2,a.FLOAT,!1,0,0),["uRes","uTime","uProgress","uBandTight","uPosStart","uPosEnd","uDirection","uWaveAmount","uWaveSpeed","uVeilMax","uBg","uSpec","uPalA","uPalB","uPalC","uPalD"]))this.u[b]=a.getUniformLocation(e,b);return a.enable(a.BLEND),a.blendFunc(a.ONE,a.ONE_MINUS_SRC_ALPHA),this.gl=a,this.program=e,!0}resize(){let a=this.gl,b=this.canvas;if(!a||!b)return;let c=Math.min(window.devicePixelRatio||1,1.5),d=Math.round(window.innerWidth*c),e=Math.round(window.innerHeight*c);(b.width!==d||b.height!==e)&&(b.width=d,b.height=e),a.viewport(0,0,d,e),a.uniform2f(this.u.uRes,d,e)}setConstants(a){let b=this.gl;if(!b)return;let c="y"===a.axis,d=-1===a.direction;b.uniform1f(this.u.uDirection,+!!c),b.uniform1f(this.u.uPosStart,d?1.85:-.85),b.uniform1f(this.u.uPosEnd,d?-.85:1.85),b.uniform1f(this.u.uBandTight,26),b.uniform1f(this.u.uWaveAmount,1),b.uniform1f(this.u.uWaveSpeed,1),b.uniform1f(this.u.uVeilMax,.97),b.uniform3fv(this.u.uBg,l("--bg",[.106,.102,.09])),b.uniform3fv(this.u.uSpec,l("--sweep-spec",[1,.965,.933])),b.uniform3fv(this.u.uPalA,h),b.uniform3fv(this.u.uPalB,i),b.uniform3fv(this.u.uPalC,j),b.uniform3fv(this.u.uPalD,k)}draw(a,b){let c=this.gl;c&&(c.uniform1f(this.u.uProgress,a),c.uniform1f(this.u.uTime,b/1e3),c.clearColor(0,0,0,0),c.clear(c.COLOR_BUFFER_BIT),c.drawArrays(c.TRIANGLES,0,3))}travel(a,b){return new Promise(c=>{let d=0,e=a,f=!1,g=!1,h=!1,i=j=>{let k,l=Math.min(j-e,250);e=j,d=Math.min(d+l/1080,1),this.draw((k=d)*k*(3-2*k),j-a),!f&&d>=.38&&(f=!0,Promise.resolve(b.onCover()).then(()=>{h=!0})),f&&!g&&d>=.68&&(h||d>=.9)&&(g=!0,b.onUncover()),d<1?this.raf=requestAnimationFrame(i):(f&&!g&&b.onUncover(),c())};this.raf=requestAnimationFrame(i)})}async play(a,b){if(this.busy||!this.init()||!this.canvas){await b.onCover(),b.onUncover();return}this.busy=!0;let c=this.canvas;c.style.display="block",this.resize(),this.setConstants(a);let d=performance.now();try{await this.travel(d,b)}finally{b.onUncover(),cancelAnimationFrame(this.raf),this.raf=0;let a=this.gl;a&&(a.clearColor(0,0,0,0),a.clear(a.COLOR_BUFFER_BIT)),c.style.display="none",this.busy=!1}}};a.s(["default",0,function(){let a=(0,d.useRouter)(),f=(0,d.usePathname)(),g=(0,c.useRef)(null),h=(0,c.useRef)(!1);(0,c.useEffect)(()=>{let a=g.current;a&&(g.current=null,a())},[f]);let i=(0,c.useCallback)(a=>{a?m.attach(a):m.detach()},[]);return(0,c.useEffect)(()=>{if(window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;let b=()=>m.warm(),c="function"==typeof window.requestIdleCallback?window.requestIdleCallback(b,{timeout:2e3}):window.setTimeout(b,1200);h.current=!0;let d=()=>document.documentElement.removeAttribute("data-sweeping"),f=b=>{let c;if(!h.current||!m.available||m.running||b.defaultPrevented||0!==b.button||b.metaKey||b.ctrlKey||b.shiftKey||b.altKey)return;let f=b.target?.closest?.("a");if(!(f instanceof HTMLAnchorElement)||f.target&&"_self"!==f.target||f.hasAttribute("download")||void 0!==f.dataset.noSweep)return;let i=f.getAttribute("href");if(!(!i||i.startsWith("#"))){try{c=new URL(f.href,window.location.href)}catch{return}if(c.origin===window.location.origin&&(c.pathname!==window.location.pathname||c.search!==window.location.search)){let f;b.preventDefault(),f=c.pathname+c.search+c.hash,m.play({direction:1},{onCover:async()=>{document.documentElement.setAttribute("data-sweeping","");let b=new Promise(a=>{g.current?.(),g.current=a});a.push(f),e(),await b,e()},onUncover:d})}}},i=()=>{h.current&&m.available&&!m.running&&m.play({direction:-1},{onCover:async()=>{},onUncover:()=>{}})};return document.addEventListener("click",f,!0),window.addEventListener("popstate",i),()=>{h.current=!1,document.removeEventListener("click",f,!0),window.removeEventListener("popstate",i),"function"==typeof window.cancelIdleCallback?window.cancelIdleCallback(c):window.clearTimeout(c)}},[a]),(0,b.jsx)("canvas",{ref:i,"aria-hidden":!0,className:"pointer-events-none fixed inset-0 z-[80] h-full w-full",style:{display:"none"}})}],91658)},77190,a=>{"use strict";var b=a.i(87924),c=a.i(72131);let d=()=>"dark"===document.documentElement.dataset.theme?"dark":"light";function e(a){let b=new MutationObserver(a);return b.observe(document.documentElement,{attributes:!0,attributeFilter:["data-theme"]}),()=>b.disconnect()}function f(){return(0,b.jsxs)("svg",{viewBox:"0 0 16 16",className:"h-[14px] w-[14px]",fill:"none",stroke:"currentColor",strokeWidth:1.3,"aria-hidden":!0,children:[(0,b.jsx)("circle",{cx:8,cy:8,r:3}),[0,45,90,135,180,225,270,315].map(a=>(0,b.jsx)("line",{x1:8,y1:1.5,x2:8,y2:3.2,transform:`rotate(${a} 8 8)`,strokeLinecap:"round"},a))]})}function g(){return(0,b.jsx)("svg",{viewBox:"0 0 16 16",className:"h-[14px] w-[14px]",fill:"none",stroke:"currentColor",strokeWidth:1.3,"aria-hidden":!0,children:(0,b.jsx)("path",{d:"M13 9.5A5.5 5.5 0 1 1 6.5 3a4.5 4.5 0 0 0 6.5 6.5Z",strokeLinejoin:"round"})})}a.s(["THEME_SCRIPT",0,'(function(){try{var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";document.documentElement.dataset.theme=t}catch(e){}})()',"default",0,function({labels:a}){let h="dark"===(0,c.useSyncExternalStore)(e,d,()=>"light");return(0,b.jsxs)("button",{type:"button",role:"switch","aria-checked":h,"aria-label":a.aria,onClick:()=>(function(a){let b=document.documentElement;b.setAttribute("data-theme-switching",""),b.setAttribute("data-theme",a);try{localStorage.setItem("theme",a)}catch{}requestAnimationFrame(()=>requestAnimationFrame(()=>b.removeAttribute("data-theme-switching")))})(h?"light":"dark"),className:"group flex items-center gap-2",children:[(0,b.jsx)("span",{className:h?"text-faint group-hover:text-fg":"text-fg",children:(0,b.jsx)(f,{})}),(0,b.jsx)("span",{className:"relative block h-[16px] w-[30px] border-[1.25px] border-fg",children:(0,b.jsx)("span",{className:"absolute top-[2px] block h-[9px] w-[9px] bg-accent transition-[left] duration-300",style:{left:h?16:2}})}),(0,b.jsx)("span",{className:h?"text-fg":"text-faint group-hover:text-fg",children:(0,b.jsx)(g,{})}),(0,b.jsx)("span",{className:"hidden min-w-[3.2em] text-left lg:inline",children:h?a.dark:a.light})]})}])},60783,a=>{"use strict";var b=a.i(87924),c=a.i(72131),d=a.i(32886);function e(a,b){return(...a)=>{try{return b(...a)}catch{throw Error(void 0)}}}let f=e(0,d.useTranslations);e(0,d.useFormatter);var g=a.i(55027),h=a.i(33403),i=a.i(95140),j=a.i(77190);let k=[{href:"/",key:"work"},{href:"/projects",key:"projects"},{href:"/about",key:"about"},{href:"/resume",key:"resume"},{href:"/contact",key:"contact"}];a.s(["default",0,function(){let a=f("nav"),e=(0,g.usePathname)(),l=(0,d.useLocale)(),m=(0,g.useRouter)(),[n,o]=(0,c.useState)(!1),p=a=>"/"===a?"/"===e||e.startsWith("/work"):e===a||e.startsWith(`${a}/`);(0,c.useEffect)(()=>{let a=a=>"Escape"===a.key&&o(!1);return window.addEventListener("keydown",a),()=>window.removeEventListener("keydown",a)},[]);let q=(0,b.jsx)("span",{className:"flex items-center gap-1.5",role:"group","aria-label":a("language"),children:h.routing.locales.map((a,c)=>(0,b.jsxs)("span",{className:"flex items-center gap-1.5",children:[c>0&&(0,b.jsx)("span",{"aria-hidden":!0,className:"text-faint",children:"/"}),(0,b.jsx)("button",{type:"button",lang:a,onClick:()=>m.replace(e,{locale:a}),"aria-pressed":a===l,className:a===l?"text-fg":"text-faint hover:text-fg",children:a.toUpperCase()})]},a))}),r=(0,b.jsx)(j.default,{labels:{light:a("light"),dark:a("dark"),aria:a("theme")}});return(0,b.jsxs)("header",{className:"sheet-head t-small",children:[(0,b.jsxs)(g.Link,{href:"/",className:"truncate",onClick:()=>o(!1),children:[(0,b.jsx)("span",{className:"sm:hidden",children:"J.P. Gaspar"}),(0,b.jsx)("span",{className:"hidden sm:inline",children:i.siteConfig.name})]}),(0,b.jsxs)("nav",{className:"hidden items-center gap-7 md:flex","aria-label":a("aria"),children:[k.map(c=>(0,b.jsx)(g.Link,{href:c.href,className:"nav-link","aria-current":p(c.href)?"page":void 0,children:a(c.key)},c.href)),(0,b.jsx)("span",{"aria-hidden":!0,className:"h-4 w-px bg-line"}),r,q]}),(0,b.jsxs)("div",{className:"flex items-center gap-4 md:hidden",children:[r,(0,b.jsx)("button",{type:"button","aria-expanded":n,"aria-controls":"sheet-menu",onClick:()=>o(a=>!a),className:"border border-fg px-2 py-1",children:n?a("close"):a("menu")})]}),n&&(0,b.jsxs)("nav",{id:"sheet-menu","aria-label":a("aria"),className:"absolute top-full right-0 left-0 flex flex-col gap-4 border-b border-fg bg-[var(--bg)] px-[var(--gut)] py-6 md:hidden",children:[k.map(c=>(0,b.jsx)(g.Link,{href:c.href,onClick:()=>o(!1),"aria-current":p(c.href)?"page":void 0,className:"t-title",children:a(c.key)},c.href)),(0,b.jsx)("div",{className:"pt-2",children:q})]})]})}],60783)},11593,a=>{"use strict";var b=a.i(87924),c=a.i(72131);let d=["A","B","C","D","E","F"];a.s(["default",0,function(){let a=(0,c.useRef)(null);return(0,c.useEffect)(()=>{if(!window.matchMedia("(hover: hover) and (pointer: fine)").matches)return;let b=document.documentElement;b.classList.add("has-sheet-cursor");let c=-100,e=-100,f=0,g=a.current,h=g.querySelector("[data-zone]"),i=g.querySelector("[data-label]"),j=()=>{f=0,g.style.transform=`translate3d(${c}px, ${e}px, 0)`;let a=Math.min(8,Math.floor(c/window.innerWidth*8)+1),b=d[Math.min(5,Math.floor(e/window.innerHeight*6))];h.textContent=`${b}\xb7${a}`},k=a=>{c=a.clientX,e=a.clientY,g.style.opacity="1";let b=a.target,d=b?.closest("input, textarea, select, [contenteditable]"),h=b?.closest("a, button, [role=button], [role=switch], label, [data-cursor]");g.dataset.mode=d?"text":h?"hit":"idle",i.textContent=h?.dataset.cursor??"",f||(f=requestAnimationFrame(j))},l=()=>g.style.opacity="0",m=()=>g.setAttribute("data-down",""),n=()=>g.removeAttribute("data-down");return window.addEventListener("pointermove",k,{passive:!0}),document.addEventListener("pointerleave",l),window.addEventListener("pointerdown",m),window.addEventListener("pointerup",n),()=>{b.classList.remove("has-sheet-cursor"),window.removeEventListener("pointermove",k),document.removeEventListener("pointerleave",l),window.removeEventListener("pointerdown",m),window.removeEventListener("pointerup",n),cancelAnimationFrame(f)}},[]),(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)("style",{children:`
          html.has-sheet-cursor, html.has-sheet-cursor * { cursor: none !important; }
          html.has-sheet-cursor :is(input, textarea, select, [contenteditable]) { cursor: text !important; }
          .sheet-cursor { position: fixed; left: 0; top: 0; z-index: 100; pointer-events: none; opacity: 0; mix-blend-mode: difference; color: #fff; }
          .sheet-cursor .h, .sheet-cursor .v { position: absolute; background: currentColor; transition: opacity 200ms, transform 300ms cubic-bezier(0.16,1,0.3,1); }
          .sheet-cursor .h { left: -11px; top: -0.5px; width: 22px; height: 1px; }
          .sheet-cursor .v { top: -11px; left: -0.5px; width: 1px; height: 22px; }
          .sheet-cursor .gap { position: absolute; left: -2.5px; top: -2.5px; width: 5px; height: 5px; background: #000; mix-blend-mode: normal; }
          .sheet-cursor .ring { position: absolute; left: -16px; top: -16px; width: 32px; height: 32px; border: 1px solid currentColor; border-radius: 50%; transform: scale(0.3); opacity: 0; transition: transform 320ms cubic-bezier(0.16,1,0.3,1), opacity 200ms; }
          .sheet-cursor .z { position: absolute; left: 10px; top: 10px; font: 500 10px/1 var(--ff-mono), ui-monospace, monospace; letter-spacing: 0.04em; white-space: nowrap; transition: opacity 200ms; }
          .sheet-cursor .lbl { position: absolute; left: 22px; top: -6px; font: 600 11px/1 var(--ff-sans), system-ui, sans-serif; white-space: nowrap; opacity: 0; transform: translateX(-4px); transition: opacity 220ms, transform 320ms cubic-bezier(0.16,1,0.3,1); }
          .sheet-cursor[data-mode="hit"] .ring { transform: scale(1); opacity: 1; }
          .sheet-cursor[data-mode="hit"] .h, .sheet-cursor[data-mode="hit"] .v { opacity: 0.5; transform: scale(0.45); }
          .sheet-cursor[data-mode="hit"] .z { opacity: 0; }
          .sheet-cursor[data-mode="hit"] .lbl:not(:empty) { opacity: 1; transform: none; }
          .sheet-cursor[data-mode="text"] { opacity: 0 !important; }
          .sheet-cursor[data-down] .ring { transform: scale(0.8); }
          @media (prefers-reduced-motion: reduce) { .sheet-cursor * { transition: none !important; } }
          html:not(.has-sheet-cursor) .sheet-cursor { display: none; }
        `}),(0,b.jsxs)("div",{ref:a,className:"sheet-cursor","aria-hidden":!0,"data-mode":"idle",children:[(0,b.jsx)("span",{className:"h"}),(0,b.jsx)("span",{className:"v"}),(0,b.jsx)("span",{className:"ring"}),(0,b.jsx)("span",{className:"z","data-zone":!0}),(0,b.jsx)("span",{className:"lbl","data-label":!0})]})]})}])}];

//# sourceMappingURL=_15fsgaa._.js.map