import React from 'react';

// Generates points for a scalloped gold seal star
function getSealPath(cx: number, cy: number, outerR: number, innerR: number, points: number = 24): string {
  let path = '';
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const angle = (i * Math.PI) / points;
    const x = cx + r * Math.sin(angle);
    const y = cy - r * Math.cos(angle);
    path += (i === 0 ? `M ${x} ${y} ` : `L ${x} ${y} `);
  }
  return path + 'Z';
}

export const CertificateBadge: React.FC<{
  type: string;
  fill?: string;
  stroke?: string;
  width: number;
  height: number;
}> = ({ type, fill = '#C5A059', stroke = '#8C6D2D', width, height }) => {
  const cx = width / 2;
  const cy = height / 2;
  const r = Math.min(width, height) / 2 - 4;

  if (type === 'laurel-wreath') {
    return (
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
        <defs>
          <radialGradient id={`laurel-grad-${width}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F5D061" />
            <stop offset="60%" stopColor={fill} />
            <stop offset="100%" stopColor={stroke} />
          </radialGradient>
        </defs>
        {/* Laurel Left */}
        <g stroke={stroke} fill={`url(#laurel-grad-${width})`} strokeWidth="1">
          <circle cx={cx} cy={cy} r={r * 0.7} fill="none" stroke={stroke} strokeWidth="2" strokeDasharray="4 2" />
          <circle cx={cx} cy={cy} r={r * 0.6} fill="none" stroke={fill} strokeWidth="1" />
          {/* Leaves left */}
          {[-45, -30, -15, 0, 15, 30, 45].map((angle, i) => {
            const rad = ((angle + 180) * Math.PI) / 180;
            const lx = cx + r * 0.8 * Math.cos(rad);
            const ly = cy + r * 0.8 * Math.sin(rad);
            return (
              <ellipse
                key={`leaf-l-${i}`}
                cx={lx}
                cy={ly}
                rx={width * 0.08}
                ry={height * 0.04}
                transform={`rotate(${angle + 30} ${lx} ${ly})`}
              />
            );
          })}
          {/* Leaves right */}
          {[-45, -30, -15, 0, 15, 30, 45].map((angle, i) => {
            const rad = (angle * Math.PI) / 180;
            const rx = cx + r * 0.8 * Math.cos(rad);
            const ry = cy + r * 0.8 * Math.sin(rad);
            return (
              <ellipse
                key={`leaf-r-${i}`}
                cx={rx}
                cy={ry}
                rx={width * 0.08}
                ry={height * 0.04}
                transform={`rotate(${angle - 30} ${rx} ${ry})`}
              />
            );
          })}
          {/* Center Star */}
          <polygon
            points={`${cx},${cy - r * 0.3} ${cx + r * 0.1},${cy - r * 0.08} ${cx + r * 0.3},${cy - r * 0.08} ${cx + r * 0.14},${cy + r * 0.05} ${cx + r * 0.2},${cy + r * 0.28} ${cx},${cy + r * 0.14} ${cx - r * 0.2},${cy + r * 0.28} ${cx - r * 0.14},${cy + r * 0.05} ${cx - r * 0.3},${cy - r * 0.08} ${cx - r * 0.1},${cy - r * 0.08}`}
            fill={fill}
            stroke={stroke}
            strokeWidth="1"
          />
        </g>
      </svg>
    );
  }

  if (type === 'modern-shield') {
    return (
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <linearGradient id={`shield-grad-${width}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="100%" stopColor={fill} />
          </linearGradient>
        </defs>
        <path
          d={`M ${cx} ${cy - r} L ${cx + r * 0.8} ${cy - r * 0.6} L ${cx + r * 0.8} ${cy + r * 0.2} C ${cx + r * 0.8} ${cy + r * 0.75}, ${cx} ${cy + r}, ${cx} ${cy + r} C ${cx} ${cy + r}, ${cx - r * 0.8} ${cy + r * 0.75}, ${cx - r * 0.8} ${cy + r * 0.2} L ${cx - r * 0.8} ${cy - r * 0.6} Z`}
          fill={`url(#shield-grad-${width})`}
          stroke={stroke}
          strokeWidth="3"
        />
        <path
          d={`M ${cx} ${cy - r * 0.7} L ${cx + r * 0.55} ${cy - r * 0.4} L ${cx + r * 0.55} ${cy + r * 0.15} C ${cx + r * 0.55} ${cy + r * 0.55}, ${cx} ${cy + r * 0.75}, ${cx} ${cy + r * 0.75} C ${cx} ${cy + r * 0.75}, ${cx - r * 0.55} ${cy + r * 0.55}, ${cx - r * 0.55} ${cy + r * 0.15} L ${cx - r * 0.55} ${cy - r * 0.4} Z`}
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="1.5"
          opacity="0.8"
        />
        <polyline
          points={`${cx - r * 0.3},${cy} ${cx - r * 0.05},${cy + r * 0.25} ${cx + r * 0.35},${cy - r * 0.2}`}
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (type === 'ribbon-star') {
    return (
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {/* Ribbon tails */}
        <polygon
          points={`${cx - r * 0.4},${cy + r * 0.3} ${cx - r * 0.6},${cy + r * 1.1} ${cx - r * 0.3},${cy + r * 0.9} ${cx},${cy + r * 1.1} ${cx - r * 0.1},${cy + r * 0.4}`}
          fill={stroke}
        />
        <polygon
          points={`${cx + r * 0.4},${cy + r * 0.3} ${cx + r * 0.6},${cy + r * 1.1} ${cx + r * 0.3},${cy + r * 0.9} ${cx},${cy + r * 1.1} ${cx + r * 0.1},${cy + r * 0.4}`}
          fill={fill}
        />
        {/* Rosette seal */}
        <path d={getSealPath(cx, cy, r * 0.85, r * 0.7, 20)} fill={fill} stroke={stroke} strokeWidth="2" />
        <circle cx={cx} cy={cy} r={r * 0.55} fill="#FFFFFF" opacity="0.15" />
        <circle cx={cx} cy={cy} r={r * 0.45} fill="none" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="3 2" />
        <polygon
          points={`${cx},${cy - r * 0.25} ${cx + r * 0.08},${cy - r * 0.07} ${cx + r * 0.26},${cy - r * 0.07} ${cx + r * 0.12},${cy + r * 0.04} ${cx + r * 0.17},${cy + r * 0.23} ${cx},${cy + r * 0.12} ${cx - r * 0.17},${cy + r * 0.23} ${cx - r * 0.12},${cy + r * 0.04} ${cx - r * 0.26},${cy - r * 0.07} ${cx - r * 0.08},${cy - r * 0.07}`}
          fill="#FFFFFF"
        />
      </svg>
    );
  }

  // Default: gold-seal / scalloped classic medal
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <defs>
        <radialGradient id={`gold-seal-${width}`} cx="40%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#FFF2B2" />
          <stop offset="40%" stopColor={fill} />
          <stop offset="90%" stopColor={stroke} />
          <stop offset="100%" stopColor="#5E4311" />
        </radialGradient>
      </defs>
      <path d={getSealPath(cx, cy, r, r * 0.82, 28)} fill={`url(#gold-seal-${width})`} stroke={stroke} strokeWidth="1.5" />
      <circle cx={cx} cy={cy} r={r * 0.72} fill="none" stroke="#FFF2B2" strokeWidth="2" />
      <circle cx={cx} cy={cy} r={r * 0.64} fill="none" stroke={stroke} strokeWidth="1" strokeDasharray="3 3" />
      <circle cx={cx} cy={cy} r={r * 0.54} fill={fill} stroke={stroke} strokeWidth="1" />
      {/* Embossed star in center */}
      <polygon
        points={`${cx},${cy - r * 0.3} ${cx + r * 0.1},${cy - r * 0.08} ${cx + r * 0.3},${cy - r * 0.08} ${cx + r * 0.14},${cy + r * 0.05} ${cx + r * 0.2},${cy + r * 0.28} ${cx},${cy + r * 0.14} ${cx - r * 0.2},${cy + r * 0.28} ${cx - r * 0.14},${cy + r * 0.05} ${cx - r * 0.3},${cy - r * 0.08} ${cx - r * 0.1},${cy - r * 0.08}`}
        fill="#FFF2B2"
        stroke={stroke}
        strokeWidth="1"
      />
    </svg>
  );
};

export const CertificateBorderRenderer: React.FC<{
  style: string;
  color: string;
  secondaryColor?: string;
  width: number;
  inset: number;
  canvasWidth: number;
  canvasHeight: number;
}> = ({ style, color, secondaryColor = '#C5A059', width: bWidth, inset, canvasWidth, canvasHeight }) => {
  if (style === 'none') return null;

  const w = canvasWidth;
  const h = canvasHeight;

  if (style === 'classic-double') {
    const outerX = inset;
    const outerY = inset;
    const outerW = w - inset * 2;
    const outerH = h - inset * 2;
    const innerInset = inset + 12;
    const innerX = innerInset;
    const innerY = innerInset;
    const innerW = w - innerInset * 2;
    const innerH = h - innerInset * 2;

    return (
      <g className="certificate-border pointer-events-none select-none">
        {/* Outer thick border */}
        <rect
          x={outerX}
          y={outerY}
          width={outerW}
          height={outerH}
          fill="none"
          stroke={color}
          strokeWidth={bWidth}
        />
        {/* Inner thin decorative border */}
        <rect
          x={innerX}
          y={innerY}
          width={innerW}
          height={innerH}
          fill="none"
          stroke={secondaryColor}
          strokeWidth={Math.max(1, bWidth * 0.4)}
        />
        {/* Corner rosettes */}
        {[
          [innerX, innerY],
          [innerX + innerW, innerY],
          [innerX, innerY + innerH],
          [innerX + innerW, innerY + innerH]
        ].map(([cx, cy], i) => (
          <g key={i}>
            <circle cx={cx} cy={cy} r="6" fill={secondaryColor} stroke={color} strokeWidth="1" />
            <circle cx={cx} cy={cy} r="2" fill="#FFFFFF" />
          </g>
        ))}
      </g>
    );
  }

  if (style === 'gold-embossed') {
    const oX = inset;
    const oY = inset;
    const oW = w - inset * 2;
    const oH = h - inset * 2;
    const iX = inset + 8;
    const iY = inset + 8;
    const iW = w - (inset + 8) * 2;
    const iH = h - (inset + 8) * 2;

    return (
      <g className="certificate-border pointer-events-none select-none">
        <rect x={oX} y={oY} width={oW} height={oH} fill="none" stroke={color} strokeWidth={bWidth} />
        <rect x={iX} y={iY} width={iW} height={iH} fill="none" stroke={secondaryColor} strokeWidth="2" strokeDasharray="6 3" />
        <rect x={iX + 6} y={iY + 6} width={iW - 12} height={iH - 12} fill="none" stroke={color} strokeWidth="1" />
      </g>
    );
  }

  if (style === 'modern-accent') {
    const oX = inset;
    const oY = inset;
    const oW = w - inset * 2;
    const oH = h - inset * 2;

    return (
      <g className="certificate-border pointer-events-none select-none">
        {/* Left thick accent or modern corner frames */}
        <rect x={oX} y={oY} width={oW} height={oH} fill="none" stroke={color} strokeWidth={bWidth} />
        {/* Corner bracket accents */}
        <path
          d={`M ${oX + 30} ${oY + 10} L ${oX + 10} ${oY + 10} L ${oX + 10} ${oY + 30}`}
          fill="none"
          stroke={secondaryColor}
          strokeWidth={bWidth * 1.5}
        />
        <path
          d={`M ${oX + oW - 30} ${oY + 10} L ${oX + oW - 10} ${oY + 10} L ${oX + oW - 10} ${oY + 30}`}
          fill="none"
          stroke={secondaryColor}
          strokeWidth={bWidth * 1.5}
        />
        <path
          d={`M ${oX + 30} ${oY + oH - 10} L ${oX + 10} ${oY + oH - 10} L ${oX + 10} ${oY + oH - 30}`}
          fill="none"
          stroke={secondaryColor}
          strokeWidth={bWidth * 1.5}
        />
        <path
          d={`M ${oX + oW - 30} ${oY + oH - 10} L ${oX + oW - 10} ${oY + oH - 10} L ${oX + oW - 10} ${oY + oH - 30}`}
          fill="none"
          stroke={secondaryColor}
          strokeWidth={bWidth * 1.5}
        />
      </g>
    );
  }

  // Minimal hairline border
  const oX = inset;
  const oY = inset;
  const oW = w - inset * 2;
  const oH = h - inset * 2;

  return (
    <g className="certificate-border pointer-events-none select-none">
      <rect x={oX} y={oY} width={oW} height={oH} fill="none" stroke={color} strokeWidth={bWidth} />
    </g>
  );
};
