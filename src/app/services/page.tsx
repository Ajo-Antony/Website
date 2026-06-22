import type { Metadata } from "next";
import HeroSectionServicesPage from "@/components/pages/servicesPage/HeroSectionServicesPage";
import ServicesListSectionPage from "@/components/pages/servicesPage/ServicesListSectionPage";
import CTASectionBelowServicesListComponent from "@/components/pages/servicesPage/CTASectionBelowServicesListComponent";
import { getContentMany } from "@/lib/actions/content";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Services",
  description:
    "Explore StrixMind's full suite — WhatsApp CRM, AI lead qualification, multi-agent automation, RAG knowledge base, campaign analytics, and more.",
  alternates: { canonical: "https://strixmind.in/services" },
  openGraph: {
    title: "Services — StrixMind",
    description:
      "Explore StrixMind's full suite — WhatsApp CRM, AI lead qualification, multi-agent automation, RAG knowledge base, campaign analytics, and more.",
    url: "https://strixmind.in/services",
    type: "website",
  },
};

export default async function ServicesPage() {
  const c = await getContentMany(["services.hero", "services.list", "services.cta"]);
  return (
    <>
      <HeroSectionServicesPage {...(c["services.hero"] as any)} />
      <ServicesListSectionPage {...(c["services.list"] as any)} />
      <CTASectionBelowServicesListComponent {...(c["services.cta"] as any)} />
    </>
  );
}
