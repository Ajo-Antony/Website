import HeroSectionServicesPage from "@/components/pages/servicesPage/HeroSectionServicesPage";
import ServicesListSectionPage from "@/components/pages/servicesPage/ServicesListSectionPage";
import CTASectionBelowServicesListComponent from "@/components/pages/servicesPage/CTASectionBelowServicesListComponent";
import { getContentMany } from "@/lib/actions/content";

export const dynamic = "force-dynamic";

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
