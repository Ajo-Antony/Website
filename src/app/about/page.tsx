import type { Metadata } from "next";
import AboutPageHeroSection from "@/components/pages/aboutPage/AboutPageHeroSection";
import StoryPageSection from "@/components/pages/aboutPage/StoryPageSection";
import ValuesPageSection from "@/components/pages/aboutPage/ValuesPageSection";
import TeamPageSection from "@/components/pages/aboutPage/TeamPageSection";
import { getContentMany } from "@/lib/actions/content";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about StrixMind — our mission to build AI-powered tools that help Indian businesses automate, scale, and grow without limits.",
  alternates: { canonical: "https://strixmind.in/about" },
  openGraph: {
    title: "About StrixMind — AI-Powered Business Operating System",
    description:
      "Learn about StrixMind — our mission to build AI-powered tools that help Indian businesses automate, scale, and grow without limits.",
    url: "https://strixmind.in/about",
    type: "website",
  },
};

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
