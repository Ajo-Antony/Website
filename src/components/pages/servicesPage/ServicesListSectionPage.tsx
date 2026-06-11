// ── IMAGE GUIDE ──────────────────────────────────────────────
// Service images: /public/images/services/service-01.jpg (800×500)
// Uncomment the <Image> block in each card once you drop images in.
// ─────────────────────────────────────────────────────────────
const SERVICES = [
  { num:"01", title:"AI Agents",            icon:"🤖", desc:"Deploy intelligent agents for sales, support, HR, and legal. Each agent learns your business, handles queries 24/7, and escalates complex cases to your team." },
  { num:"02", title:"Workflow Automation",  icon:"⚡", desc:"Build powerful automations with our visual drag-and-drop builder. Connect 500+ integrations and custom nodes to create any business flow imaginable." },
  { num:"03", title:"Intelligent CRM",      icon:"👥", desc:"A CRM that updates itself. AI enriches contacts, scores pipeline deals, and surfaces the highest-value actions for your team every single day." },
  { num:"04", title:"WhatsApp Automation",  icon:"💬", desc:"Connect WhatsApp Business API and deploy intelligent bots for bookings, follow-ups, support, and broadcast campaigns — all in one place." },
  { num:"05", title:"Revenue Analytics",    icon:"📊", desc:"Unified dashboards combining pipeline, campaign, and agent performance data with AI-generated insights and 90-day revenue forecasts." },
  { num:"06", title:"Campaign Outreach",    icon:"🚀", desc:"Multi-channel campaigns across email, SMS, and social — written, A/B tested, and continuously optimised by AI to maximise every conversion." },
] as const;

export default function ServicesListSectionPage() {
  return (
    <section style={{ padding: "6rem 0", background: "#fff", borderTop: "1px solid #E5E7EB" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 2rem", display: "flex", flexDirection: "column" as const, gap: "4rem" }}>
        {SERVICES.map((s, i) => (
          <div key={s.num} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center", direction: (i % 2 !== 0 ? "rtl" : "ltr") as React.CSSProperties["direction"] }}>
            <div style={{ direction: "ltr" as const }}>
              <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: "rgba(10,92,104,0.4)", marginBottom: "1rem" }}>{s.num}</div>
              <h3 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#0F172A", marginBottom: "1rem", letterSpacing: "-0.03em" }}>{s.icon} {s.title}</h3>
              <p style={{ fontSize: "1rem", color: "#64748B", lineHeight: 1.8 }}>{s.desc}</p>
            </div>
            <div style={{ direction: "ltr" as const, height: 240, borderRadius: 20, background: "rgba(10,92,104,0.05)", border: "1px solid #E5E7EB", display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "center", gap: "0.75rem", fontSize: "3rem" }}>
              <span style={{ opacity: 0.4 }}>{s.icon}</span>
              {/* Replace with: <Image src={`/images/services/service-${s.num}.jpg`} alt={s.title} width={800} height={500} style={{borderRadius:20,width:"100%",height:"100%",objectFit:"cover"}} /> */}
              <div style={{ fontSize: "0.72rem", color: "#64748B", fontWeight: 500 }}>Add image → /public/images/services/</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
