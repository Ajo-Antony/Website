import ContactHeroPageSection from "@/components/pages/contactPage/ContactHeroPageSection";
import ContactContentPageSection from "@/components/pages/contactPage/ContactContentPageSection";
import { getContentMany } from "@/lib/actions/content";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const c = await getContentMany(["contact.hero", "contact.info"]);
  return (
    <>
      <ContactHeroPageSection {...(c["contact.hero"] as any)} />
      <ContactContentPageSection {...(c["contact.info"] as any)} />
    </>
  );
}
