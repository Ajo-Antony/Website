"use client";
const FEATURES = [
  { num:"01", icon:"🤖", title:"AI Agents", desc:"Deploy intelligent agents for sales, support, HR, and legal. They learn your business, handle queries 24/7, and escalate when needed.", tags:["Sales Agent","Support Agent","HR Agent","Legal Agent"] },
  { num:"02", icon:"⚡", title:"Workflow Automation", desc:"Build powerful automations with our visual drag-and-drop builder. Connect 500+ integrations with custom nodes and triggers.", tags:["Drag & Drop","500+ Integrations","Custom Nodes"] },
  { num:"03", icon:"👥", title:"Intelligent CRM", desc:"A CRM that updates itself. AI enriches contacts, scores pipeline deals, and surfaces the highest-value actions every day.", tags:["Lead Management","Contact Hub","Pipeline Tracking"] },
  { num:"04", icon:"💬", title:"WhatsApp Automation", desc:"Connect WhatsApp Business and deploy intelligent bots that handle bookings, follow-ups, and support around the clock.", tags:["WhatsApp Business","Auto-replies","Broadcast"] },
  { num:"05", icon:"📊", title:"Revenue Analytics", desc:"Unified dashboards combining pipeline, campaign, and agent performance data with AI-generated insights.", tags:["Revenue Dashboard","Team Performance","Automation Metrics"] },
  { num:"06", icon:"🚀", title:"Campaign Outreach", desc:"Multi-channel campaigns across email, SMS, and social — written, A/B tested, and continuously optimised by AI.", tags:["Email","SMS","Social","A/B Testing"] },
] as const;

export default function FeaturesHomePageSection() {
  return (
    <section id="features" style={{ background: "#fff", padding: "6rem 0" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 2rem" }}>
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <div style={{ display: "inline-flex", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#0A5C68", background: "rgba(10,92,104,0.08)", padding: "0.3rem 0.875rem", borderRadius: 100, marginBottom: "1.25rem" }}>Platform Features</div>
          <h2 style={{ fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 800, letterSpacing: "-0.03em", color: "#0F172A", lineHeight: 1.1, marginBottom: "1rem" }}>Everything your business<br/>needs to scale with AI.</h2>
          <p style={{ fontSize: "1.05rem", color: "#64748B", maxWidth: 540, margin: "0 auto", lineHeight: 1.7 }}>Six fully integrated modules that work together from day one.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "1.5rem" }}>
          {FEATURES.map((f, i) => (
            <div key={f.num} style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 24, padding: "2.25rem", transition: "all 0.4s ease", cursor: "default", transitionDelay: `${i * 0.06}s` }}
              onMouseEnter={e => { const d = e.currentTarget as HTMLDivElement; d.style.transform = "translateY(-8px)"; d.style.boxShadow = "0 12px 48px rgba(10,92,104,0.16)"; d.style.borderColor = "rgba(10,92,104,0.15)"; }}
              onMouseLeave={e => { const d = e.currentTarget as HTMLDivElement; d.style.transform = ""; d.style.boxShadow = ""; d.style.borderColor = "#E5E7EB"; }}>
              <div style={{ width: 52, height: 52, borderRadius: 16, background: "rgba(10,92,104,0.08)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem", fontSize: "1.4rem" }}>{f.icon}</div>
              <div style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "rgba(10,92,104,0.4)", marginBottom: "0.75rem" }}>{f.num}</div>
              <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0F172A", marginBottom: "0.75rem", letterSpacing: "-0.02em" }}>{f.title}</div>
              <p style={{ fontSize: "0.9rem", color: "#64748B", lineHeight: 1.7 }}>{f.desc}</p>
              <div style={{ display: "flex", flexWrap: "wrap" as const, gap: "0.5rem", marginTop: "1.25rem" }}>
                {f.tags.map(t => <span key={t} style={{ fontSize: "0.7rem", fontWeight: 600, color: "#0A5C68", background: "rgba(10,92,104,0.07)", border: "1px solid rgba(10,92,104,0.12)", padding: "0.2rem 0.6rem", borderRadius: 100 }}>{t}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
