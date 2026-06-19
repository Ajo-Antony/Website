import { CONTENT_DEFAULTS } from "@/lib/cms/registry";

interface ServiceItem { icon: string; title: string; desc: string; image?: string }
interface ServicesListProps { items?: ServiceItem[] }
const D = CONTENT_DEFAULTS["services.list"] as Required<ServicesListProps>;

export default function ServicesListSectionPage({ items = D.items }: ServicesListProps) {
  return (
    <section style={{ padding: "6rem 0", background: "#fff", borderTop: "1px solid #E5E0FA" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 2rem", display: "flex", flexDirection: "column" as const, gap: "4rem" }}>
        {items.map((s, i) => (
          <div key={s.title} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center", direction: (i % 2 !== 0 ? "rtl" : "ltr") as React.CSSProperties["direction"] }}>
            <div style={{ direction: "ltr" as const }}>
              <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: "rgba(108,99,255,0.45)", marginBottom: "1rem" }}>{String(i + 1).padStart(2, "0")}</div>
              <h3 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#1a1333", marginBottom: "1rem", letterSpacing: "-0.03em" }}>{s.icon} {s.title}</h3>
              <p style={{ fontSize: "1rem", color: "#5b5478", lineHeight: 1.8 }}>{s.desc}</p>
            </div>
            <div style={{ direction: "ltr" as const, height: 240, borderRadius: 20, overflow: "hidden", background: s.image ? undefined : "rgba(108,99,255,0.06)", border: "1px solid #E5E0FA", display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "center", gap: "0.75rem" }}>
              {s.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={s.image} alt={s.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <span style={{ fontSize: "3rem", opacity: 0.4 }}>{s.icon}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
