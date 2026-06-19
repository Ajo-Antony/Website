import BookingHeroPageSection from "@/components/pages/bookingPage/BookingHeroPageSection";
import BookingFormPageSection from "@/components/pages/bookingPage/BookingFormPageSection";
import { getContentMany } from "@/lib/actions/content";

export const dynamic = "force-dynamic";

export default async function BookingPage() {
  const c = await getContentMany(["booking.hero", "booking.slots"]);
  return (
    <>
      <BookingHeroPageSection {...(c["booking.hero"] as any)} />
      <BookingFormPageSection {...(c["booking.slots"] as any)} />
    </>
  );
}
