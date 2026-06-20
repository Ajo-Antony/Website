/**
 * src/app/page.tsx
 * ─────────────────────────────────────────────────────────────
 * Home page — fetches both CMS content AND section designs,
 * then renders each section inside a SectionWrapper.
 *
 * VISIBILITY: sections with is_visible = false are fully
 * excluded from the render tree on the server — the browser
 * never receives that HTML.  Only an admin change (which calls
 * revalidatePath) will update what's shown.
 * ─────────────────────────────────────────────────────────────
 */
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
import CapabilitiesShowcaseSection from "@/components/pages/homePage/CapabilitiesShowcaseSection";
import SectionWrapper from "@/components/pages/homePage/SectionWrapper";
import { getContentMany } from "@/lib/actions/content";
import { getSectionDesigns } from "@/lib/actions/sectionDesigner";
import type { SectionDesign } from "@/lib/types/sectionDesigner";

// Always fetch fresh — visibility changes must reflect immediately
// after an admin toggles them (revalidatePath triggers a new render)
export const dynamic = "force-dynamic";
export const revalidate = 0;

const KEYS = [
  "global.nav", "home.hero", "home.trustedBy", "home.services", "home.whyUs",
  "home.workflow", "home.mission", "home.testimonials", "home.pricing",
  "home.team", "home.brand", "home.faq", "home.cta", "home.contact",
];

export default async function HomePage() {
  const [c, rawSections] = await Promise.all([
    getContentMany(KEYS),
    getSectionDesigns("home"),
  ]);

  // Only render sections that are explicitly visible (is_visible !== false)
  // Sections hidden by the admin are dropped here on the server — the
  // browser never receives them, so CSS tricks cannot reveal them.
  const visibleSections = rawSections
    .filter((s: SectionDesign) => s.is_visible !== false)
    .sort((a: SectionDesign, b: SectionDesign) => a.sort_order - b.sort_order);

  return (
    <>
      {visibleSections.map((section: SectionDesign) => {
        const design = section.design ?? {};

        return (
          <SectionWrapper
            key={section.section_key}
            sectionKey={section.section_key}
            design={design}
            isVisible={true} // already filtered above
          >
            {section.section_key === "home.hero" && (
              <HeroHomePageSection
                navLinks={c["global.nav"]?.links as any}
                signInLabel={c["global.nav"]?.signInLabel as any}
                ctaLabel={c["global.nav"]?.ctaLabel as any}
                ctaHref={c["global.nav"]?.ctaHref as any}
                {...(c["home.hero"] as any)}
              />
            )}
            {section.section_key === "home.trustedBy" && (
              <TrustedByHomePageSection {...(c["home.trustedBy"] as any)} />
            )}
            {section.section_key === "home.services" && (
              <ServicesHomePageSection {...(c["home.services"] as any)} />
            )}
            {section.section_key === "home.whyUs" && (
              <FeatureServicesHomePageSection {...(c["home.whyUs"] as any)} />
            )}
            {section.section_key === "home.workflow" && (
              <WorkflowHomePageSection {...(c["home.workflow"] as any)} />
            )}
            {section.section_key === "home.mission" && (
              <AboutHomePageSection {...(c["home.mission"] as any)} />
            )}
            {section.section_key === "home.testimonials" && (
              <TestimonialsHomePageSection {...(c["home.testimonials"] as any)} />
            )}
            {section.section_key === "home.pricing" && (
              <PricingHomePageSection {...(c["home.pricing"] as any)} />
            )}
            {section.section_key === "home.team" && (
              <BarbersTeamHomePageSection {...(c["home.team"] as any)} />
            )}
            {section.section_key === "home.brand" && (
              <BrandIdentitySection {...(c["home.brand"] as any)} />
            )}
            {section.section_key === "home.faq" && (
              <FaqHomePageSection {...(c["home.faq"] as any)} />
            )}
            {section.section_key === "home.cta" && (
              <CtaBannerHomePageSection {...(c["home.cta"] as any)} />
            )}
            {section.section_key === "home.contact" && (
              <ContactHomePageSection {...(c["home.contact"] as any)} />
            )}
          </SectionWrapper>
        );
      })}
      {/* Static section — not admin/CMS managed, see component header comment */}
      <CapabilitiesShowcaseSection />
    </>
  );
}