// Shared VoltConnect Logo Component
// Uses a Flutter-style geometric chevron/kite icon in VoltConnect teal.
//
// Props:
//   size       — icon pixel size (default 36)
//   textSize   — wordmark font size (default 20)
//   showText   — show wordmark alongside icon (default true)
//   glowColor  — override glow color (default teal)

export default function VoltLogo({
  size = 36,
  textSize = 20,
  showText = true,
  glowColor = 'rgba(0,255,178,0.22)',
}) {
  const iconW = size;
  const iconH = Math.round(size * 1.15); // slight tall ratio like Flutter logo

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: showText ? Math.round(size * 0.28) : 0 }}>
      {/* Icon */}
      <div style={{ position: 'relative', width: iconW, height: iconH, flexShrink: 0 }}>
        {/* Radial glow halo behind icon */}
        <div style={{
          position: 'absolute',
          inset: -iconW * 0.55,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${glowColor} 0%, transparent 68%)`,
          pointerEvents: 'none',
        }} />
        {/*
          Flutter-style geometric icon:
          — Two overlapping angular parallelogram shapes
          — Upper band:   bright teal  #00FFB2
          — Lower chevron outer:  bright teal  #00FFB2
          — Lower inner diamond shard:  dark teal  #007A5E
          viewBox is 40 × 46 to give the right proportions
        */}
        <svg
          width={iconW}
          height={iconH}
          viewBox="0 0 40 46"
          fill="none"
          style={{ position: 'relative', zIndex: 1 }}
        >
          {/* ── Upper parallelogram band (flat bar angled right) ── */}
          <polygon
            points="3,2 30,2 24,13 3,13"
            fill="#00FFB2"
          />

          {/* ── Lower chevron — outer bright teal ── */}
          {/*   Hexagon: top-left, top-right, far-right peak, bottom-right, bottom-left, left-indent */}
          <polygon
            points="3,15 17,15 30,28 17,41 3,41 11,28"
            fill="#00FFB2"
          />

          {/* ── Dark inner diamond shard (the Flutter-style overlap accent) ── */}
          <polygon
            points="14,22 30,28 18,35 6,28"
            fill="#007A5E"
          />
        </svg>
      </div>

      {/* Wordmark */}
      {showText && (
        <span style={{
          fontWeight: 900,
          fontSize: textSize,
          letterSpacing: '-0.4px',
          lineHeight: 1,
          fontFamily: "'Inter', system-ui, sans-serif",
        }}>
          <span style={{ color: '#ffffff' }}>Volt</span>
          <span style={{ color: '#00FFB2' }}>Connect</span>
        </span>
      )}
    </div>
  );
}
