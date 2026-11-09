import { CONTENT_PAGES } from "@/lib/site-urls";
import type { FaqGroup } from "@/lib/types";

export type PolicySection = {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
};

export type PolicyPageDef = {
  slug: string;
  title: string;
  description: string;
  intro: string;
  groupTitles: string[];
  paragraphs?: string[];
  designed?: boolean;
  sections?: PolicySection[];
};

export const POLICY_PAGES: PolicyPageDef[] = [
  {
    slug: "shipping-policy",
    title: "Shipping & Delivery",
    description:
      "Free standard shipping throughout the United Kingdom, with order handling and delivery estimates for The Handle Factory.",
    intro:
      "We offer free standard shipping throughout the United Kingdom. Estimated total delivery is 5 to 7 business days.",
    groupTitles: ["Shipping and delivery"],
  },
  {
    slug: "return-and-refund-policy",
    title: "Returns & Refunds",
    description:
      "30-day returns, free prepaid return shipping, exchanges, and refunds for The Handle Factory.",
    intro:
      "We offer a 30-day return policy, free return shipping, and exchanges for eligible products.",
    groupTitles: ["Returns and exchanges", "Refunds"],
  },
  {
    slug: "cancellation-policy",
    title: "Order Cancellation Policy",
    description:
      "How to request a cancellation before dispatch, and the refund arrangements that follow.",
    intro:
      "You can contact us to request cancellation before dispatch. Your statutory rights remain unaffected.",
    groupTitles: ["Placing and managing orders"],
  },
  {
    slug: "payment-policy",
    title: "Payment Methods",
    description:
      "How payments are processed at The Handle Factory, including currency, authorisation, and refunds.",
    intro:
      "The payment methods available for your purchase are displayed during checkout. Prices are shown in British Pounds Sterling (GBP).",
    groupTitles: ["Payments and checkout"],
  },
  {
    slug: "buy-now-pay-later",
    title: "Payment Methods",
    description:
      "The payment methods available for your purchase are displayed during checkout.",
    intro:
      "Only payment methods shown as available at checkout are accepted. We do not publish a separate Buy Now, Pay Later policy.",
    groupTitles: [],
  },
  {
    slug: "warranty",
    title: "Warranty & Support",
    description:
      "How warranty coverage works for home heating equipment, generators, fireplaces, saunas, and other products.",
    intro:
      "Warranty coverage varies depending on the product and manufacturer. Your statutory consumer rights apply independently of any commercial warranty.",
    groupTitles: ["Warranty and product support"],
  },
  {
    slug: "privacy-policy",
    title: "Privacy Policy",
    description:
      "How The Handle Factory, operated by THE HANDLE FACTORY LTD, handles personal information.",
    intro:
      "This Privacy Policy explains how we collect, use, store, share, and protect personal data when you visit https://thehandlefactory.uk.",
    groupTitles: [],
  },
  {
    slug: "terms-of-service",
    title: "Terms & Conditions",
    description:
      "The terms that apply when you use https://thehandlefactory.uk and buy from THE HANDLE FACTORY LTD.",
    intro:
      "These Terms & Conditions explain the rules governing use of the website, purchases, payments, delivery, cancellations, returns, and warranties.",
    groupTitles: [],
  },
  {
    slug: "cookie-policy",
    title: "Cookie Policy",
    description: "How cookies and similar technologies may be used on thehandlefactory.uk.",
    intro:
      "This Cookie Policy explains what cookies are, why they are used, and how you can manage your preferences.",
    groupTitles: [],
  },
  {
    slug: "legal-notice",
    title: "Legal Notice",
    description:
      "Ownership and legal responsibilities of The Handle Factory, operated by THE HANDLE FACTORY LTD.",
    intro: "The Handle Factory is an online retail business operated by THE HANDLE FACTORY LTD.",
    groupTitles: [],
    paragraphs: [
      "Business address: Studio 210, 134–136 Curtain Road, London, England EC2A 3AR, United Kingdom. Please contact us before visiting, as this address is not advertised as a public retail showroom.",
      "Website: https://thehandlefactory.uk. Email: info@thehandlefactory.uk. Phone: +44 20 1219 1343.",
    ],
  },
  {
    slug: "accessibility-statement",
    title: "Accessibility Statement",
    description:
      "How The Handle Factory aims to keep the website usable, and how to report a barrier.",
    intro:
      "We are committed to improving the accessibility and usability of https://thehandlefactory.uk for all visitors, including people with disabilities and those using assistive technologies.",
    groupTitles: [],
  },
  {
    slug: "your-privacy-choices",
    title: "Your Privacy Choices",
    description:
      "How to manage cookies, marketing, and your data protection rights with THE HANDLE FACTORY LTD.",
    intro:
      "This page explains your privacy options under the UK GDPR, the Data Protection Act 2018, and PECR.",
    groupTitles: [],
  },
];

export function policyBySlug(slug: string) {
  return POLICY_PAGES.find((page) => page.slug === slug) ?? null;
}

export function groupsForPolicy(policy: PolicyPageDef, groups: FaqGroup[]) {
  if (!policy.groupTitles.length) return [];
  return groups.filter((group) => policy.groupTitles.includes(group.title));
}

export function contentPageTitle(slug: string) {
  return CONTENT_PAGES.find((page) => page.slug === slug)?.title ?? slug;
}
