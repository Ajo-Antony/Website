import type { Metadata } from "next";
import ContactHeroPageSection from "@/components/pages/contactPage/ContactHeroPageSection";
import ContactContentPageSection from "@/components/pages/contactPage/ContactContentPageSection";
import { getContentMany } from "@/lib/actions/content";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with the StrixMind team — we'd love to show you how AI automation can transform your business.",
  alternates: { canonical: "https://strixmind.com/contact" },
  openGraph: {
    title: "Contact StrixMind",
    description:
      "Get in touch with the StrixMind team — we'd love to show you how AI automation can transform your business.",
    url: "https://strixmind.com/contact",
    type: "website",
  },
};

const contactPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact StrixMind",
  url: "https://strixmind.com/contact",
  description: "Reach the StrixMind team for demos, partnerships, or support.",
};

export default async function ContactPage() {
  const c = await getContentMany(["contact.hero", "contact.info"]);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageJsonLd) }}
      />
      <ContactHeroPageSection {...(c["contact.hero"] as any)} />
      <ContactContentPageSection {...(c["contact.info"] as any)} />
    </>
  );
}
