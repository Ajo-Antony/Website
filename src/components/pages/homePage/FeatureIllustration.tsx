"use client";

/**
 * FeatureIllustration.tsx
 * ─────────────────────────────────────────────────────────────
 * Replaces the Unsplash stock photography previously used in the
 * "Why StrixMind" carousel. Every feature now gets a custom vector
 * scene built from one consistent visual language — glowing nodes
 * connected by thin curved lines — because that's literally the
 * mental model of the product (a routing/workflow graph), not a
 * generic office photo. No network requests, no licensing risk,
 * scales infinitely, matches the brand palette exactly.
 *
 * Each scene is a distinct arrangement so the ten cards read as
 * ten different things at a glance, not one template restyled.
 * ─────────────────────────────────────────────────────────────
 */

import React from "react";

const NODE = "#5eead4";     // --accent (teal)
const NODE_2 = "#a78bfa";   // --accent-2 (violet)
const NODE_3 = "#f59e6b";   // --accent-rose (orange)
const LINE = "rgba(255,255,255,0.16)";
const LINE_LIT = "rgba(94,234,212,0.55)";
const GRID = "rgba(255,255,255,0.05)";

function Scene({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 420 525" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <pattern id="fi-grid" width="28" height="28" patternUnits="userSpaceOnUse">
          <path d="M28 0H0V28" fill="none" stroke={GRID} strokeWidth="1" />
        </pattern>
        <radialGradient id="fi-glow" cx="50%" cy="42%" r="65%">
          <stop offset="0%" stopColor="#1c1c26" />
          <stop offset="100%" stopColor="#0e0e12" />
        </radialGradient>
        <filter id="fi-blur"><feGaussianBlur stdDeviation="6" /></filter>
      </defs>
      <rect width="420" height="525" fill="url(#fi-glow)" />
      <rect width="420" height="525" fill="url(#fi-grid)" />
      {children}
    </svg>
  );
}

function Node({ cx, cy, r = 6, fill = NODE, glow = true }: { cx: number; cy: number; r?: number; fill?: string; glow?: boolean }) {
  return (
    <g>
      {glow && <circle cx={cx} cy={cy} r={r * 2.6} fill={fill} opacity={0.18} filter="url(#fi-blur)" />}
      <circle cx={cx} cy={cy} r={r} fill={fill} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth="1" />
    </g>
  );
}

function Link({ d, lit = false }: { d: string; lit?: boolean }) {
  return <path d={d} fill="none" stroke={lit ? LINE_LIT : LINE} strokeWidth={lit ? 1.6 : 1.2} />;
}

// ── workflow: a branching flow graph ──────────────────────────
const Workflow = () => (
  <Scene>
    <Link d="M90 460 C90 380 150 360 150 300" />
    <Link d="M150 300 C150 240 90 220 90 160" />
    <Link d="M150 300 C150 240 220 220 220 160" lit />
    <Link d="M220 160 C220 110 280 95 280 60" lit />
    <Node cx={90} cy={460} r={7} fill={NODE_2} />
    <Node cx={150} cy={300} r={9} />
    <Node cx={90} cy={160} r={6} fill={NODE_3} />
    <Node cx={220} cy={160} r={7} />
    <Node cx={280} cy={60} r={8} fill={NODE_2} />
    <rect x={60} y={434} width={60} height={26} rx={13} fill="none" stroke="rgba(255,255,255,0.25)" />
  </Scene>
);

// ── multi-agent: nodes orbiting a core ────────────────────────
const MultiAgent = () => (
  <Scene>
    <circle cx={210} cy={230} r={110} fill="none" stroke={LINE} strokeDasharray="2 6" />
    <Link d="M210 230 L120 150" lit />
    <Link d="M210 230 L300 150" />
    <Link d="M210 230 L305 300" lit />
    <Link d="M210 230 L130 320" />
    <Link d="M210 230 L210 100" />
    <Node cx={210} cy={230} r={14} fill={NODE} />
    <Node cx={120} cy={150} r={7} fill={NODE_2} />
    <Node cx={300} cy={150} r={6} fill={NODE_3} />
    <Node cx={305} cy={300} r={7} fill={NODE_2} />
    <Node cx={130} cy={320} r={6} />
    <Node cx={210} cy={100} r={6} fill={NODE_3} />
  </Scene>
);

// ── whatsapp: message bubbles flowing down a pipeline ─────────
const WhatsappScene = () => (
  <Scene>
    <Link d="M210 70 L210 460" />
    <rect x={140} y={90} width={140} height={40} rx={20} fill="rgba(94,234,212,0.14)" stroke={NODE} />
    <rect x={110} y={165} width={150} height={40} rx={20} fill="rgba(167,139,250,0.14)" stroke={NODE_2} />
    <rect x={150} y={240} width={140} height={40} rx={20} fill="rgba(94,234,212,0.14)" stroke={NODE} />
    <path d="M300 268 l10 10 l16 -20" fill="none" stroke={NODE} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
    <rect x={120} y={315} width={150} height={40} rx={20} fill="rgba(245,158,107,0.14)" stroke={NODE_3} />
    <Node cx={210} cy={410} r={10} fill={NODE} />
  </Scene>
);

// ── analytics: bars climbing with a trend line ────────────────
const Analytics = () => (
  <Scene>
    {[
      { x: 90, h: 60 }, { x: 140, h: 100 }, { x: 190, h: 80 },
      { x: 240, h: 150 }, { x: 290, h: 210 },
    ].map((b) => (
      <rect key={b.x} x={b.x} y={430 - b.h} width={34} height={b.h} rx={6} fill="rgba(94,234,212,0.16)" stroke={NODE} />
    ))}
    <Link d="M100 400 L155 340 L205 360 L255 260 L305 190" lit />
    <Node cx={100} cy={400} r={5} />
    <Node cx={155} cy={340} r={5} fill={NODE_2} />
    <Node cx={205} cy={360} r={5} />
    <Node cx={255} cy={260} r={5} fill={NODE_3} />
    <Node cx={305} cy={190} r={7} fill={NODE} />
  </Scene>
);

// ── integrations: hub and spoke ────────────────────────────────
const Integrations = () => (
  <Scene>
    <Link d="M210 260 L120 180" />
    <Link d="M210 260 L300 180" lit />
    <Link d="M210 260 L300 340" />
    <Link d="M210 260 L120 340" lit />
    <rect x={185} y={235} width={50} height={50} rx={12} fill="rgba(94,234,212,0.16)" stroke={NODE} strokeWidth={1.6} />
    {[[120, 180, NODE_2], [300, 180, NODE_3], [300, 340, NODE_2], [120, 340, NODE_3]].map(([x, y, c], i) => (
      <rect key={i} x={(x as number) - 18} y={(y as number) - 18} width={36} height={36} rx={10} fill="rgba(255,255,255,0.03)" stroke={c as string} />
    ))}
  </Scene>
);

// ── security: shield built from a grid of small nodes ──────────
const Security = () => (
  <Scene>
    <path d="M210 90 L300 125 V255 C300 340 260 390 210 415 C160 390 120 340 120 255 V125 Z"
      fill="rgba(94,234,212,0.06)" stroke={NODE} strokeWidth={1.6} />
    <path d="M175 250 L200 280 L255 205" fill="none" stroke={NODE} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
    <Node cx={210} cy={90} r={5} fill={NODE_2} glow={false} />
    <Node cx={300} cy={125} r={5} fill={NODE_3} glow={false} />
    <Node cx={120} cy={125} r={5} fill={NODE_3} glow={false} />
  </Scene>
);

// ── speed: a bolt cutting across the node field ─────────────────
const Speed = () => (
  <Scene>
    <Link d="M110 120 L200 120 L160 240 L260 240 L150 420" lit />
    <Node cx={110} cy={120} r={6} fill={NODE_2} />
    <Node cx={200} cy={120} r={5} />
    <Node cx={160} cy={240} r={6} fill={NODE_3} />
    <Node cx={260} cy={240} r={5} />
    <Node cx={150} cy={420} r={9} fill={NODE} />
  </Scene>
);

// ── global: a graticule sphere with lit hubs ────────────────────
const GlobalScene = () => (
  <Scene>
    <ellipse cx={210} cy={260} rx={120} ry={120} fill="none" stroke={LINE} />
    <ellipse cx={210} cy={260} rx={120} ry={44} fill="none" stroke={LINE} />
    <ellipse cx={210} cy={260} rx={60} ry={120} fill="none" stroke={LINE} />
    <ellipse cx={210} cy={260} rx={120} ry={80} fill="none" stroke={LINE} />
    <Node cx={160} cy={200} r={6} fill={NODE} />
    <Node cx={260} cy={230} r={5} fill={NODE_3} />
    <Node cx={200} cy={310} r={7} fill={NODE_2} />
    <Node cx={280} cy={300} r={5} fill={NODE} />
    <Link d="M160 200 C190 250 200 260 200 310" lit />
    <Link d="M260 230 C270 260 280 280 280 300" />
  </Scene>
);

// ── team: linked avatar rings ─────────────────────────────────
const Team = () => (
  <Scene>
    <Link d="M150 220 L270 220" lit />
    <Link d="M150 220 L210 340" />
    <Link d="M270 220 L210 340" lit />
    <circle cx={150} cy={220} r={30} fill="rgba(167,139,250,0.14)" stroke={NODE_2} strokeWidth={1.6} />
    <circle cx={270} cy={220} r={30} fill="rgba(94,234,212,0.14)" stroke={NODE} strokeWidth={1.6} />
    <circle cx={210} cy={340} r={30} fill="rgba(245,158,107,0.14)" stroke={NODE_3} strokeWidth={1.6} />
  </Scene>
);

// ── mobile: a phone frame with chat + trend lines inside ────────
const Mobile = () => (
  <Scene>
    <rect x={140} y={80} width={140} height={280} rx={26} fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.25)" strokeWidth={2} />
    <rect x={162} y={112} width={96} height={22} rx={11} fill="rgba(94,234,212,0.16)" stroke={NODE} />
    <rect x={162} y={146} width={70} height={22} rx={11} fill="rgba(167,139,250,0.16)" stroke={NODE_2} />
    <path d="M162 200 L190 220 L215 190 L240 235 L258 205" fill="none" stroke={NODE} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Node cx={210} cy={382} r={6} fill={NODE_3} />
  </Scene>
);

const SCENES: Record<string, React.FC> = {
  workflow: Workflow,
  "multi-agent": MultiAgent,
  whatsapp: WhatsappScene,
  analytics: Analytics,
  integrations: Integrations,
  security: Security,
  speed: Speed,
  global: GlobalScene,
  team: Team,
  mobile: Mobile,
};

export function FeatureIllustration({ id }: { id: string }) {
  const SceneComp = SCENES[id] ?? Workflow;
  return <SceneComp />;
}

export default FeatureIllustration;
