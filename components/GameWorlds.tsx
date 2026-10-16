/* Procedural "world select" scenes: layered neon landscapes drawn as SVG, no image files needed. */
type Kind = "peaks" | "city" | "waves" | "retro" | "forest" | "orbit";
type World = { kind: Kind; a: string; b: string; c: string; title: string; text: string; stage: string; diff: number };

function Scene({ id, kind, a, b, c }: { id: string; kind: Kind; a: string; b: string; c: string }) {
  const bars = [30, 52, 38, 66, 44, 78, 34, 58, 48, 70, 40, 62, 36];
  return (
    <svg viewBox="0 0 320 190" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={a} />
          <stop offset="1" stopColor={b} />
        </linearGradient>
        <radialGradient id={`${id}-sun`}>
          <stop offset="0" stopColor={c} />
          <stop offset="1" stopColor={c} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="320" height="190" fill={`url(#${id}-sky)`} />
      {Array.from({ length: 26 }, (_, i) => (
        <rect key={i} x={(i * 53) % 320} y={(i * 29) % 90} width="2" height="2" fill="#fff" opacity={0.25 + (i % 4) * 0.18} />
      ))}
      <circle cx="232" cy="68" r="62" fill={`url(#${id}-sun)`} opacity=".7" />
      <circle cx="232" cy="68" r="24" fill={c} />
      {kind === "peaks" && (
        <>
          <path d="M0 150 70 78 120 124 170 62 240 140 290 96 320 128V190H0Z" fill="#0c1240" opacity=".75" />
          <path d="M0 170 60 118 110 156 180 106 250 160 320 130V190H0Z" fill="#080b2e" />
        </>
      )}
      {kind === "city" && (
        <g>
          {bars.map((h, i) => (
            <g key={i}>
              <rect x={i * 25} y={190 - h * 1.6} width="22" height={h * 1.6} fill="#0a0f3a" />
              {Array.from({ length: Math.floor(h / 14) }, (_, j) => (
                <rect key={j} x={i * 25 + 5 + (j % 2) * 9} y={190 - h * 1.6 + 8 + j * 12} width="4" height="4" fill={c} opacity={0.5 + ((i + j) % 3) * 0.2} />
              ))}
            </g>
          ))}
        </g>
      )}
      {kind === "waves" && (
        <>
          <path d="M0 120c40-20 80 20 120 0s80-20 120 0 60 16 80 6v64H0Z" fill="#0b1a55" opacity=".8" />
          <path d="M0 146c50-18 90 18 140 0s90-14 180 4v40H0Z" fill="#071038" />
        </>
      )}
      {kind === "retro" && (
        <>
          {[0, 1, 2, 3, 4].map((i) => (
            <rect key={i} x="196" y={74 + i * 5} width="72" height={1 + i * 0.8} fill={a} />
          ))}
          <path d="M0 128h320V190H0Z" fill="#0a0d36" />
          {Array.from({ length: 9 }, (_, i) => (
            <path key={i} d={`M${160 + (i - 4) * 14} 128 L${160 + (i - 4) * 70} 190`} stroke={c} strokeOpacity=".55" strokeWidth="1" />
          ))}
          {[142, 156, 172].map((y) => (
            <path key={y} d={`M0 ${y}H320`} stroke={c} strokeOpacity=".4" />
          ))}
        </>
      )}
      {kind === "forest" && (
        <g fill="#070b2c">
          {Array.from({ length: 16 }, (_, i) => (
            <path key={i} d={`M${i * 21 - 4} 190 ${i * 21 + 7} ${110 + (i % 4) * 14} ${i * 21 + 18} 190Z`} />
          ))}
        </g>
      )}
      {kind === "orbit" && (
        <g fill="none" stroke={c} strokeOpacity=".7">
          <ellipse cx="96" cy="120" rx="80" ry="22" transform="rotate(-18 96 120)" />
          <circle cx="96" cy="120" r="30" fill="#0a0f3a" />
          <circle cx="96" cy="120" r="30" stroke={c} />
          <path d="M0 160c80-26 150-26 320 0" />
          <circle cx="250" cy="150" r="6" fill={c} />
        </g>
      )}
      <rect y="150" width="320" height="40" fill={`url(#${id}-sky)`} opacity="0" />
    </svg>
  );
}

const WORLDS: World[] = [
  { kind: "waves", a: "#04307a", b: "#009a9a", c: "#7ff3e0", title: "Healthcare and Pharma", text: "Therapeutic and training simulations with 3D modelling and motion tracking.", stage: "1-1", diff: 3 },
  { kind: "peaks", a: "#2a1a7a", b: "#c44fd6", c: "#ffd6f4", title: "Education and Edutainment", text: "Virtual campuses and live classes that make learning interactive.", stage: "1-2", diff: 2 },
  { kind: "city", a: "#0a2a8a", b: "#1b6cff", c: "#9fe0ff", title: "Real Estate and Architecture", text: "Real-time property tours and architectural walkthroughs.", stage: "2-1", diff: 3 },
  { kind: "retro", a: "#ff4fa0", b: "#6a1fb0", c: "#ffd23f", title: "Marketing and Advertising", text: "Advergames and branded worlds that earn attention across devices.", stage: "2-2", diff: 2 },
  { kind: "forest", a: "#ff7a2f", b: "#8a1f6a", c: "#ffe29a", title: "Sports and Fitness", text: "Motion-tracked fitness apps and VR sports training with interactive 3D avatars.", stage: "3-1", diff: 4 },
  { kind: "orbit", a: "#150a50", b: "#5a2bd6", c: "#b9a2ff", title: "Entertainment and Media", text: "Original IP across MMO and naval combat formats for mobile, PC and console.", stage: "3-2", diff: 5 },
];

export default function GameWorlds() {
  return (
    <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:mt-14">
      {WORLDS.map((w, n) => (
        <div key={w.title} data-reveal="" style={{ "--reveal-delay": `${(n % 3) * 0.07}s`, "--reveal-y": "28px" } as React.CSSProperties}>
          <article data-tilt="" className="gx-tilt gx-world group relative h-full overflow-hidden rounded-[24px] border border-ink/[0.08] bg-white">
            <div className="relative aspect-[16/10] overflow-hidden">
              <div className="gx-world-art absolute inset-0">
                <Scene id={`w${n}`} kind={w.kind} a={w.a} b={w.b} c={w.c} />
              </div>
              <span className="gx-badge absolute left-4 top-4">WORLD {w.stage}</span>
              <span className="gx-diff absolute right-4 top-4" aria-label={`Difficulty ${w.diff} of 5`}>
                {Array.from({ length: 5 }, (_, i) => (
                  <i key={i} className={i < w.diff ? "on" : ""} />
                ))}
              </span>
            </div>
            <div className="p-6 sm:p-7">
              <h3 className="text-[clamp(1.2rem,1.6vw,1.4rem)] leading-snug tracking-[-0.02em] text-ink">{w.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{w.text}</p>
              <p className="gx-mono mt-5 flex items-center gap-2 text-brand-ink">
                <span className="gx-caret" /> Enter world
              </p>
            </div>
          </article>
        </div>
      ))}
    </div>
  );
}
