/** Decorative turning glass cube (pure CSS 3D): an outer frame with a counter-rotating core. */
export default function GameCube({ size = 120, className = "", tint = "#5cc0ff" }: { size?: number; className?: string; tint?: string }) {
  const faces = [0, 1, 2, 3, 4, 5];
  return (
    <div aria-hidden="true" className={`gd-cube ${className}`} style={{ ["--s" as string]: `${size}px`, ["--t" as string]: tint }}>
      <div className="gd-cube-spin">
        {faces.map((f) => (
          <i key={f} />
        ))}
        <div className="gd-cube-core">
          {faces.map((f) => (
            <b key={f} />
          ))}
        </div>
      </div>
    </div>
  );
}
