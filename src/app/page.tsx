/**
 * src/app/page.tsx
 * Home page — reorganized section order:
 *
 *  1. Hero              (full-screen intro, no embedded nav)
 *  2. TrustedBy         (logo marquee)
 *  3. Services          (six service cards)
 *  4. FeatureCarousel   (interactive animated feature showcase)
 *  5. About / Mission   (company story + timeline)
 *  6. Testimonials      (social proof)
 *  7. FAQ               (accordion)
 *  8. CTA Banner        (aurora gradient call-to-action)
 *  9. Contact           (form + info)
 * 10. Capabilities      (static display-cards showcase)
 */

/**
 * PERF FIX: Removed `export const dynamic = "force-dynamic"` and
 * `export const revalidate = 0`.
 *
 * Those two lines disabled ALL caching — every visitor hit Supabase
 * cold on every request. Now we use ISR: the page is cached and
 * served instantly from Vercel's edge, regenerated in the background
 * every 60 seconds. Content changes appear within ~1 minute.
 *
 * If you need faster content updates, lower to 30. If content rarely
 * changes, raise to 3600 (1 hour) for maximum speed.
 */
export const revalidate = 60;

import { PremiumHero } from "@/components/ui/hero";
import TrustedByHomePageSection from "@/components/pages/homePage/TrustedByHomePageSection";
import ServicesHomePageSection from "@/components/pages/homePage/ServicesHomePageSection";
import FeatureCarouselSection from "@/components/pages/homePage/FeatureCarouselSection";
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

const KEYS = [
  "global.nav", "home.hero", "home.trustedBy", "home.services",
  "home.mission", "home.testimonials",
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

      {/* 4. Feature Carousel */}
      <FeatureCarouselSection />

      {/* 5. About / Mission */}
      {isVisible("home.mission") && (
        <SectionWrapper sectionKey="home.mission" design={designOf("home.mission")} isVisible>
          <AboutHomePageSection {...(c["home.mission"] as any)} />
        </SectionWrapper>
      )}

      {/* 6. Testimonials */}
      {isVisible("home.testimonials") && (
        <SectionWrapper sectionKey="home.testimonials" design={designOf("home.testimonials")} isVisible>
          <TestimonialsHomePageSection {...(c["home.testimonials"] as any)} />
        </SectionWrapper>
      )}

      {/* 7. FAQ */}
      {isVisible("home.faq") && (
        <SectionWrapper sectionKey="home.faq" design={designOf("home.faq")} isVisible>
          <FaqHomePageSection {...(c["home.faq"] as any)} />
        </SectionWrapper>
      )}

      {/* 8. CTA Banner */}
      {isVisible("home.cta") && (
        <SectionWrapper sectionKey="home.cta" design={designOf("home.cta")} isVisible>
          <CtaBannerHomePageSection {...(c["home.cta"] as any)} />
        </SectionWrapper>
      )}

      {/* 9. Contact */}
      {isVisible("home.contact") && (
        <SectionWrapper sectionKey="home.contact" design={designOf("home.contact")} isVisible>
          <ContactHomePageSection {...(c["home.contact"] as any)} />
        </SectionWrapper>
      )}

      {/* 10. Capabilities showcase — static, always shown */}
      <CapabilitiesShowcaseSection />
    </>
  );
}
