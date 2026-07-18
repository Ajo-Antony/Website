import { CONTENT_DEFAULTS } from "@/lib/cms/registry";
import {
  MousePointerClick,
  Bot,
  Users,
  Zap,
  Puzzle,
  TrendingUp,
} from "lucide-react";

interface ServiceItem { icon: string; title: string; desc: string; image?: string }
interface ServicesListProps { items?: ServiceItem[] }
const D = CONTENT_DEFAULTS["services.list"] as Required<ServicesListProps>;

function getServiceIcon(title: string) {
  const t = title.toLowerCase();
  if (t.includes("crm")) return Users;
  if (t.includes("whatsapp") || t.includes("chat")) return Bot;
  if (t.includes("campaign") || t.includes("outreach")) return Zap;
  if (t.includes("lead") || t.includes("prospect")) return MousePointerClick;
  if (t.includes("workflow") || t.includes("agent")) return Puzzle;
  return TrendingUp;
}

// Inline SVG illustrations for each service (shown when no image URL is set)
function ServiceIllustration({ index }: { index: number }) {
  const illustrations = [
    // 0: AI Agents — robot brain with connections
    <svg key={0} viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <rect width="320" height="200" fill="rgba(108,99,255,0.04)" />
      <circle cx="160" cy="100" r="44" fill="var(--glass-bg)" stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="4 3"/>
      <circle cx="160" cy="100" r="26" fill="var(--border)" stroke="var(--accent-2)" strokeWidth="1.5"/>
      <circle cx="160" cy="100" r="10" fill="var(--accent)"/>
      {/* nodes */}
      {[[60,52],[260,52],[60,148],[260,148],[100,28],[220,28],[100,172],[220,172]].map(([x,y],i)=>(
        <g key={i}>
          <line x1={x} y1={y} x2="160" y2="100" stroke="rgba(108,99,255,0.2)" strokeWidth="1"/>
          <circle cx={x} cy={y} r="7" fill="var(--surface)" stroke="var(--accent)" strokeWidth="1.5"/>
          <circle cx={x} cy={y} r="3" fill="var(--accent)"/>
        </g>
      ))}
      <text x="160" y="104" textAnchor="middle" fontSize="9" fontWeight="700" fill="var(--surface)" fontFamily="monospace">AI</text>
    </svg>,

    // 1: Workflow Automation — node flow chart
    <svg key={1} viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <rect width="320" height="200" fill="rgba(108,99,255,0.04)" />
      {/* Trigger */}
      <rect x="20" y="84" width="56" height="32" rx="8" fill="var(--border)" stroke="var(--accent)" strokeWidth="1.5"/>
      <text x="48" y="104" textAnchor="middle" fontSize="8" fill="var(--accent)" fontWeight="700" fontFamily="monospace">TRIGGER</text>
      {/* arrow */}
      <line x1="76" y1="100" x2="104" y2="100" stroke="var(--accent)" strokeWidth="1.5" markerEnd="url(#arr)"/>
      {/* Condition diamond */}
      <polygon points="120,84 152,100 120,116 88,100" fill="rgba(167,139,250,0.15)" stroke="var(--accent-2)" strokeWidth="1.5" transform="translate(16,0)"/>
      <text x="136" y="104" textAnchor="middle" fontSize="7" fill="var(--accent-2)" fontWeight="700" fontFamily="monospace">IF</text>
      {/* Yes path top */}
      <line x1="152" y1="88" x2="152" y2="58" stroke="var(--accent)" strokeWidth="1.5"/>
      <line x1="152" y1="58" x2="200" y2="58" stroke="var(--accent)" strokeWidth="1.5" markerEnd="url(#arr)"/>
      <rect x="200" y="44" width="56" height="28" rx="8" fill="rgba(34,197,94,0.1)" stroke="#22c55e" strokeWidth="1.5"/>
      <text x="228" y="62" textAnchor="middle" fontSize="8" fill="#22c55e" fontWeight="700" fontFamily="monospace">ACTION A</text>
      {/* No path bottom */}
      <line x1="152" y1="112" x2="152" y2="142" stroke="var(--accent)" strokeWidth="1.5"/>
      <line x1="152" y1="142" x2="200" y2="142" stroke="var(--accent)" strokeWidth="1.5" markerEnd="url(#arr)"/>
      <rect x="200" y="128" width="56" height="28" rx="8" fill="rgba(14,165,233,0.1)" stroke="var(--accent-teal)" strokeWidth="1.5"/>
      <text x="228" y="146" textAnchor="middle" fontSize="8" fill="var(--accent-teal)" fontWeight="700" fontFamily="monospace">ACTION B</text>
      {/* merge and end */}
      <line x1="256" y1="58" x2="286" y2="58" stroke="var(--accent)" strokeWidth="1.5"/>
      <line x1="286" y1="58" x2="286" y2="100" stroke="var(--accent)" strokeWidth="1.5"/>
      <line x1="256" y1="142" x2="286" y2="142" stroke="var(--accent)" strokeWidth="1.5"/>
      <line x1="286" y1="142" x2="286" y2="100" stroke="var(--accent)" strokeWidth="1.5"/>
      <circle cx="286" cy="100" r="10" fill="var(--accent)"/>
      <text x="286" y="104" textAnchor="middle" fontSize="9" fill="var(--surface)" fontWeight="700">✓</text>
      <defs>
        <marker id="arr" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
          <path d="M0,0 L0,6 L6,3 z" fill="var(--accent)"/>
        </marker>
      </defs>
    </svg>,

    // 2: Intelligent CRM — pipeline stages
    <svg key={2} viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <rect width="320" height="200" fill="rgba(108,99,255,0.04)" />
      {[["Lead","var(--accent)",20],["Qualify","#8b5cf6",74],["Proposal","var(--accent-teal)",128],["Closed","#22c55e",182]].map(([label,color,x],i)=>(
        <g key={i}>
          <rect x={x as number} y="60" width="50" height="80" rx="8" fill={`${color as string}18`} stroke={color as string} strokeWidth="1.5"/>
          <text x={(x as number)+25} y="82" textAnchor="middle" fontSize="7" fill={color as string} fontWeight="700" fontFamily="monospace">{label as string}</text>
          {[100,120,140].map((y,j)=>(
            <rect key={j} x={(x as number)+6} y={y} width="38" height="10" rx="4" fill={`${color as string}30`} stroke={`${color as string}60`} strokeWidth="1"/>
          ))}
          {i<3 && <path d={`M${(x as number)+50},100 L${(x as number)+60},100`} stroke={color as string} strokeWidth="1.5" markerEnd="url(#crmarr)"/>}
        </g>
      ))}
      <text x="160" y="32" textAnchor="middle" fontSize="9" fill="var(--text-dim)" fontWeight="700" fontFamily="monospace" letterSpacing="2">PIPELINE · AI SCORED</text>
      <defs>
        <marker id="crmarr" markerWidth="5" markerHeight="5" refX="2.5" refY="2.5" orient="auto">
          <path d="M0,0 L0,5 L5,2.5 z" fill="var(--accent)"/>
        </marker>
      </defs>
    </svg>,

    // 3: WhatsApp Automation — chat bubbles
    <svg key={3} viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <rect width="320" height="200" fill="rgba(108,99,255,0.04)" />
      <rect x="60" y="20" width="200" height="160" rx="20" fill="var(--surface)" stroke="var(--border)" strokeWidth="1.5"/>
      {/* WA top bar */}
      <rect x="60" y="20" width="200" height="36" rx="20" fill="#25D366"/>
      <rect x="60" y="40" width="200" height="16" fill="#25D366"/>
      <circle cx="88" cy="38" r="12" fill="rgba(255,255,255,0.25)"/>
      <text x="110" y="43" fontSize="9" fill="var(--surface)" fontWeight="700">StrixMind Bot</text>
      <circle cx="236" cy="38" r="5" fill="#a8f5c9"/>
      {/* chat bubbles */}
      <rect x="80" y="68" width="120" height="24" rx="10" fill="#dcf8c6"/>
      <text x="140" y="84" textAnchor="middle" fontSize="8" fill="var(--text)">Hi! How can I help you?</text>
      <rect x="116" y="100" width="140" height="24" rx="10" fill="#f4f2fe"/>
      <text x="186" y="116" textAnchor="middle" fontSize="8" fill="var(--text)">I want to book a demo</text>
      <rect x="80" y="132" width="130" height="24" rx="10" fill="#dcf8c6"/>
      <text x="145" y="148" textAnchor="middle" fontSize="8" fill="var(--text)">Sure! Picking a slot...</text>
      {/* typing indicator */}
      {[100,112,124].map((x,i)=>(
        <circle key={i} cx={x} cy="170" r="4" fill="rgba(108,99,255,0.3)"/>
      ))}
    </svg>,

    // 4: Revenue Analytics — bar chart
    <svg key={4} viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <rect width="320" height="200" fill="rgba(108,99,255,0.04)" />
      <line x1="48" y1="20" x2="48" y2="160" stroke="var(--border)" strokeWidth="1.5"/>
      <line x1="48" y1="160" x2="300" y2="160" stroke="var(--border)" strokeWidth="1.5"/>
      {[0,1,2,3].map(i=>(
        <line key={i} x1="48" y1={160-i*35} x2="300" y2={160-i*35} stroke="var(--border)" strokeWidth="1" strokeDasharray="4 3"/>
      ))}
      {[["Q1",80,"var(--accent)"],["Q2",110,"#8b5cf6"],["Q3",95,"var(--accent-teal)"],["Q4",140,"#22c55e"]].map(([label,h,color],i)=>(
        <g key={i}>
          <rect x={68+i*54} y={160-(h as number)} width="36" height={h as number} rx="6"
            fill={`url(#grad${i})`}/>
          <text x={68+i*54+18} y="175" textAnchor="middle" fontSize="9" fill="var(--text-dim)" fontFamily="monospace">{label as string}</text>
          <text x={68+i*54+18} y={160-(h as number)-6} textAnchor="middle" fontSize="8" fill={color as string} fontWeight="700" fontFamily="monospace">{`₹${(h as number)*1.2|0}L`}</text>
          <defs>
            <linearGradient id={`grad${i}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color as string} stopOpacity="0.9"/>
              <stop offset="100%" stopColor={color as string} stopOpacity="0.3"/>
            </linearGradient>
          </defs>
        </g>
      ))}
      {/* trend line */}
      <polyline points="86,120 140,90 194,105 248,60" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="5 3"/>
    </svg>,

    // 5: Campaign Outreach — multi-channel rings
    <svg key={5} viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <rect width="320" height="200" fill="rgba(108,99,255,0.04)" />
      <circle cx="160" cy="100" r="60" fill="none" stroke="rgba(108,99,255,0.1)" strokeWidth="1" strokeDasharray="6 4"/>
      <circle cx="160" cy="100" r="40" fill="none" stroke="rgba(108,99,255,0.15)" strokeWidth="1" strokeDasharray="4 3"/>
      <circle cx="160" cy="100" r="20" fill="var(--border)" stroke="var(--accent)" strokeWidth="1.5"/>
      <text x="160" y="104" textAnchor="middle" fontSize="9" fill="var(--accent)" fontWeight="700" fontFamily="monospace">AI</text>
      {/* channel nodes */}
      {[
        [160,36,"EMAIL","var(--accent-teal)"],
        [218,68,"SMS","#f59e0b"],
        [218,132,"SOCIAL","#f472b6"],
        [102,132,"WA","#25D366"],
        [102,68,"PUSH","#8b5cf6"],
      ].map(([x,y,label,color],i)=>(
        <g key={i}>
          <line x1={x as number} y1={y as number} x2="160" y2="100" stroke={color as string} strokeWidth="1" strokeOpacity="0.5"/>
          <circle cx={x as number} cy={y as number} r="18" fill="var(--surface)" stroke={color as string} strokeWidth="1.5"/>
          <text x={x as number} y={(y as number)+4} textAnchor="middle" fontSize="7" fill={color as string} fontWeight="700" fontFamily="monospace">{label as string}</text>
        </g>
      ))}
    </svg>,
  ];
  return illustrations[index % illustrations.length];
}

export default function ServicesListSectionPage({ items = D.items }: ServicesListProps) {
  return (
    <section style={{ background: "var(--surface)", borderTop: "1px solid var(--border)" }} className="py-16 sm:py-24">
      <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", flexDirection: "column" as const, gap: "3rem" }} className="px-5 sm:px-8 sm:gap-16">
        {items.map((s, i) => {
          const Icon = getServiceIcon(s.title);
          const reversed = i % 2 !== 0;
          return (
          <div
            key={s.title}
            className="grid grid-cols-1 sm:grid-cols-2 items-center gap-6 sm:gap-12"
            style={reversed ? { direction: "rtl" as React.CSSProperties["direction"] } : undefined}
          >
            <div style={{ direction: "ltr" as const }}>
              <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: "var(--shadow-strong)", marginBottom: "1rem" }}>{String(i + 1).padStart(2, "0")}</div>
              <h3 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--text)", marginBottom: "1rem", letterSpacing: "-0.03em", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <Icon size={28} color="var(--accent)" strokeWidth={1.6} />
                {s.title}
              </h3>
              <p style={{ fontSize: "1rem", color: "var(--text-muted)", lineHeight: 1.8 }}>{s.desc}</p>
            </div>
            <div style={{ direction: "ltr" as const, height: 240, borderRadius: 20, overflow: "hidden", background: s.image ? undefined : "rgba(108,99,255,0.03)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {s.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={s.image} alt={s.title} loading="lazy" decoding="async" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <ServiceIllustration index={i} />
              )}
            </div>
          </div>
          );
        })}
      </div>
    </section>
  );
}
