import HeroHomePageSection from "@/components/pages/homePage/HeroHomePageSection";
import TrustedByHomePageSection from "@/components/pages/homePage/TrustedByHomePageSection";
import ServicesHomePageSection from "@/components/pages/homePage/ServicesHomePageSection";
import FeatureServicesHomePageSection from "@/components/pages/homePage/FeatureServicesHomePageSection";
import WorkflowHomePageSection from "@/components/pages/homePage/WorkflowHomePageSection";
import AboutHomePageSection from "@/components/pages/homePage/AboutHomePageSection";
import TestimonialsHomePageSection from "@/components/pages/homePage/TestimonialsHomePageSection";
import PricingHomePageSection from "@/components/pages/homePage/PricingHomePageSection";
import BarbersTeamHomePageSection from "@/components/pages/homePage/BarbersTeamHomePageSection";
import BrandIdentitySection from "@/components/pages/homePage/BrandIdentitySection";
import FaqHomePageSection from "@/components/pages/homePage/FaqHomePageSection";
import CtaBannerHomePageSection from "@/components/pages/homePage/CtaBannerHomePageSection";
import ContactHomePageSection from "@/components/pages/homePage/ContactHomePageSection";
import { getContentMany } from "@/lib/actions/content";

export const dynamic = "force-dynamic";

const KEYS = [
  "global.nav", "home.hero", "home.trustedBy", "home.services", "home.whyUs",
  "home.workflow", "home.mission", "home.testimonials", "home.pricing",
  "home.team", "home.brand", "home.faq", "home.cta", "home.contact",
];

export default async function HomePage() {
  const c = await getContentMany(KEYS);

  return (
    <>
      <HeroHomePageSection
        navLinks={c["global.nav"].links as any}
        signInLabel={c["global.nav"].signInLabel as any}
        ctaLabel={c["global.nav"].ctaLabel as any}
        ctaHref={c["global.nav"].ctaHref as any}
        {...(c["home.hero"] as any)}
      />
      <TrustedByHomePageSection {...(c["home.trustedBy"] as any)} />
      <ServicesHomePageSection {...(c["home.services"] as any)} />
      <FeatureServicesHomePageSection {...(c["home.whyUs"] as any)} />
      <WorkflowHomePageSection {...(c["home.workflow"] as any)} />
      <AboutHomePageSection {...(c["home.mission"] as any)} />
      <TestimonialsHomePageSection {...(c["home.testimonials"] as any)} />
      <PricingHomePageSection {...(c["home.pricing"] as any)} />
      <BarbersTeamHomePageSection {...(c["home.team"] as any)} />
      <BrandIdentitySection {...(c["home.brand"] as any)} />
      <FaqHomePageSection {...(c["home.faq"] as any)} />
      <CtaBannerHomePageSection {...(c["home.cta"] as any)} />
      <ContactHomePageSection {...(c["home.contact"] as any)} />
    </>
  );
}
