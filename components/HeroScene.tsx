"use client";

import { useEffect, useRef } from "react";

/**
 * WebGL layer over the hero photo: glowing wireframe solids that drift and follow the pointer,
 * plus a slowly turning point-cloud galaxy. three.js is loaded on demand, only on this page.
 */
export default function HeroScene() {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    const sec = el?.parentElement?.parentElement;
    if (!el || !sec) return;
    const secEl: HTMLElement = sec;
    let disposed = false;
    let cleanup = () => {};

    (async () => {
      const THREE = await import("three");
      if (disposed) return;
      const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
      const small = innerWidth < 760;
      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try {
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !small, powerPreference: "high-performance" });
      } catch {
        return; // no WebGL: the photo alone still looks fine
      }
      renderer.setPixelRatio(Math.min(devicePixelRatio || 1, small ? 1.25 : 1.75));
      renderer.setClearColor(0x000000, 0);
      el.appendChild(renderer.domElement);
      renderer.domElement.style.cssText = "position:absolute;inset:0;width:100%;height:100%";

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
      camera.position.set(0, 0, 9);

      const rig = new THREE.Group();
      scene.add(rig);

      // glowing wireframe solids
      const palette = [0x5cc0ff, 0x9b6bff, 0x2fa8ff, 0xff6fb5, 0x7fe3ff];
      const defs: [InstanceType<typeof THREE.BufferGeometry<import("three").NormalBufferAttributes>>, number, number, number, number, number][] = [
        [new THREE.IcosahedronGeometry(1.5, 1), 3.5, 0.5, -0.5, 0, 1],
        [new THREE.TorusKnotGeometry(0.62, 0.2, 120, 16), 5.7, 2.0, 0.6, 1, 0.9],
        [new THREE.OctahedronGeometry(0.85), 5.4, -1.6, 1.2, 2, 1],
        [new THREE.DodecahedronGeometry(0.7), 2.7, 2.5, -1.5, 3, 1],
        [new THREE.TetrahedronGeometry(0.75), 2.0, -2.6, 0.2, 4, 1],
        [new THREE.BoxGeometry(0.9, 0.9, 0.9), 0.9, -2.9, -0.6, 1, 0.8],
      ];
      const solids = defs.slice(0, small ? 3 : defs.length).map(([geo, x, y, z, ci, s], i) => {
        const g = new THREE.Group();
        const col = palette[ci % palette.length];
        const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geo, 20), new THREE.LineBasicMaterial({ color: col, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending }));
        const fill = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.07, blending: THREE.AdditiveBlending, depthWrite: false }));
        g.add(fill, edges);
        g.position.set(small ? x * 0.55 : x, y, z);
        g.scale.setScalar(s * (small ? 0.8 : 1));
        g.userData = { base: g.position.clone(), sp: 0.15 + i * 0.05, ph: i * 1.3 };
        rig.add(g);
        return g;
      });

      // point-cloud galaxy
      const N = small ? 700 : 1800;
      const pos = new Float32Array(N * 3);
      const col = new Float32Array(N * 3);
      const c1 = new THREE.Color(0x5cc0ff), c2 = new THREE.Color(0x9b6bff), c3 = new THREE.Color(0xff6fb5), tmp = new THREE.Color();
      for (let i = 0; i < N; i++) {
        const arm = i % 3;
        const r = Math.pow(Math.random(), 0.7) * 7.5;
        const a = r * 0.9 + (arm * Math.PI * 2) / 3 + (Math.random() - 0.5) * 0.7;
        pos[i * 3] = Math.cos(a) * r + (Math.random() - 0.5) * 0.5;
        pos[i * 3 + 1] = (Math.random() - 0.5) * 0.6 * (1 + r * 0.12);
        pos[i * 3 + 2] = Math.sin(a) * r + (Math.random() - 0.5) * 0.5;
        tmp.copy(c1).lerp(c2, Math.min(1, r / 6));
        if (Math.random() < 0.12) tmp.copy(c3);
        col.set([tmp.r, tmp.g, tmp.b], i * 3);
      }
      const pg = new THREE.BufferGeometry();
      pg.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      pg.setAttribute("color", new THREE.BufferAttribute(col, 3));
      const galaxy = new THREE.Points(pg, new THREE.PointsMaterial({ size: small ? 0.045 : 0.035, vertexColors: true, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true }));
      galaxy.position.set(small ? 0 : 2.2, -0.2, -3);
      galaxy.rotation.x = 0.9;
      scene.add(galaxy);

      const size = () => {
        const w = secEl.clientWidth, h = secEl.clientHeight;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };
      size();
      const ro = new ResizeObserver(size);
      ro.observe(secEl);

      let mx = 0, my = 0, cx = 0, cy = 0, visible = true, raf = 0;
      const move = (e: PointerEvent) => {
        const r = secEl.getBoundingClientRect();
        mx = ((e.clientX - r.left) / r.width - 0.5) * 2;
        my = ((e.clientY - r.top) / r.height - 0.5) * 2;
      };
      secEl.addEventListener("pointermove", move);
      const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible && !raf && !reduce) raf = requestAnimationFrame(frame); });
      io.observe(secEl);

      const clock = new THREE.Clock();
      function frame() {
        raf = 0;
        if (!visible || disposed) return;
        const t = clock.getElapsedTime();
        cx += (mx - cx) * 0.05;
        cy += (my - cy) * 0.05;
        const sy = Math.min(1, Math.max(0, scrollY / Math.max(1, secEl.clientHeight)));
        rig.rotation.y = cx * 0.28;
        rig.rotation.x = cy * 0.16 + sy * 0.35;
        rig.position.y = sy * 1.6;
        camera.position.x = cx * 0.6;
        camera.position.y = -cy * 0.4;
        camera.lookAt(0, 0, 0);
        galaxy.rotation.y = t * 0.05;
        solids.forEach((g, i) => {
          const u = g.userData as { base: InstanceType<typeof THREE.Vector3>; sp: number; ph: number };
          g.rotation.x = t * u.sp * (i % 2 ? 1 : -1) + u.ph;
          g.rotation.y = t * u.sp * 1.4 + u.ph;
          g.position.y = u.base.y + Math.sin(t * 0.6 + u.ph) * 0.22;
        });
        renderer.render(scene, camera);
        if (!reduce) raf = requestAnimationFrame(frame);
      }
      frame();

      cleanup = () => {
        cancelAnimationFrame(raf);
        io.disconnect();
        ro.disconnect();
        secEl.removeEventListener("pointermove", move);
        scene.traverse((o) => {
          const m = o as unknown as { geometry?: { dispose(): void }; material?: { dispose(): void } | { dispose(): void }[] };
          m.geometry?.dispose();
          if (Array.isArray(m.material)) m.material.forEach((x) => x.dispose());
          else m.material?.dispose();
        });
        renderer.dispose();
        renderer.domElement.remove();
      };
      if (disposed) cleanup();
    })();

    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  return <div ref={host} aria-hidden="true" className="gd-hero-gl" />;
}
