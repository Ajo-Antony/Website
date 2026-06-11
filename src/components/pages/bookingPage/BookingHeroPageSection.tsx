export default function BookingHeroPageSection() {
  return (
    <section style={{ paddingTop:120, paddingBottom:"3rem", background:"#D8E8E5", position:"relative", overflow:"hidden" }}>
      <div style={{ maxWidth:1280, margin:"0 auto", padding:"0 2rem" }}>
        <div style={{ display:"inline-flex", fontSize:"0.75rem", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase" as const, color:"#0A5C68", background:"rgba(10,92,104,0.08)", padding:"0.3rem 0.875rem", borderRadius:100, marginBottom:"1.5rem" }}>Book a demo</div>
        <h1 style={{ fontSize:"clamp(2rem,5vw,4rem)", fontWeight:800, lineHeight:1.05, letterSpacing:"-0.04em", color:"#0F172A", marginBottom:"1.25rem", maxWidth:600 }}>
          See StrixMind{" "}
          <span style={{ background:"linear-gradient(135deg,#0A5C68,#14b8a6)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>live in 30 minutes.</span>
        </h1>
        <p style={{ fontSize:"1.1rem", color:"#64748B", maxWidth:480, lineHeight:1.75 }}>Pick a time, tell us about your business, and we'll show you exactly how StrixMind will work for you.</p>
      </div>
    </section>
  );
}
