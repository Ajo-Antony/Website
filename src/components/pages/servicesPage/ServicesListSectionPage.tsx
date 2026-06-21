import { CONTENT_DEFAULTS } from "@/lib/cms/registry";
import { IconRobot, IconBolt, IconUsers, IconWhatsapp, IconChart, IconRocket } from "@/components/ui/SvgIcons";
import type { ElementType } from "react";

interface ServiceItem { icon: string; title: string; desc: string; image?: string }
interface ServicesListProps { items?: ServiceItem[] }
const D = CONTENT_DEFAULTS["services.list"] as Required<ServicesListProps>;

// SVG icons indexed to match the original emoji order: 🤖 ⚡ 👥 💬 📊 🚀
const ICONS: ElementType<{ size?: number; color?: string }>[] = [
  IconRobot, IconBolt, IconUsers, IconWhatsapp, IconChart, IconRocket,
];

export default function ServicesListSectionPage({ items = D.items }: ServicesListProps) {
  return (
    <section style={{ background: "#fff", borderTop: "1px solid #E5E0FA" }} className="py-16 sm:py-24">
      <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", flexDirection: "column" as const, gap: "3rem" }} className="px-5 sm:px-8 sm:gap-16">
        {items.map((s, i) => {
          const Icon = ICONS[i % ICONS.length];
          const reversed = i % 2 !== 0;
          return (
          <div
            key={s.title}
            className="grid grid-cols-1 sm:grid-cols-2 items-center gap-6 sm:gap-12"
            style={reversed ? { direction: "rtl" as React.CSSProperties["direction"] } : undefined}
          >
            <div style={{ direction: "ltr" as const }}>
              <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: "rgba(108,99,255,0.45)", marginBottom: "1rem" }}>{String(i + 1).padStart(2, "0")}</div>
              <h3 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#1a1333", marginBottom: "1rem", letterSpacing: "-0.03em", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <Icon size={28} color="#6c63ff" strokeWidth={1.6} />
                {s.title}
              </h3>
              <p style={{ fontSize: "1rem", color: "#5b5478", lineHeight: 1.8 }}>{s.desc}</p>
            </div>
            <div style={{ direction: "ltr" as const, height: 240, borderRadius: 20, overflow: "hidden", background: s.image ? undefined : "rgba(108,99,255,0.06)", border: "1px solid #E5E0FA", display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "center", gap: "0.75rem" }}>
              {s.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={s.image} alt={s.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <Icon size={56} color="#6c63ff" strokeWidth={1.3} style={{ opacity: 0.4 }} />
              )}
            </div>
          </div>
          );
        })}
      </div>
    </section>
  );
}
