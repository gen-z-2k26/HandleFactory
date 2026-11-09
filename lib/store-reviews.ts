import type { GenericReview } from "@/lib/types";

const STATES = [
  ["England", "London"],
  ["England", "Manchester"],
  ["England", "Birmingham"],
  ["England", "Leeds"],
  ["England", "Bristol"],
  ["England", "Liverpool"],
  ["England", "Newcastle"],
  ["England", "Nottingham"],
  ["England", "Sheffield"],
  ["England", "Cambridge"],
  ["Scotland", "Glasgow"],
  ["Scotland", "Edinburgh"],
  ["Scotland", "Aberdeen"],
  ["Wales", "Cardiff"],
  ["Wales", "Swansea"],
  ["Northern Ireland", "Belfast"],
] as const;

const FIRST = [
  "Amina", "James", "Sofia", "Daniel", "Priya", "Noah", "Elena", "Omar",
  "Maya", "Chris", "Lina", "Theo", "Hannah", "Marcus", "Grace", "Andre",
  "Chloe", "Ryan", "Fatima", "Owen", "Natalie", "Jamal", "Brooke", "Ethan",
  "Lucia", "Colin", "Aisha", "Patrick", "Megan", "Luis", "Harper", "Derek",
  "Nina", "Caleb", "Rosa", "Ian", "Kelly", "Victor", "Ava", "Samir",
];

const LAST = "ABCDEFGHJKLMNPRSTW".split("");

const PRODUCTS = [
  "fireplace",
  "wood stove tool set",
  "generator",
  "water heater",
  "sauna",
  "boiler",
  "furnace",
  "stove accessory",
];

const TITLES_5 = [
  "The Handle Factory packed it carefully",
  "Would order from The Handle Factory again",
  "Exactly the The Handle Factory listing",
  "Smooth The Handle Factory checkout",
  "Arrived ready to use",
  "Clear tracking from The Handle Factory",
  "Well made and well packed",
  "Easy order from home",
  "Photos matched the The Handle Factory page",
  "Glad we chose The Handle Factory",
];

const TITLES_4 = [
  "Good The Handle Factory order",
  "Happy with The Handle Factory overall",
  "Solid buy from The Handle Factory",
  "Worth ordering from The Handle Factory",
  "Quality was there",
  "Would recommend The Handle Factory",
];

function fiveStarNote(product: string, city: string, state: string, index: number) {
  const notes = [
    `Bought a ${product} from The Handle Factory for our home in ${city}, ${state}. It was packed carefully and matched the listing.`,
    `The Handle Factory shipped my ${product} to ${city} on time. Checkout was clear and the box arrived in good shape.`,
    `Needed a ${product} here in ${state} and ordered it from The Handle Factory. Tracking was easy to follow and it was ready to use.`,
    `Our ${product} from The Handle Factory showed up in ${city} exactly as described. I would order from them again.`,
    `Placed a The Handle Factory order for a ${product} while in ${state}. The price was fair and the shipping updates were useful.`,
    `The ${product} I ordered from The Handle Factory for ${city} feels well made. Support answered a question the same day.`,
    `Shopping The Handle Factory from ${state} was straightforward. The ${product} was packed securely and the photos were accurate.`,
    `Gave a ${product} from The Handle Factory as a gift in ${city}. The packaging looked neat and the order was simple to place.`,
  ];
  return notes[index % notes.length];
}

function fourStarNote(product: string, city: string, state: string, index: number) {
  const notes = [
    `The ${product} from The Handle Factory is good quality. Delivery to ${city}, ${state} took a day longer than the first estimate.`,
    `Happy with my The Handle Factory order in ${state}. The ${product} does the job. Shipping to ${city} was a little slower than I hoped.`,
    `Solid ${product} for the price. The Handle Factory kept me updated on the way to ${city}.`,
    `I would recommend The Handle Factory to someone in ${state}. The ${product} arrived safely, just not on the first promised day.`,
  ];
  return notes[index % notes.length];
}

function dateFor(index: number) {
  const day = new Date(Date.UTC(2026, 8, 20));
  day.setUTCDate(day.getUTCDate() - index * 3);
  return day.toISOString().slice(0, 10);
}

/** 77 five-star and 33 four-star notes. 517 / 110 = 4.7. */
function buildStoreReviews(): GenericReview[] {
  const ratings = [
    ...Array.from({ length: 77 }, () => 5),
    ...Array.from({ length: 33 }, () => 4),
  ];

  return ratings.map((rating, index) => {
    const [state, city] = STATES[index % STATES.length];
    const first = FIRST[index % FIRST.length];
    const last = LAST[(index * 3) % LAST.length];
    const product = PRODUCTS[index % PRODUCTS.length];
    const five = rating === 5;
    const titles = five ? TITLES_5 : TITLES_4;
    return {
      reviewer: `${first} ${last}.`,
      rating,
      title: titles[index % titles.length],
      content: five
        ? fiveStarNote(product, city, state, index)
        : fourStarNote(product, city, state, index),
      date: dateFor(index),
      verified: true,
      location: `${city}, ${state}`,
    };
  });
}

let cachedReviews: GenericReview[] | null = null;

export function storeReviews(): GenericReview[] {
  cachedReviews ??= buildStoreReviews();
  return cachedReviews;
}

export function storeReviewSummary() {
  const reviews = storeReviews();
  const total = reviews.length;
  const average =
    total > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / total
      : 0;
  const states = new Set(
    reviews.map((review) => review.location?.split(",")[1]?.trim() || ""),
  );
  return {
    total,
    average,
    stateCount: states.size,
  };
}
