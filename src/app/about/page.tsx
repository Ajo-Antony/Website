import AboutPageHeroSection from "@/components/pages/aboutPage/AboutPageHeroSection";
import StoryPageSection from "@/components/pages/aboutPage/StoryPageSection";
import ValuesPageSection from "@/components/pages/aboutPage/ValuesPageSection";
import TeamPageSection from "@/components/pages/aboutPage/TeamPageSection";
import { getContentMany } from "@/lib/actions/content";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const c = await getContentMany(["about.hero", "about.story", "about.values", "about.team"]);
  return (
    <>
      <AboutPageHeroSection {...(c["about.hero"] as any)} />
      <StoryPageSection {...(c["about.story"] as any)} />
      <ValuesPageSection {...(c["about.values"] as any)} />
      <TeamPageSection {...(c["about.team"] as any)} />
    </>
  );
}
