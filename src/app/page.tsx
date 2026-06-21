/**
 * src/app/page.tsx
 * Home page — reorganized section order:
 *
 *  1. Hero              (full-screen intro, no embedded nav)
 *  2. TrustedBy         (logo marquee)
 *  3. Services          (six service cards)
 *  4. FeatureCarousel   (NEW — interactive animated feature showcase)
 *  5. Workflow          (4-step how-it-works)
 *  6. About / Mission   (company story + timeline)
 *  7. Testimonials      (social proof)
 *  8. FAQ               (accordion)
 *  9. CTA Banner        (aurora gradient call-to-action)
 * 10. Contact           (form + info)
 * 11. Capabilities      (static display-cards showcase)
 *
 * REMOVED:
 *  - BrandIdentitySection     (internal brand doc, not user-facing)
 *  - BarbersTeamHomePageSection (wrong industry framing)
 *  - FeatureServicesHomePageSection (replaced by FeatureCarousel)
 *  - Pricing             (removed per request)
 */
import { PremiumHero } from "@/components/ui/hero";
import TrustedByHomePageSection from "@/components/pages/homePage/TrustedByHomePageSection";
import ServicesHomePageSection from "@/components/pages/homePage/ServicesHomePageSection";
import FeatureCarouselSection from "@/components/pages/homePage/FeatureCarouselSection";
import WorkflowHomePageSection from "@/components/pages/homePage/WorkflowHomePageSection";
import AboutHomePageSection from "@/components/pages/homePage/AboutHomePageSection";
import TestimonialsHomePageSection from "@/components/pages/homePage/TestimonialsHomePageSection";
import FaqHomePageSection from "@/components/pages/homePage/FaqHomePageSection";
import CtaBannerHomePageSection from "@/components/pages/homePage/CtaBannerHomePageSection";
import ContactHomePageSection from "@/components/pages/homePage/ContactHomePageSection";
import CapabilitiesShowcaseSection from "@/components/pages/homePage/CapabilitiesShowcaseSection";
import SectionWrapper from "@/components/pages/homePage/SectionWrapper";
import { getContentMany } from "@/lib/actions/content";
import { getSectionDesigns } from "@/lib/actions/sectionDesigner";
import type { SectionDesign } from "@/lib/types/sectionDesigner";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const KEYS = [
  "global.nav", "home.hero", "home.trustedBy", "home.services",
  "home.workflow", "home.mission", "home.testimonials",
  "home.faq", "home.cta", "home.contact",
];

export default async function HomePage() {
  const [c, rawSections] = await Promise.all([
    getContentMany(KEYS),
    getSectionDesigns("home"),
  ]);

  // Build visibility map
  const visMap = new Map<string, SectionDesign>();
  rawSections.forEach((s: SectionDesign) => visMap.set(s.section_key, s));

  const isVisible = (key: string) => {
    const s = visMap.get(key);
    return !s || s.is_visible !== false;
  };

  const designOf = (key: string) => visMap.get(key)?.design ?? {};

  return (
    <>
      {/* 1. Hero */}
      {isVisible("home.hero") && (
        <SectionWrapper sectionKey="home.hero" design={designOf("home.hero")} isVisible>
          <PremiumHero />
        </SectionWrapper>
      )}

      {/* 2. Trusted By */}
      {isVisible("home.trustedBy") && (
        <SectionWrapper sectionKey="home.trustedBy" design={designOf("home.trustedBy")} isVisible>
          <TrustedByHomePageSection {...(c["home.trustedBy"] as any)} />
        </SectionWrapper>
      )}

      {/* 3. Services */}
      {isVisible("home.services") && (
        <SectionWrapper sectionKey="home.services" design={designOf("home.services")} isVisible>
          <ServicesHomePageSection {...(c["home.services"] as any)} />
        </SectionWrapper>
      )}

      {/* 4. Feature Carousel — NEW interactive Why StrixMind section */}
      <FeatureCarouselSection />

      {/* 5. Workflow / How it works */}
      {isVisible("home.workflow") && (
        <SectionWrapper sectionKey="home.workflow" design={designOf("home.workflow")} isVisible>
          <WorkflowHomePageSection {...(c["home.workflow"] as any)} />
        </SectionWrapper>
      )}

      {/* 6. About / Mission */}
      {isVisible("home.mission") && (
        <SectionWrapper sectionKey="home.mission" design={designOf("home.mission")} isVisible>
          <AboutHomePageSection {...(c["home.mission"] as any)} />
        </SectionWrapper>
      )}

      {/* 7. Testimonials */}
      {isVisible("home.testimonials") && (
        <SectionWrapper sectionKey="home.testimonials" design={designOf("home.testimonials")} isVisible>
          <TestimonialsHomePageSection {...(c["home.testimonials"] as any)} />
        </SectionWrapper>
      )}

      {/* 8. FAQ */}
      {isVisible("home.faq") && (
        <SectionWrapper sectionKey="home.faq" design={designOf("home.faq")} isVisible>
          <FaqHomePageSection {...(c["home.faq"] as any)} />
        </SectionWrapper>
      )}

      {/* 9. CTA Banner */}
      {isVisible("home.cta") && (
        <SectionWrapper sectionKey="home.cta" design={designOf("home.cta")} isVisible>
          <CtaBannerHomePageSection {...(c["home.cta"] as any)} />
        </SectionWrapper>
      )}

      {/* 10. Contact */}
      {isVisible("home.contact") && (
        <SectionWrapper sectionKey="home.contact" design={designOf("home.contact")} isVisible>
          <ContactHomePageSection {...(c["home.contact"] as any)} />
        </SectionWrapper>
      )}

      {/* 11. Capabilities showcase — static, always shown */}
      <CapabilitiesShowcaseSection />
    </>
  );
}
