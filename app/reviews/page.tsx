import type { Metadata } from "next";
import { pageContainer } from "@/lib/layout";
import { getSiteSettings } from "@/lib/api";
import { PageHero } from "@/components/PageHero";
import { ReviewsBoard } from "@/components/ReviewsBoard";
import { storeReviewSummary, storeReviews } from "@/lib/store-reviews";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Customer reviews",
  description:
    "110 The Handle Factory reviews from shoppers across the United Kingdom, covering orders, packing, and delivery.",
};

export default async function ReviewsPage() {
  const settings = await getSiteSettings();
  const reviews = storeReviews();
  const { total, stateCount } = storeReviewSummary();

  return (
    <div className={pageContainer("py-10 sm:py-14")}>
      <PageHero
        current="Reviews"
        eyebrow={`${settings.name} · United Kingdom`}
        title={`${total} reviews from across the UK`}
        description={`${total} shopper reviews of ${settings.name} from ${stateCount} areas. People wrote about the heating, power, and home equipment they ordered, plus packing and delivery. Filter by star rating or sort by date.`}
      />

      <div className="mt-10">
        <ReviewsBoard reviews={reviews} locale={settings.locale || "en-US"} />
      </div>
    </div>
  );
}
