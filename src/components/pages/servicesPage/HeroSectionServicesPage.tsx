export default function HeroSectionServicesPage() {
  return (
    <section style={{ minHeight: "60vh", display: "flex", alignItems: "center", paddingTop: 72, background: "#D8E8E5", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", width: 460, height: 460, borderRadius: "50%", border: "1px solid rgba(10,92,104,0.06)", top: -100, right: -80, animation: "rotate-slow 28s linear infinite", pointerEvents: "none" as const }} />
      <style>{`@keyframes rotate-slow{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "5rem 2rem" }}>
        <div style={{ display: "inline-flex", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#0A5C68", background: "rgba(10,92,104,0.08)", padding: "0.3rem 0.875rem", borderRadius: 100, marginBottom: "1.5rem" }}>Services</div>
        <h1 style={{ fontSize: "clamp(2.5rem,6vw,4.5rem)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.04em", color: "#0F172A", marginBottom: "1.5rem", maxWidth: 700 }}>
          Everything your business needs<br/>
          <span style={{ background: "linear-gradient(135deg,#0A5C68,#14b8a6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>to grow on autopilot.</span>
        </h1>
        <p style={{ fontSize: "1.125rem", color: "#64748B", maxWidth: 520, lineHeight: 1.75 }}>Six fully integrated modules. One platform. Zero friction between them.</p>
      </div>
    </section>
  );
}
