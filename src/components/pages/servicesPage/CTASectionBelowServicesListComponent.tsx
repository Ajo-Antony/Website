import Link from "next/link";
export default function CTASectionBelowServicesListComponent() {
  return (
    <section style={{ padding: "6rem 0", background: "#D8E8E5", borderTop: "1px solid #E5E7EB" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 2rem" }}>
        <div style={{ borderRadius: 32, padding: "4.5rem 3rem", textAlign: "center", background: "#fff", border: "1px solid #E5E7EB", boxShadow: "0 24px 80px rgba(10,92,104,0.10)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg,#0A5C68,#14b8a6)" }} />
          <h2 style={{ fontSize: "clamp(1.9rem,4vw,3rem)", fontWeight: 800, letterSpacing: "-0.03em", color: "#0F172A", marginBottom: "1rem" }}>Ready to automate your growth?</h2>
          <p style={{ fontSize: "1rem", color: "#64748B", marginBottom: "2.5rem", fontWeight: 400 }}>Start your 14-day free trial. No credit card required.</p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", flexWrap: "wrap" as const }}>
            <Link href="/booking" style={{ fontSize: "1rem", fontWeight: 700, padding: "0.9rem 2.25rem", background: "#0A5C68", color: "#fff", borderRadius: 100, textDecoration: "none", boxShadow: "0 8px 24px rgba(10,92,104,0.3)" }}>Book a demo →</Link>
            <Link href="/#contact" style={{ fontSize: "1rem", fontWeight: 600, padding: "0.9rem 2.25rem", background: "#D8E8E5", color: "#0A5C68", borderRadius: 100, textDecoration: "none", border: "1.5px solid rgba(10,92,104,0.2)" }}>Ask a question</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
