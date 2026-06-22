"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Workflow,
  Brain,
  MessageSquareText,
  BarChart,
  PlugIcon,
  Shield,
  Zap,
  Globe,
  Users,
  Smartphone,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────
// Inline SVG illustrations — no external image dependency
// ─────────────────────────────────────────────────────────

function IllustrationWorkflow() {
  return (
    <svg viewBox="0 0 480 600" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <rect width="480" height="600" fill="#f0eeff"/>
      <rect x="30" y="30" width="420" height="540" rx="28" fill="white" opacity="0.6"/>
      {/* nodes */}
      {[
        [240,90,"TRIGGER","#6c63ff"],
        [130,210,"CONDITION","#a78bfa"],
        [350,210,"CONDITION","#a78bfa"],
        [80,340,"ACTION","#22c55e"],
        [200,340,"ACTION","#0ea5e9"],
        [320,340,"ACTION","#f59e0b"],
        [440,340,"ACTION","#f472b6"],
        [240,470,"MERGE","#6c63ff"],
      ].map(([x,y,label,color],i) => (
        <g key={i}>
          <rect x={(x as number)-52} y={(y as number)-20} width="104" height="40" rx="12"
            fill={`${color as string}18`} stroke={color as string} strokeWidth="1.8"/>
          <text x={x as number} y={(y as number)+5} textAnchor="middle" fontSize="9"
            fill={color as string} fontWeight="700" fontFamily="monospace">{label as string}</text>
        </g>
      ))}
      {/* connectors */}
      {[
        [240,110,130,190],[240,110,350,190],
        [130,230,80,320],[130,230,200,320],
        [350,230,320,320],[350,230,440,320],
        [80,360,240,450],[200,360,240,450],[320,360,240,450],[440,360,240,450],
      ].map(([x1,y1,x2,y2],i)=>(
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
          stroke="rgba(108,99,255,0.25)" strokeWidth="1.5" strokeDasharray="5 3"/>
      ))}
      <text x="240" y="545" textAnchor="middle" fontSize="10" fill="#9b8fcc" fontFamily="monospace" fontWeight="700" letterSpacing="3">WORKFLOW ENGINE</text>
    </svg>
  );
}

function IllustrationMultiAgent() {
  return (
    <svg viewBox="0 0 480 600" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <rect width="480" height="600" fill="#e8f4ff"/>
      <rect x="30" y="30" width="420" height="540" rx="28" fill="white" opacity="0.5"/>
      {/* Central AI hub */}
      <circle cx="240" cy="290" r="58" fill="rgba(14,165,233,0.12)" stroke="#0ea5e9" strokeWidth="2"/>
      <circle cx="240" cy="290" r="36" fill="rgba(14,165,233,0.18)" stroke="#38bdf8" strokeWidth="1.5"/>
      <circle cx="240" cy="290" r="18" fill="#0ea5e9"/>
      <text x="240" y="295" textAnchor="middle" fontSize="10" fill="white" fontWeight="800" fontFamily="monospace">CORE</text>
      {/* Agent nodes */}
      {[
        [240,100,"SALES","#6c63ff"],
        [390,185,"SUPPORT","#f59e0b"],
        [390,395,"ANALYST","#22c55e"],
        [240,480,"OUTREACH","#f472b6"],
        [90,395,"QUALIFIER","#8b5cf6"],
        [90,185,"SCHEDULER","#0ea5e9"],
      ].map(([x,y,label,color],i)=>(
        <g key={i}>
          <line x1={x as number} y1={y as number} x2="240" y2="290"
            stroke={`${color as string}50`} strokeWidth="1.5" strokeDasharray="6 4"/>
          <circle cx={x as number} cy={y as number} r="30"
            fill={`${color as string}15`} stroke={color as string} strokeWidth="1.8"/>
          <text x={x as number} y={(y as number)+4} textAnchor="middle" fontSize="8"
            fill={color as string} fontWeight="700" fontFamily="monospace">{label as string}</text>
        </g>
      ))}
    </svg>
  );
}

function IllustrationWhatsApp() {
  return (
    <svg viewBox="0 0 480 600" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <rect width="480" height="600" fill="#e8fff2"/>
      <rect x="80" y="40" width="320" height="520" rx="36" fill="white" stroke="#dcf8c6" strokeWidth="2"/>
      {/* WA header */}
      <rect x="80" y="40" width="320" height="70" rx="36" fill="#25D366"/>
      <rect x="80" y="80" width="320" height="30" fill="#25D366"/>
      <circle cx="126" cy="75" r="22" fill="rgba(255,255,255,0.2)"/>
      <text x="168" y="80" fontSize="13" fill="white" fontWeight="800">StrixMind AI</text>
      <text x="168" y="97" fontSize="9" fill="rgba(255,255,255,0.8)">● Online</text>
      {/* Messages */}
      {[
        [100,140,260,"Hi! I saw your ad about AI tools 👋","left","#f0fdf4","#1a1333"],
        [120,195,240,"Great! I&apos;m StrixMind&apos;s AI. What does your business do?","right","#dcf8c6","#1a1333"],
        [100,250,200,"We run a clothing brand, 50+ orders/day","left","#f0fdf4","#1a1333"],
        [120,305,220,"Perfect fit! Let me qualify your lead score... ✨","right","#dcf8c6","#1a1333"],
        [120,360,180,"Score: 94/100 🎯 Routing to sales team","right","#dcf8c6","#6c63ff"],
      ].map(([x,y,w,text,dir,bg,textColor],i)=>(
        <g key={i}>
          <rect x={x as number} y={y as number} width={w as number} height="36"
            rx="14" fill={bg as string}/>
          <text x={(x as number)+12} y={(y as number)+22} fontSize="8.5"
            fill={textColor as string} fontFamily="sans-serif">{text as string}</text>
        </g>
      ))}
      {/* Typing indicator */}
      {[140,156,172].map((cx,i)=>(
        <circle key={i} cx={cx} cy="430" r="5" fill="rgba(37,211,102,0.4)"/>
      ))}
    </svg>
  );
}

function IllustrationAnalytics() {
  return (
    <svg viewBox="0 0 480 600" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <rect width="480" height="600" fill="#f5f0ff"/>
      <rect x="30" y="30" width="420" height="540" rx="28" fill="white" opacity="0.6"/>
      {/* Chart axes */}
      <line x1="70" y1="80" x2="70" y2="430" stroke="#e0d8ff" strokeWidth="2"/>
      <line x1="70" y1="430" x2="430" y2="430" stroke="#e0d8ff" strokeWidth="2"/>
      {/* Grid lines */}
      {[150,220,290,360].map((y,i)=>(
        <line key={i} x1="70" y1={y} x2="430" y2={y} stroke="#f0eeff" strokeWidth="1" strokeDasharray="4 3"/>
      ))}
      {/* Bars */}
      {[[110,200,"#6c63ff","Q1","₹96L"],[190,280,"#8b5cf6","Q2","₹132L"],[270,240,"#0ea5e9","Q3","₹114L"],[350,350,"#22c55e","Q4","₹168L"]].map(([x,h,color,label,val],i)=>(
        <g key={i}>
          <defs>
            <linearGradient id={`bg${i}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color as string} stopOpacity="0.9"/>
              <stop offset="100%" stopColor={color as string} stopOpacity="0.35"/>
            </linearGradient>
          </defs>
          <rect x={(x as number)-26} y={430-(h as number)} width="52" height={h as number}
            rx="8" fill={`url(#bg${i})`}/>
          <text x={x as number} y="450" textAnchor="middle" fontSize="10" fill="#9b8fcc" fontFamily="monospace">{label as string}</text>
          <text x={x as number} y={430-(h as number)-8} textAnchor="middle" fontSize="9"
            fill={color as string} fontWeight="700" fontFamily="monospace">{val as string}</text>
        </g>
      ))}
      {/* Trend line */}
      <polyline points="84,280 164,200 244,220 324,130" fill="none"
        stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="7 4"/>
      {[84,280,164,200,244,220,324,130].reduce((acc,_,i,arr)=>i%2===0?[...acc,[arr[i],arr[i+1]]]:acc,[] as number[][]).map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r="5" fill="#f59e0b" stroke="white" strokeWidth="2"/>
      ))}
      <text x="240" y="510" textAnchor="middle" fontSize="11" fill="#6c63ff" fontFamily="monospace" fontWeight="700" letterSpacing="2">LIVE REVENUE INTELLIGENCE</text>
    </svg>
  );
}

function IllustrationIntegrations() {
  return (
    <svg viewBox="0 0 480 600" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <rect width="480" height="600" fill="#fff8f0"/>
      <rect x="30" y="30" width="420" height="540" rx="28" fill="white" opacity="0.5"/>
      {/* Center hub */}
      <circle cx="240" cy="300" r="48" fill="rgba(245,158,11,0.12)" stroke="#f59e0b" strokeWidth="2"/>
      <circle cx="240" cy="300" r="28" fill="rgba(245,158,11,0.2)" stroke="#f59e0b" strokeWidth="1.5"/>
      <text x="240" y="305" textAnchor="middle" fontSize="11" fill="#f59e0b" fontWeight="800" fontFamily="monospace">HUB</text>
      {/* Integration nodes */}
      {[
        [240,110,"HUBSPOT","#f97316"],
        [390,200,"GMAIL","#ea4335"],
        [390,400,"APOLLO","#6c63ff"],
        [240,490,"WHATSAPP","#25D366"],
        [90,400,"STRIPE","#635bff"],
        [90,200,"CALENDAR","#0ea5e9"],
      ].map(([x,y,label,color],i)=>(
        <g key={i}>
          <line x1={x as number} y1={y as number} x2="240" y2="300"
            stroke={`${color as string}40`} strokeWidth="2" strokeDasharray="8 5"/>
          <rect x={(x as number)-42} y={(y as number)-18} width="84" height="36" rx="14"
            fill={`${color as string}15`} stroke={color as string} strokeWidth="1.8"/>
          <text x={x as number} y={(y as number)+5} textAnchor="middle" fontSize="9"
            fill={color as string} fontWeight="700" fontFamily="monospace">{label as string}</text>
        </g>
      ))}
    </svg>
  );
}

function IllustrationSecurity() {
  return (
    <svg viewBox="0 0 480 600" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <rect width="480" height="600" fill="#f0fdf4"/>
      <rect x="30" y="30" width="420" height="540" rx="28" fill="white" opacity="0.5"/>
      {/* Shield */}
      <path d="M240 80 L370 140 L370 290 Q370 400 240 460 Q110 400 110 290 L110 140 Z"
        fill="rgba(34,197,94,0.08)" stroke="#22c55e" strokeWidth="2"/>
      <path d="M240 110 L348 162 L348 285 Q348 380 240 432 Q132 380 132 285 L132 162 Z"
        fill="rgba(34,197,94,0.12)" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="6 3"/>
      {/* Lock icon */}
      <rect x="210" y="250" width="60" height="50" rx="10" fill="#22c55e"/>
      <path d="M222 250 L222 236 Q222 218 240 218 Q258 218 258 236 L258 250"
        fill="none" stroke="#22c55e" strokeWidth="4" strokeLinecap="round"/>
      <circle cx="240" cy="275" r="8" fill="white"/>
      {/* Check marks */}
      {["AES-256 ENCRYPTED","ROLE-BASED ACCESS","AUDIT LOGS","GDPR COMPLIANT"].map((label,i)=>(
        <g key={i}>
          <circle cx="148" cy={340+i*36} r="10" fill="rgba(34,197,94,0.15)" stroke="#22c55e" strokeWidth="1.5"/>
          <text x="148" y={344+i*36} textAnchor="middle" fontSize="9" fill="#22c55e" fontWeight="700">✓</text>
          <text x="168" y={344+i*36} fontSize="9" fill="#166534" fontFamily="monospace" fontWeight="600">{label}</text>
        </g>
      ))}
    </svg>
  );
}

function IllustrationSpeed() {
  return (
    <svg viewBox="0 0 480 600" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <rect width="480" height="600" fill="#fffbeb"/>
      <rect x="30" y="30" width="420" height="540" rx="28" fill="white" opacity="0.5"/>
      {/* Speedometer arc */}
      <path d="M100 340 A140 140 0 0 1 380 340" fill="none" stroke="#f0e6cc" strokeWidth="20" strokeLinecap="round"/>
      <path d="M100 340 A140 140 0 0 1 380 340" fill="none" stroke="url(#speedGrad)" strokeWidth="20" strokeLinecap="round" strokeDasharray="380 440" strokeDashoffset="0"/>
      <defs>
        <linearGradient id="speedGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#22c55e"/>
          <stop offset="60%" stopColor="#f59e0b"/>
          <stop offset="100%" stopColor="#ef4444"/>
        </linearGradient>
      </defs>
      {/* Needle */}
      <line x1="240" y1="340" x2="340" y2="200" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round"/>
      <circle cx="240" cy="340" r="16" fill="#f59e0b"/>
      <circle cx="240" cy="340" r="8" fill="white"/>
      {/* Labels */}
      {["0ms","50ms","100ms","200ms"].map((label,i)=>(
        <text key={i} x={105+i*92} y="375" textAnchor="middle" fontSize="10" fill="#92400e" fontFamily="monospace" fontWeight="600">{label}</text>
      ))}
      <text x="240" y="430" textAnchor="middle" fontSize="36" fill="#f59e0b" fontWeight="800" fontFamily="monospace">42ms</text>
      <text x="240" y="460" textAnchor="middle" fontSize="11" fill="#92400e" fontFamily="monospace" letterSpacing="2">AVG RESPONSE TIME</text>
      {/* Lightning bolts */}
      {[[150,120],[240,100],[330,120]].map(([x,y],i)=>(
        <text key={i} x={x} y={y} textAnchor="middle" fontSize="28" fill="rgba(245,158,11,0.3)">⚡</text>
      ))}
    </svg>
  );
}

function IllustrationGlobal() {
  return (
    <svg viewBox="0 0 480 600" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <rect width="480" height="600" fill="#eff6ff"/>
      <rect x="30" y="30" width="420" height="540" rx="28" fill="white" opacity="0.5"/>
      {/* Globe outline */}
      <circle cx="240" cy="280" r="140" fill="rgba(14,165,233,0.06)" stroke="#0ea5e9" strokeWidth="1.5" strokeDasharray="6 4"/>
      {/* Meridians */}
      <ellipse cx="240" cy="280" rx="70" ry="140" fill="none" stroke="rgba(14,165,233,0.2)" strokeWidth="1"/>
      <ellipse cx="240" cy="280" rx="120" ry="140" fill="none" stroke="rgba(14,165,233,0.15)" strokeWidth="1"/>
      {/* Parallels */}
      {[200,250,280,310,360].map((y,i)=>(
        <line key={i} x1="100" y1={y} x2="380" y2={y} stroke="rgba(14,165,233,0.12)" strokeWidth="1"/>
      ))}
      {/* Location pins */}
      {[
        [240,165,"IN","#6c63ff"],
        [160,230,"EU","#0ea5e9"],
        [155,295,"US","#f59e0b"],
        [310,260,"SG","#22c55e"],
        [295,330,"AU","#f472b6"],
      ].map(([x,y,label,color],i)=>(
        <g key={i}>
          <circle cx={x as number} cy={y as number} r="14"
            fill={`${color as string}20`} stroke={color as string} strokeWidth="1.8"/>
          <text x={x as number} y={(y as number)+5} textAnchor="middle" fontSize="8"
            fill={color as string} fontWeight="800" fontFamily="monospace">{label as string}</text>
        </g>
      ))}
      <text x="240" y="510" textAnchor="middle" fontSize="11" fill="#0ea5e9" fontFamily="monospace" fontWeight="700" letterSpacing="2">12 LANGUAGES · 40+ REGIONS</text>
    </svg>
  );
}

function IllustrationTeam() {
  return (
    <svg viewBox="0 0 480 600" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <rect width="480" height="600" fill="#fdf4ff"/>
      <rect x="30" y="30" width="420" height="540" rx="28" fill="white" opacity="0.5"/>
      {/* Team members */}
      {[
        [120,160,"#6c63ff","AJ","Sales Lead"],
        [240,120,"#f472b6","PR","Designer"],
        [360,160,"#0ea5e9","KR","Dev"],
        [120,310,"#f59e0b","MS","Support"],
        [360,310,"#22c55e","VT","Analyst"],
      ].map(([x,y,color,initials,role],i)=>(
        <g key={i}>
          <circle cx={x as number} cy={y as number} r="36"
            fill={`${color as string}18`} stroke={color as string} strokeWidth="2"/>
          <text x={x as number} y={(y as number)-4} textAnchor="middle" fontSize="13"
            fill={color as string} fontWeight="800" fontFamily="monospace">{initials as string}</text>
          <text x={x as number} y={(y as number)+14} textAnchor="middle" fontSize="8"
            fill={color as string} fontFamily="monospace">{role as string}</text>
        </g>
      ))}
      {/* Shared inbox in center */}
      <rect x="175" y="215" width="130" height="70" rx="18"
        fill="rgba(108,99,255,0.1)" stroke="#6c63ff" strokeWidth="2"/>
      <text x="240" y="245" textAnchor="middle" fontSize="9" fill="#6c63ff" fontWeight="700" fontFamily="monospace">SHARED INBOX</text>
      <text x="240" y="262" textAnchor="middle" fontSize="8" fill="#9b8fcc" fontFamily="monospace">12 active chats</text>
      {/* Connectors */}
      {[[120,196,200,225],[240,156,240,215],[360,196,305,225],[120,274,200,250],[360,274,305,250]].map(([x1,y1,x2,y2],i)=>(
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
          stroke="rgba(108,99,255,0.2)" strokeWidth="1.5" strokeDasharray="5 3"/>
      ))}
    </svg>
  );
}

function IllustrationMobile() {
  return (
    <svg viewBox="0 0 480 600" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <rect width="480" height="600" fill="#f0f9ff"/>
      <rect x="30" y="30" width="420" height="540" rx="28" fill="white" opacity="0.5"/>
      {/* Phone frame */}
      <rect x="155" y="60" width="170" height="300" rx="28" fill="white"
        stroke="#0ea5e9" strokeWidth="2"/>
      <rect x="163" y="76" width="154" height="268" rx="20" fill="#f0f9ff"/>
      {/* Status bar */}
      <rect x="163" y="76" width="154" height="28" rx="20" fill="#0ea5e9"/>
      <rect x="163" y="90" width="154" height="14" fill="#0ea5e9"/>
      <text x="240" y="96" textAnchor="middle" fontSize="8" fill="white" fontWeight="700">StrixMind</text>
      {/* App UI cards */}
      {[
        [170,120,140,30,"Leads Today: 24","#6c63ff"],
        [170,160,140,30,"Revenue: ₹1.2L","#22c55e"],
        [170,200,140,30,"Chats: 8 active","#f59e0b"],
        [170,240,80,22,"AI Score: 94","#0ea5e9"],
        [260,240,50,22,"⚡ Fast","#f472b6"],
      ].map(([x,y,w,h,text,color],i)=>(
        <g key={i}>
          <rect x={x as number} y={y as number} width={w as number} height={h as number}
            rx="8" fill={`${color as string}15`} stroke={`${color as string}40`} strokeWidth="1"/>
          <text x={(x as number)+8} y={(y as number)+(h as number)/2+4} fontSize="8"
            fill={color as string} fontWeight="700" fontFamily="monospace">{text as string}</text>
        </g>
      ))}
      {/* Notification badges */}
      {[
        [190,400,"3 NEW LEADS","#6c63ff"],
        [190,440,"2 BOOKINGS","#22c55e"],
        [190,480,"AI ALERT","#f59e0b"],
      ].map(([x,y,text,color],i)=>(
        <g key={i}>
          <rect x={(x as number)-20} y={(y as number)-14} width="200" height="28" rx="14"
            fill={`${color as string}12`} stroke={`${color as string}30`} strokeWidth="1.5"/>
          <circle cx={x as number} cy={y as number} r="8" fill={color as string}/>
          <text x={(x as number)+16} y={(y as number)+5} fontSize="9"
            fill={color as string} fontWeight="700" fontFamily="monospace">{text as string}</text>
        </g>
      ))}
    </svg>
  );
}

const ILLUSTRATIONS = [
  IllustrationWorkflow,
  IllustrationMultiAgent,
  IllustrationWhatsApp,
  IllustrationAnalytics,
  IllustrationIntegrations,
  IllustrationSecurity,
  IllustrationSpeed,
  IllustrationGlobal,
  IllustrationTeam,
  IllustrationMobile,
];

// ─────────────────────────────────────────────────────────
// Feature data
// ─────────────────────────────────────────────────────────

const FEATURES = [
  {
    id: "workflow",
    label: "Workflow Automation",
    icon: Workflow,
    description: "Topological graph execution engine that automates complex business processes end-to-end.",
    accentColor: "#6c63ff",
    bgColor: "rgba(108,99,255,0.06)",
  },
  {
    id: "multi-agent",
    label: "Multi-Agent AI",
    icon: Brain,
    description: "Six specialised AI agents with priority task queues handle your operations intelligently.",
    accentColor: "#0ea5e9",
    bgColor: "rgba(14,165,233,0.06)",
  },
  {
    id: "whatsapp",
    label: "WhatsApp CRM",
    icon: MessageSquareText,
    description: "Session-aware messaging, lead pipelines and revenue forecasting — all in WhatsApp.",
    accentColor: "#25D366",
    bgColor: "rgba(37,211,102,0.06)",
  },
  {
    id: "analytics",
    label: "Real-time Analytics",
    icon: BarChart,
    description: "Revenue intelligence and conversion insights updated live as your business moves.",
    accentColor: "#6c63ff",
    bgColor: "rgba(108,99,255,0.06)",
  },
  {
    id: "integrations",
    label: "Integrations",
    icon: PlugIcon,
    description: "Connect your existing tools — CRMs, ERPs, calendars — with zero-code connectors.",
    accentColor: "#f59e0b",
    bgColor: "rgba(245,158,11,0.06)",
  },
  {
    id: "security",
    label: "Enterprise Security",
    icon: Shield,
    description: "Bank-grade encryption and role-based access controls protect every data point.",
    accentColor: "#22c55e",
    bgColor: "rgba(34,197,94,0.06)",
  },
  {
    id: "speed",
    label: "Lightning Fast",
    icon: Zap,
    description: "Sub-second response times across all agents, even during high-volume campaigns.",
    accentColor: "#f59e0b",
    bgColor: "rgba(245,158,11,0.06)",
  },
  {
    id: "global",
    label: "Global Ready",
    icon: Globe,
    description: "Multi-language support and localisation built for Indian and global markets alike.",
    accentColor: "#0ea5e9",
    bgColor: "rgba(14,165,233,0.06)",
  },
  {
    id: "team",
    label: "Team Collaboration",
    icon: Users,
    description: "Shared inboxes, conversation routing and team performance dashboards in one place.",
    accentColor: "#8b5cf6",
    bgColor: "rgba(139,92,246,0.06)",
  },
  {
    id: "mobile",
    label: "Mobile First",
    icon: Smartphone,
    description: "Full-featured mobile experience — manage leads, reply to chats, view analytics on the go.",
    accentColor: "#0ea5e9",
    bgColor: "rgba(14,165,233,0.06)",
  },
];

const AUTO_PLAY_INTERVAL = 3200;
const ITEM_HEIGHT = 65;

const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

export function FeatureCarousel() {
  const [step, setStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const currentIndex =
    ((step % FEATURES.length) + FEATURES.length) % FEATURES.length;

  const nextStep = useCallback(() => {
    setStep((prev) => prev + 1);
  }, []);

  const handleChipClick = (index: number) => {
    const diff = (index - currentIndex + FEATURES.length) % FEATURES.length;
    if (diff > 0) setStep((s) => s + diff);
  };

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextStep, AUTO_PLAY_INTERVAL);
    return () => clearInterval(interval);
  }, [nextStep, isPaused]);

  const getCardStatus = (index: number) => {
    const diff = index - currentIndex;
    const len = FEATURES.length;
    let normalizedDiff = diff;
    if (diff > len / 2) normalizedDiff -= len;
    if (diff < -len / 2) normalizedDiff += len;
    if (normalizedDiff === 0) return "active";
    if (normalizedDiff === -1) return "prev";
    if (normalizedDiff === 1) return "next";
    return "hidden";
  };

  return (
    <section id="why" style={{ padding: "8rem 0", borderTop: "1px solid rgba(108,99,255,0.08)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 1.5rem" }}>

        {/* Section header */}
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <div style={{ display: "inline-flex", fontFamily: "var(--font-mono, monospace)", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase" as const, color: "#6c63ff", background: "rgba(108,99,255,0.07)", border: "1px solid rgba(108,99,255,0.18)", padding: "0.3rem 0.8rem", borderRadius: 100, marginBottom: "1.25rem" }}>
            Why StrixMind
          </div>
          <h2 style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "clamp(1.7rem,3.5vw,2.8rem)", fontWeight: 700, letterSpacing: "-0.025em", lineHeight: 1.1, color: "#1a1333", maxWidth: 600, margin: "0 auto 1rem" }}>
            Everything your business needs, in one intelligent platform
          </h2>
          <p style={{ fontSize: "1rem", color: "#5b5478", maxWidth: 520, margin: "0 auto", lineHeight: 1.75 }}>
            From lead capture to deal closure, StrixMind automates every step so your team can focus on what matters most.
          </p>
        </div>

        {/* Carousel */}
        <div className="w-full max-w-7xl mx-auto">
          <div className="relative overflow-hidden rounded-[2.5rem] lg:rounded-[3rem] flex flex-col lg:flex-row min-h-[600px] lg:aspect-video border border-[rgba(108,99,255,0.15)] shadow-[0_20px_64px_rgba(108,99,255,0.12)]">

            {/* Left panel — feature list */}
            <div className="w-full lg:w-[40%] min-h-[350px] md:min-h-[450px] lg:h-full relative z-30 flex flex-col items-start justify-center overflow-hidden px-8 md:px-16 lg:pl-16 bg-gradient-to-br from-[#6c63ff] to-[#4c46c4]">
              <div className="absolute inset-x-0 top-0 h-12 md:h-20 lg:h-16 bg-gradient-to-b from-[#6c63ff] via-[#6c63ff]/80 to-transparent z-40" />
              <div className="absolute inset-x-0 bottom-0 h-12 md:h-20 lg:h-16 bg-gradient-to-t from-[#4c46c4] via-[#4c46c4]/80 to-transparent z-40" />

              <div className="relative w-full h-full flex items-center justify-center lg:justify-start z-20">
                {FEATURES.map((feature, index) => {
                  const isActive = index === currentIndex;
                  const distance = index - currentIndex;
                  const wrappedDistance = wrap(
                    -(FEATURES.length / 2),
                    FEATURES.length / 2,
                    distance
                  );
                  const Icon = feature.icon;

                  return (
                    <motion.div
                      key={feature.id}
                      style={{ height: ITEM_HEIGHT, width: "fit-content" }}
                      animate={{
                        y: wrappedDistance * ITEM_HEIGHT,
                        opacity: 1 - Math.abs(wrappedDistance) * 0.25,
                      }}
                      transition={{ type: "spring", stiffness: 90, damping: 22, mass: 1 }}
                      className="absolute flex items-center justify-start"
                    >
                      <button
                        onClick={() => handleChipClick(index)}
                        onMouseEnter={() => setIsPaused(true)}
                        onMouseLeave={() => setIsPaused(false)}
                        className={cn(
                          "relative flex items-center gap-4 px-6 md:px-10 lg:px-8 py-3.5 md:py-5 lg:py-4 rounded-full transition-all duration-700 text-left group border",
                          isActive
                            ? "bg-white text-[#6c63ff] border-white z-10 shadow-[0_8px_32px_rgba(0,0,0,0.2)]"
                            : "bg-transparent text-white/60 border-white/20 hover:border-white/40 hover:text-white"
                        )}
                      >
                        <div className={cn("flex items-center justify-center transition-colors duration-500", isActive ? "text-[#6c63ff]" : "text-white/40")}>
                          <Icon size={18} strokeWidth={2} />
                        </div>
                        <span className="font-semibold text-sm md:text-[15px] tracking-tight whitespace-nowrap">
                          {feature.label}
                        </span>
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Right panel — illustration cards */}
            <div className="flex-1 min-h-[500px] md:min-h-[600px] lg:h-full relative flex items-center justify-center py-16 md:py-24 lg:py-16 px-6 md:px-12 lg:px-10 overflow-hidden border-t lg:border-t-0 lg:border-l border-[rgba(108,99,255,0.12)]"
              style={{ background: FEATURES[currentIndex].bgColor, transition: "background 0.6s ease" }}>
              <div className="relative w-full max-w-[420px] aspect-[4/5] flex items-center justify-center">
                {FEATURES.map((feature, index) => {
                  const status = getCardStatus(index);
                  const isActive = status === "active";
                  const isPrev = status === "prev";
                  const isNext = status === "next";
                  const Illustration = ILLUSTRATIONS[index];

                  return (
                    <motion.div
                      key={feature.id}
                      initial={false}
                      animate={{
                        x: isActive ? 0 : isPrev ? -100 : isNext ? 100 : 0,
                        scale: isActive ? 1 : isPrev || isNext ? 0.85 : 0.7,
                        opacity: isActive ? 1 : isPrev || isNext ? 0.4 : 0,
                        rotate: isPrev ? -3 : isNext ? 3 : 0,
                        zIndex: isActive ? 20 : isPrev || isNext ? 10 : 0,
                        pointerEvents: isActive ? "auto" : "none",
                      }}
                      transition={{ type: "spring", stiffness: 260, damping: 25, mass: 0.8 }}
                      className="absolute inset-0 rounded-[2rem] md:rounded-[2.8rem] overflow-hidden border-4 md:border-8 border-white bg-white origin-center shadow-[0_20px_60px_rgba(108,99,255,0.15)]"
                    >
                      {/* SVG illustration fills the card */}
                      <div className="w-full h-full">
                        <Illustration />
                      </div>

                      <AnimatePresence>
                        {isActive && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute inset-x-0 bottom-0 p-10 pt-32 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end pointer-events-none"
                          >
                            <div
                              className="px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] w-fit shadow-lg mb-3 border"
                              style={{
                                background: "white",
                                color: feature.accentColor,
                                borderColor: `${feature.accentColor}30`,
                              }}
                            >
                              {index + 1} • {feature.label}
                            </div>
                            <p className="text-white font-semibold text-xl md:text-2xl leading-tight drop-shadow-md tracking-tight">
                              {feature.description}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className={cn("absolute top-8 left-8 flex items-center gap-3 transition-opacity duration-300", isActive ? "opacity-100" : "opacity-0")}>
                        <div
                          className="w-2 h-2 rounded-full shadow-lg"
                          style={{ background: feature.accentColor, boxShadow: `0 0 10px ${feature.accentColor}80` }}
                        />
                        <span className="text-white/90 text-[10px] font-bold uppercase tracking-[0.3em] font-mono bg-black/30 px-2 py-0.5 rounded-full">
                          StrixMind
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeatureCarousel;