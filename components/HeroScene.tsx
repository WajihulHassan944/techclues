"use client";

import { useEffect, useRef } from "react";

const VERT = `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`;

/**
 * Animates the hero photograph itself: a WebGL shader flows and shimmers the glowing
 * constellation behind the person (the red dress and headset stay steady), twinkles the bright
 * nodes and drifts the whole backdrop with the pointer. three.js is loaded on demand.
 */
const FRAG = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uTex;
uniform float uTime;
uniform vec2 uPtr;
uniform vec2 uRes;
uniform vec2 uImg;
uniform vec2 uPos;

float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float n(vec2 p){
  vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(h(i), h(i + vec2(1, 0)), f.x), mix(h(i + vec2(0, 1)), h(i + vec2(1, 1)), f.x), f.y);
}

void main(){
  // object-fit: cover with object-position, a little over-scaled so edges never show
  float sc = max(uRes.x / uImg.x, uRes.y / uImg.y) * 1.08;
  vec2 size = uImg * sc;
  vec2 off = (uRes - size) * uPos;
  vec2 px = vec2(vUv.x, 1.0 - vUv.y) * uRes;
  vec2 uv = (px - off) / size;
  uv += vec2(sin(uTime * 0.07), cos(uTime * 0.05)) * 0.006;

  // background mask: bright/blue constellation = 1, the person (red, dark) = 0
  vec3 base = texture2D(uTex, uv).rgb;
  float lum = dot(base, vec3(0.299, 0.587, 0.114));
  float blueish = clamp((base.b - base.r * 0.9) * 3.0 + 0.25, 0.0, 1.0);
  float bg = smoothstep(0.02, 0.2, lum) * blueish;

  // slow flowing warp of the constellation, plus a breathing zoom from its bright core
  vec2 c = vec2(0.58, 0.46);
  vec2 d = uv - c;
  float flow = n(uv * 3.0 + vec2(uTime * 0.08, -uTime * 0.06));
  float flow2 = n(uv * 5.0 - vec2(uTime * 0.05, uTime * 0.07));
  vec2 warp = (vec2(flow - 0.5, flow2 - 0.5)) * 0.0045 + d * sin(uTime * 0.45) * 0.006;
  warp += uPtr * -0.006;
  vec3 col = texture2D(uTex, uv + warp * bg).rgb;
  // chromatic split that pulses gently
  float ca = 0.0006 * (1.0 + sin(uTime * 0.6)) * bg;
  col.r = mix(col.r, texture2D(uTex, uv + warp * bg + vec2(ca, 0.0)).r, bg);
  col.b = mix(col.b, texture2D(uTex, uv + warp * bg - vec2(ca, 0.0)).b, bg);

  // twinkle: bright nodes pulse at their own rhythm, plus a soft light sweep across the field
  float l2 = dot(col, vec3(0.299, 0.587, 0.114));
  float cell = n(floor(uv * 260.0) * 0.37 + 11.0);
  float tw = 0.5 + 0.5 * sin(uTime * (1.2 + cell * 2.4) + cell * 40.0);
  float nodes = smoothstep(0.35, 0.9, l2);
  col += col * nodes * tw * 0.55 * bg;
  float sweep = smoothstep(0.0, 0.5, 0.5 - abs(fract(uv.x * 0.8 - uTime * 0.045) - 0.5));
  col += vec3(0.18, 0.22, 0.6) * l2 * sweep * 0.55 * bg;
  // the core glow breathes
  col += vec3(0.5, 0.35, 0.9) * smoothstep(0.55, 0.0, length(d * vec2(1.4, 1.0))) * l2 * (0.18 + 0.14 * sin(uTime * 0.8)) * bg;

  gl_FragColor = vec4(col, 1.0);
}`;

export default function HeroScene() {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    const root = el?.parentElement;
    const sec = root?.parentElement;
    if (!el || !root || !sec) return;
    let disposed = false;
    let cleanup = () => {};

    (async () => {
      const THREE = await import("three");
      if (disposed) return;
      const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
      const small = innerWidth < 760;
      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try {
        renderer = new THREE.WebGLRenderer({ alpha: false, antialias: false, powerPreference: "high-performance" });
      } catch {
        return; // no WebGL: the photo alone still looks fine
      }
      renderer.setPixelRatio(Math.min(devicePixelRatio || 1, small ? 1.25 : 1.6));
      el.appendChild(renderer.domElement);
      renderer.domElement.style.cssText = "position:absolute;inset:0;width:100%;height:100%";

      const tex = await new Promise<InstanceType<typeof THREE.Texture> | null>((res) =>
        new THREE.TextureLoader().load("/images/game/hero.webp", res, undefined, () => res(null)),
      );
      if (disposed || !tex) {
        renderer.dispose();
        return;
      }
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.minFilter = THREE.LinearFilter;
      const img = tex.image as { width: number; height: number };

      const uniforms = {
        uTex: { value: tex },
        uTime: { value: 0 },
        uPtr: { value: new THREE.Vector2() },
        uRes: { value: new THREE.Vector2(1, 1) },
        uImg: { value: new THREE.Vector2(img.width, img.height) },
        uPos: { value: new THREE.Vector2(0.6, 0.38) },
      };
      const scene = new THREE.Scene();
      const camera = new THREE.Camera();
      const mat = new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, uniforms });
      scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat));

      const size = () => {
        const w = el.clientWidth || 1, hh = el.clientHeight || 1;
        renderer.setSize(w, hh, false);
        uniforms.uRes.value.set(w, hh);
        uniforms.uPos.value.set(innerWidth < 640 ? 0.62 : 0.6, 0.38);
      };
      size();
      const ro = new ResizeObserver(size);
      ro.observe(el);

      let tx = 0, ty = 0, visible = true, raf = 0;
      const move = (e: PointerEvent) => {
        const r = sec.getBoundingClientRect();
        tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
        ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
      };
      if (!reduce) sec.addEventListener("pointermove", move);
      const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; }, { threshold: 0 });
      io.observe(sec);

      const t0 = performance.now();
      const frame = () => {
        raf = requestAnimationFrame(frame);
        if (!visible || document.hidden) return;
        const p = uniforms.uPtr.value;
        p.x += (tx - p.x) * 0.05;
        p.y += (ty - p.y) * 0.05;
        uniforms.uTime.value = reduce ? 4 : (performance.now() - t0) / 1000;
        renderer.render(scene, camera);
      };
      frame();
      root.classList.add("gd-gl-on");

      cleanup = () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
        io.disconnect();
        sec.removeEventListener("pointermove", move);
        root.classList.remove("gd-gl-on");
        mat.dispose();
        tex.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    })();

    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  return <div ref={host} className="gd-hero-gl" />;
}
