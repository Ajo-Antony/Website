import HeroHomePageSection from "@/components/pages/homePage/HeroHomePageSection";
import TrustedByHomePageSection from "@/components/pages/homePage/TrustedByHomePageSection";
import FeaturesHomePageSection from "@/components/pages/homePage/FeaturesHomePageSection";
import DemoHomePageSection from "@/components/pages/homePage/DemoHomePageSection";
import WorkflowHomePageSection from "@/components/pages/homePage/WorkflowHomePageSection";
import TestimonialsHomePageSection from "@/components/pages/homePage/TestimonialsHomePageSection";
import PricingHomePageSection from "@/components/pages/homePage/PricingHomePageSection";
import FaqHomePageSection from "@/components/pages/homePage/FaqHomePageSection";
import CtaBannerHomePageSection from "@/components/pages/homePage/CtaBannerHomePageSection";
import ContactHomePageSection from "@/components/pages/homePage/ContactHomePageSection";
import BrandIdentitySection from "@/components/pages/homePage/BrandIdentitySection";

export default function HomePage() {
  return (
    <>
      <HeroHomePageSection />
      <TrustedByHomePageSection />
      <FeaturesHomePageSection />
      <DemoHomePageSection />
      <WorkflowHomePageSection />
      <TestimonialsHomePageSection />
      <PricingHomePageSection />
      <BrandIdentitySection />
      <FaqHomePageSection />
      <CtaBannerHomePageSection />
      <ContactHomePageSection />
    </>
  );
}
