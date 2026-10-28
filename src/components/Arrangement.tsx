import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { inter, theme } from "../theme";

/* Lines are given as a normal angle in degrees and a signed distance from the
   origin:  x·cos θ + y·sin θ = d.  World coordinates are then mapped into the
   SVG box, with S the half-width of the world window. */

export type LineDef = { deg: number; d: number };

export type Pt = { x: number; y: number };

const rad = (deg: number) => (deg * Math.PI) / 180;

export const meet = (a: LineDef, b: LineDef): Pt | null => {
  const t1 = rad(a.deg);
  const t2 = rad(b.deg);
  const a1 = Math.cos(t1);
  const b1 = Math.sin(t1);
  const a2 = Math.cos(t2);
  const b2 = Math.sin(t2);
  const det = a1 * b2 - a2 * b1;
  if (Math.abs(det) < 1e-9) return null;
  return { x: (a.d * b2 - b.d * b1) / det, y: (a1 * b.d - a2 * a.d) / det };
};

export const allMeets = (lines: LineDef[]): Pt[] => {
  const out: Pt[] = [];
  for (let i = 0; i < lines.length; i += 1)
    for (let j = i + 1; j < lines.length; j += 1) {
      const p = meet(lines[i], lines[j]);
      if (p) out.push(p);
    }
  return out;
};

/** Ten lines in general position: no two parallel, no three concurrent. */
export const TEN: LineDef[] = [
  { deg: 6.71, d: 0.2715 },
  { deg: 25.06, d: -0.2853 },
  { deg: 43.62, d: 0.3134 },
  { deg: 64.77, d: 0.1792 },
  { deg: 77.59, d: -0.115 },
  { deg: 95.98, d: 0.3899 },
  { deg: 114.23, d: 0.1622 },
  { deg: 135.01, d: 0.4209 },
  { deg: 155.94, d: -0.2801 },
  { deg: 170.53, d: -0.0868 },
];

/** Four lines, well spread — the complete quadrilateral used for the check. */
export const FOUR: LineDef[] = [
  { deg: 37.55, d: 0.4047 },
  { deg: 127.05, d: 0.1776 },
  { deg: 89.08, d: -0.4091 },
  { deg: 175.48, d: 0.1963 },
];

const W = 400;
const H = 400;

type ArrangementProps = {
  lines: LineDef[];
  size?: number;
  span?: number;
  dots?: "none" | "all";
  dotR?: number;
  dotColor?: string;
  lineColor?: string;
  lineWidth?: number;
  /** indices of lines drawn thicker, in amber */
  accent?: number[];
  /** draw a dot + label at the meeting of these two line indices */
  mark?: [number, number];
  markLabel?: string;
  /** faint extra segments joining pairs of points (indices into allMeets) */
  joins?: [number, number][];
  /** dashed lines through opposite vertices — only meaningful for 4 lines */
  diagonals?: boolean;
  /** reveal everything progressively over this many frames */
  reveal?: number;
  dim?: number;
};

export const Arrangement: React.FC<ArrangementProps> = ({
  lines,
  size = 700,
  span = 1.78,
  dots = "none",
  dotR = 5,
  dotColor = theme.accent,
  lineColor = "#c9c3b4",
  lineWidth = 3,
  accent = [],
  mark,
  markLabel,
  joins = [],
  diagonals = false,
  reveal = 0,
  dim = 1,
}) => {
  const frame = useCurrentFrame();
  const pts = allMeets(lines);

  const sx = (x: number) => W / 2 + (x / span) * (W / 2);
  const sy = (y: number) => H / 2 - (y / span) * (H / 2);

  const progress = reveal > 0 ? interpolate(frame, [0, reveal], [0, 1], { extrapolateRight: "clamp" }) : 1;

  const seg = (l: LineDef) => {
    const t = rad(l.deg);
    const px = l.d * Math.cos(t);
    const py = l.d * Math.sin(t);
    const dx = -Math.sin(t) * 4;
    const dy = Math.cos(t) * 4;
    return { x1: px - dx, y1: py - dy, x2: px + dx, y2: py + dy };
  };

  const diagPairs: [number, number][] = diagonals
    ? [
        [0, 5], // (0,1)-(2,3)
        [1, 4], // (0,2)-(1,3)
        [2, 3], // (0,3)-(1,2)
      ]
    : [];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: size, opacity: dim }} role="img">
      <defs>
        <clipPath id="frame">
          <rect x={6} y={6} width={W - 12} height={H - 12} rx={18} />
        </clipPath>
      </defs>
      <rect x={6} y={6} width={W - 12} height={H - 12} rx={18} fill={theme.card} stroke={theme.line} strokeWidth={2} />
      <g clipPath="url(#frame)">
        {lines.map((l, i) => {
          const s = seg(l);
          const hot = accent.includes(i);
          return (
            <line
              key={i}
              x1={sx(s.x1)}
              y1={sy(s.y1)}
              x2={sx(s.x2)}
              y2={sy(s.y2)}
              stroke={hot ? theme.blockLine : lineColor}
              strokeWidth={hot ? lineWidth + 3 : lineWidth}
              strokeLinecap="round"
              opacity={hot ? 1 : 0.9}
            />
          );
        })}

        {diagPairs.map(([a, b], i) => {
          const p = pts[a];
          const q = pts[b];
          if (!p || !q) return null;
          return (
            <line
              key={`d${i}`}
              x1={sx(p.x)}
              y1={sy(p.y)}
              x2={sx(q.x)}
              y2={sy(q.y)}
              stroke={theme.accent}
              strokeWidth={3}
              strokeDasharray="10 9"
              strokeLinecap="round"
              opacity={progress}
            />
          );
        })}

        {joins.map(([a, b], i) => {
          const p = pts[a];
          const q = pts[b];
          if (!p || !q) return null;
          return (
            <line
              key={`j${i}`}
              x1={sx(p.x)}
              y1={sy(p.y)}
              x2={sx(q.x)}
              y2={sy(q.y)}
              stroke={theme.accent}
              strokeWidth={2.5}
              opacity={0.55 * progress}
            />
          );
        })}

        {dots === "all"
          ? pts.map((p, i) => (
              <circle
                key={`p${i}`}
                cx={sx(p.x)}
                cy={sy(p.y)}
                r={dotR}
                fill={dotColor}
                opacity={interpolate(i, [0, Math.max(1, pts.length)], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }) * (reveal > 0 ? progress : 1)}
              />
            ))
          : null}

        {mark
          ? (() => {
              const p = meet(lines[mark[0]], lines[mark[1]]);
              if (!p) return null;
              return (
                <g opacity={progress}>
                  <circle cx={sx(p.x)} cy={sy(p.y)} r={11} fill="none" stroke={theme.accent} strokeWidth={3} />
                  <circle cx={sx(p.x)} cy={sy(p.y)} r={5} fill={theme.accent} />
                  {markLabel ? (
                    <text
                      x={sx(p.x)}
                      y={sy(p.y) - 22}
                      textAnchor="middle"
                      fontFamily={inter}
                      fontSize={19}
                      fontWeight={700}
                      fill={theme.accentDark}
                    >
                      {markLabel}
                    </text>
                  ) : null}
                </g>
              );
            })()
          : null}
      </g>
    </svg>
  );
};

/** One original line, carrying all nine of its crossings. */
export const NineOnALine: React.FC<{ width?: number; pick?: [number, number] }> = ({
  width = 700,
  pick = [2, 6],
}) => {
  const frame = useCurrentFrame();
  const W2 = 420;
  const H2 = 240;
  const y = 120;
  const xs = Array.from({ length: 9 }, (_, i) => 30 + i * 45);
  const grow = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" });
  return (
    <svg viewBox={`0 0 ${W2} ${H2}`} style={{ width }} role="img">
      <rect x={4} y={4} width={W2 - 8} height={H2 - 8} rx={18} fill={theme.card} stroke={theme.line} strokeWidth={2} />
      <line
        x1={30}
        y1={y}
        x2={30 + (W2 - 60) * grow}
        y2={y}
        stroke={theme.ink}
        strokeWidth={4}
        strokeLinecap="round"
      />
      {xs.map((x, i) => {
        const hot = pick.includes(i);
        const appear = interpolate(frame, [6 + i * 2, 12 + i * 2], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={hot ? 9 : 6}
            fill={hot ? theme.accent : theme.ink}
            opacity={appear}
            stroke={hot ? theme.card : "none"}
            strokeWidth={hot ? 3 : 0}
          />
        );
      })}
      <text x={W2 / 2} y={62} textAnchor="middle" fontFamily={inter} fontSize={20} fontWeight={700} fill={theme.faint}>
        one original line
      </text>
      <text x={W2 / 2} y={192} textAnchor="middle" fontFamily={inter} fontSize={20} fontWeight={700} fill={theme.accentDark}>
        nine crossings, all on this line
      </text>
    </svg>
  );
};
