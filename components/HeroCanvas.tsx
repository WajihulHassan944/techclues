"use client";

import { useEffect } from "react";

const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_mouse;

// Tiny dither to prevent colour banding in the smooth blends
float grain(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

vec3 field(vec2 p, vec2 c, vec3 col, float r, inout float wsum) {
  float d = length(p - c);
  float w = exp(-d * d / (r * r));
  wsum += w;
  return col * w;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  float aspect = u_res.x / u_res.y;
  vec2 p = vec2(uv.x * aspect, uv.y);
  float t = u_time * 0.12;

  p += 0.10 * vec2(sin(p.y * 2.3 + t * 1.7), cos(p.x * 1.9 - t * 1.3));
  p += 0.05 * vec2(sin(p.y * 4.1 - t * 2.1), cos(p.x * 3.7 + t * 1.6));
  p += (u_mouse - 0.5) * 0.12;

  vec3 navy = vec3(0.055, 0.06, 0.19);
  vec3 deep = vec3(0.01, 0.20, 0.64);
  vec3 blue = vec3(0.00, 0.39, 1.00);
  vec3 sky  = vec3(0.36, 0.76, 1.00);
  vec3 ice  = vec3(0.86, 0.92, 1.00);

  float ws = 0.0;
  vec3 col = vec3(0.0);
  col += field(p, vec2(aspect * (0.15 + 0.10 * sin(t * 0.9)),  0.75 + 0.15 * cos(t * 0.7)), ice,  0.55, ws);
  col += field(p, vec2(aspect * (0.35 + 0.12 * cos(t * 0.6)),  0.25 + 0.12 * sin(t * 1.1)), sky,  0.50, ws);
  col += field(p, vec2(aspect * (0.55 + 0.10 * sin(t * 0.8 + 1.0)), 0.60 + 0.18 * sin(t * 0.5)), blue, 0.60, ws);
  col += field(p, vec2(aspect * (0.75 + 0.08 * cos(t * 0.7 + 2.0)), 0.20 + 0.15 * cos(t * 0.9)), deep, 0.55, ws);
  col += field(p, vec2(aspect * (0.95 + 0.08 * sin(t * 0.6 + 3.0)), 0.80 + 0.12 * sin(t * 0.8)), navy, 0.60, ws);
  col += field(p, vec2(aspect * (0.62 + 0.20 * cos(t * 0.4)),  0.95 + 0.10 * sin(t * 1.2)), sky,  0.35, ws);
  col /= max(ws, 1e-4);

  float sheen = sin((p.x * 1.2 + p.y * 1.8) * 2.2 - t * 2.4) * 0.5 + 0.5;
  col += vec3(0.55, 0.75, 1.0) * smoothstep(0.75, 1.0, sheen) * 0.10;

  col += (grain(gl_FragCoord.xy) - 0.5) / 255.0 * 2.0;
  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`;

const FRAME_MS = 1000 / 30;

/** Animated WebGL gradient behind the hero. The CSS gradient stays as the fallback. */
export default function HeroCanvas() {
  useEffect(() => {
    const canvas = document.querySelector<HTMLCanvasElement>(".hero-lift canvas");
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: false, premultipliedAlpha: false });
    if (!gl) return;

    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      return sh;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uRes = gl.getUniformLocation(prog, "u_res");
    const uTime = gl.getUniformLocation(prog, "u_time");
    const uMouse = gl.getUniformLocation(prog, "u_mouse");

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
    const start = performance.now() - 2e4;
    let visible = true;
    let raf = 0;
    let last = 0;
    let shown = false;

    const draw = (now: number) => {
      mouse.x += (mouse.tx - mouse.x) * 0.08;
      mouse.y += (mouse.ty - mouse.y) * 0.08;
      gl.uniform1f(uTime, (now - start) / 1000);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!shown) {
        shown = true;
        canvas.style.opacity = "1";
      }
    };
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * dpr));
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      draw(performance.now());
    };
    const loop = (now: number) => {
      if (!visible) return;
      if (now - last >= FRAME_MS) {
        last = now;
        draw(now);
      }
      raf = requestAnimationFrame(loop);
    };
    const onPointer = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.tx = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
      mouse.ty = Math.min(1, Math.max(0, 1 - (e.clientY - r.top) / r.height));
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !reduce) {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(loop);
      }
    });
    io.observe(canvas);
    if (!reduce) window.addEventListener("pointermove", onPointer, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onPointer);
    };
  }, []);

  return null;
}
