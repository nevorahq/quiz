// Server-safe — no 'use client' needed; pure CSS decoration

export default function BackgroundMesh() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Primary radial glow — top centre */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 55% at 50% -10%, rgba(99,102,241,0.18) 0%, transparent 70%)',
        }}
      />
      {/* Secondary glow — bottom-right */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 55% 50% at 90% 100%, rgba(99,102,241,0.09) 0%, transparent 65%)',
        }}
      />
      {/* Subtle noise texture via SVG filter */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.03]">
        <filter id="noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)" />
      </svg>
    </div>
  )
}
