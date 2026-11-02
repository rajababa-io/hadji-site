import React from 'react';
import {AbsoluteFill, Easing, interpolate, staticFile, useCurrentFrame, delayRender, continueRender} from 'remotion';

// Outfit (variable) is bundled in public/ so renders never depend on the network.
const fontFamily = 'Outfit';
if (typeof document !== 'undefined') {
  const h = delayRender('font');
  new FontFace(fontFamily, `url(${staticFile('outfit.woff2')})`, {weight: '100 900'}).load()
    .then((ff) => { document.fonts.add(ff); continueRender(h); })
    .catch(() => continueRender(h));
}

export const FPS = 30;
export const W = 1280;
export const H = 720;
export const sec = (s: number) => Math.round(s * FPS);

// hadji.ai look
export const C = {
  bg: '#08090A', panel: '#0F1011', panel2: '#141516', line: '#1E1F22', line2: '#2A2B2F',
  fg: '#F7F8F8', mute: '#8A8F98', dim: '#5C6068',
  orange: '#FF6B2C', green: '#4CB782', amber: '#F2C94C', blue: '#5E9EFF',
};
export const mono = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';

/** 0→1 progress between frame `at` and `at+dur`, eased. */
export const useProgress = (at: number, dur = 15) => {
  const f = useCurrentFrame();
  return interpolate(f, [at, at + dur], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic),
  });
};

export const Stage: React.FC<{children: React.ReactNode}> = ({children}) => (
  <AbsoluteFill style={{background: C.bg, fontFamily, color: C.fg}}>
    <AbsoluteFill style={{
      backgroundImage: `radial-gradient(${C.line} 1.5px, transparent 1.5px)`,
      backgroundSize: '40px 40px', opacity: 0.6,
    }} />
    {children}
  </AbsoluteFill>
);

export const Title: React.FC<{title: string; sub: string; from: number; to: number}> = ({title, sub, from, to}) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [from, from + 15, to - 15, to], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  if (f < from || f > to) return null;
  return (
    <AbsoluteFill style={{background: C.bg, alignItems: 'center', justifyContent: 'center', opacity: o}}>
      <div style={{color: C.orange, fontSize: 22, fontWeight: 600, letterSpacing: 4, textTransform: 'uppercase'}}>Hadji explainer</div>
      <div style={{fontSize: 68, fontWeight: 700, marginTop: 18, letterSpacing: -1.5}}>{title}</div>
      <div style={{fontSize: 28, color: C.mute, marginTop: 14}}>{sub}</div>
    </AbsoluteFill>
  );
};

type NodeProps = {
  x: number; y: number; w?: number; h?: number; label: string; sub?: string; icon?: string;
  at: number;          // appears
  doneAt?: number;     // turns green
  accent?: string;     // active colour (default orange)
};

/** A rounded panel box: appears, glows while active, turns green with a check when done. */
export const Box: React.FC<NodeProps> = ({x, y, w = 190, h = 110, label, sub, icon, at, doneAt = Infinity, accent = C.orange}) => {
  const f = useCurrentFrame();
  const p = useProgress(at, 14);
  if (f < at) return null;
  const done = f >= doneAt;
  const col = done ? C.green : accent;
  const pulse = done ? 0 : 0.5 + 0.5 * Math.sin((f - at) / 6);
  return (
    <div style={{
      position: 'absolute', left: x, top: y + (1 - p) * 14, width: w, height: h, opacity: p,
      transform: `scale(${0.94 + 0.06 * p})`, background: C.panel, borderRadius: 18,
      border: `2px solid ${col}`, boxShadow: `0 0 ${12 + 22 * pulse}px ${col}${done ? '33' : '55'}`,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4,
    }}>
      {icon && <div style={{fontSize: 30, lineHeight: 1}}>{icon}</div>}
      <div style={{fontSize: 24, fontWeight: 600}}>{label}</div>
      {sub && <div style={{fontSize: 16, color: C.mute}}>{sub}</div>}
      {done && (
        <div style={{position: 'absolute', top: -12, right: -12, width: 28, height: 28, borderRadius: 14,
          background: C.green, color: C.bg, fontWeight: 700, fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>✓</div>
      )}
    </div>
  );
};

/** Animated arrow along a polyline of [x,y] points. */
export const Arrow: React.FC<{pts: [number, number][]; at: number; dur?: number; color?: string}> = ({pts, at, dur = 18, color = C.mute}) => {
  const p = useProgress(at, dur);
  const useF = useCurrentFrame();
  if (useF < at) return null;
  const seg = pts.slice(1).map((q, i) => Math.hypot(q[0] - pts[i][0], q[1] - pts[i][1]));
  const len = seg.reduce((a, b) => a + b, 0);
  const d = pts.map((q, i) => `${i ? 'L' : 'M'}${q[0]} ${q[1]}`).join(' ');
  const [a, b] = [pts[pts.length - 2], pts[pts.length - 1]];
  const ang = (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI;
  return (
    <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none'}}>
      <path d={d} fill="none" stroke={color} strokeWidth={3} strokeLinejoin="round"
        strokeDasharray={len} strokeDashoffset={len * (1 - p)} />
      {p > 0.98 && <polygon points="0,-8 14,0 0,8" fill={color} transform={`translate(${b[0]} ${b[1]}) rotate(${ang})`} />}
    </svg>
  );
};

/** Mouse cursor that glides through keyframes {f,x,y}; `click` frames flash a ring. */
export const Cursor: React.FC<{path: {f: number; x: number; y: number}[]; clicks?: number[]}> = ({path, clicks = []}) => {
  const f = useCurrentFrame();
  if (f < path[0].f) return null;
  const fs = path.map((k) => k.f);
  const ease = {easing: Easing.inOut(Easing.cubic), extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
  const x = interpolate(f, fs, path.map((k) => k.x), ease);
  const y = interpolate(f, fs, path.map((k) => k.y), ease);
  const ring = clicks.map((c) => f - c).find((d) => d >= 0 && d < 14);
  return (
    <div style={{position: 'absolute', left: x, top: y, zIndex: 50}}>
      {ring !== undefined && (
        <div style={{position: 'absolute', left: -20, top: -20, width: 40, height: 40, borderRadius: 20,
          border: `3px solid ${C.orange}`, opacity: 1 - ring / 14, transform: `scale(${0.4 + ring / 14})`}} />
      )}
      <svg width="30" height="30" viewBox="0 0 24 24" style={{filter: 'drop-shadow(0 2px 4px #000a)'}}>
        <path d="M4 2l15 9-6.5 1.8L9 19z" fill="#fff" stroke="#111" strokeWidth="1.2" strokeLinejoin="round" />
      </svg>
    </div>
  );
};

/** Chat bubble (user = right/orange outline, agent = left/panel). Optional typing reveal. */
export const Bubble: React.FC<{x: number; y: number; w: number; text: string; at: number; who: 'you' | 'agent'; type?: boolean}> = ({x, y, w, text, at, who, type}) => {
  const f = useCurrentFrame();
  const p = useProgress(at, 10);
  if (f < at) return null;
  const shown = type ? text.slice(0, Math.floor((f - at) * 1.6)) : text;
  const you = who === 'you';
  return (
    <div style={{
      position: 'absolute', left: x, top: y + (1 - p) * 10, width: w, opacity: p, padding: '14px 18px', borderRadius: 18,
      background: you ? '#FF6B2C22' : C.panel, border: `1.5px solid ${you ? C.orange : C.line2}`,
      fontSize: 21, lineHeight: 1.35,
    }}>
      <div style={{fontSize: 13, fontWeight: 600, letterSpacing: 1.5, color: you ? C.orange : C.mute, textTransform: 'uppercase', marginBottom: 4}}>{you ? 'You' : 'Hadji agent'}</div>
      {shown}
    </div>
  );
};

/** Git-style branch lane: a labelled line with commit dots appearing over time. */
export const Branch: React.FC<{x: number; y: number; w: number; label: string; color?: string; at: number; dots?: number[]}> = ({x, y, w, label, color = C.blue, at, dots = []}) => {
  const f = useCurrentFrame();
  const p = useProgress(at, 20);
  if (f < at) return null;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: 30}}>
      <div style={{position: 'absolute', left: 0, top: 14, height: 3, width: w * p, background: color, borderRadius: 2}} />
      <div style={{position: 'absolute', left: 0, top: -26, fontFamily: mono, fontSize: 16, color}}>{label}</div>
      {dots.map((d, i) => f >= d && (
        <div key={i} style={{position: 'absolute', left: ((i + 1) / (dots.length + 1)) * w - 8, top: 7, width: 16, height: 16, borderRadius: 8, background: color, border: `3px solid ${C.bg}`}} />
      ))}
    </div>
  );
};

/** Lines of terminal-style output that appear one by one. */
export const Terminal: React.FC<{x: number; y: number; w: number; h: number; title: string; lines: {t: string; at: number; c?: string}[]; at: number; border?: string}> = ({x, y, w, h, title, lines, at, border = C.line2}) => {
  const f = useCurrentFrame();
  const p = useProgress(at, 12);
  if (f < at) return null;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, opacity: p, background: C.panel, borderRadius: 18, border: `2px dashed ${border}`, padding: 18, overflow: 'hidden'}}>
      <div style={{fontSize: 14, fontWeight: 600, letterSpacing: 1.5, color: C.mute, textTransform: 'uppercase', marginBottom: 10}}>{title}</div>
      {lines.map((l, i) => f >= l.at && (
        <div key={i} style={{fontFamily: mono, fontSize: 17, lineHeight: 1.6, color: l.c ?? C.fg, opacity: Math.min(1, (f - l.at) / 6)}}>{l.t}</div>
      ))}
    </div>
  );
};

export type Step = {from: number; caption: string};

/** Bottom caption bar + progress dots. Shows the caption of whichever step is current. */
export const Captions: React.FC<{steps: Step[]; end: number}> = ({steps, end}) => {
  const f = useCurrentFrame();
  const idx = steps.reduce((a, s, i) => (f >= s.from ? i : a), -1);
  if (idx < 0 || f >= end) return null;
  const s = steps[idx];
  const o = interpolate(f - s.from, [0, 10], [0, 1], {extrapolateRight: 'clamp'});
  return (
    <>
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 120, background: `linear-gradient(transparent, ${C.bg} 55%)`}} />
      <div style={{position: 'absolute', left: 60, right: 60, bottom: 38, textAlign: 'center', fontSize: 34, fontWeight: 500, opacity: o, transform: `translateY(${(1 - o) * 8}px)`}}>
        {s.caption}
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 14, display: 'flex', justifyContent: 'center', gap: 8}}>
        {steps.map((_, i) => (
          <div key={i} style={{width: i === idx ? 26 : 8, height: 6, borderRadius: 3, background: i <= idx ? C.orange : C.line2}} />
        ))}
      </div>
    </>
  );
};

export const Label: React.FC<{x: number; y: number; text: string; at: number; color?: string}> = ({x, y, text, at, color = C.mute}) => {
  const p = useProgress(at, 12);
  return <div style={{position: 'absolute', left: x, top: y, opacity: p, fontSize: 15, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', color}}>{text}</div>;
};
