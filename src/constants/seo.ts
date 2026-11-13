// Update when a custom domain is connected.
export const SITE_URL = "https://www.hdnexora.in";

export type RouteMeta = {
  title: string;
  description: string;
  indexable: boolean;
  prerender: boolean;
};

const DEFAULT_DESCRIPTION =
  "HD NEXORA WEBTEC is a digital marketing and website solutions agency in Coimbatore, Tamil Nadu, offering SEO, local SEO, social media marketing, Google Ads, Meta Ads and website development.";

export const routeMeta: Record<string, RouteMeta> = {
  "/": {
    title: "HD NEXORA WEBTEC | Digital Marketing Agency in Coimbatore",
    description: DEFAULT_DESCRIPTION,
    indexable: true,
    prerender: true,
  },
  "/privacy-policy": {
    // Placeholder: stays out of search results until its wording is final.
    title: "Privacy Policy | HD NEXORA WEBTEC",
    description: "Privacy policy for HD NEXORA WEBTEC.",
    indexable: false,
    prerender: true,
  },
  "/terms-and-conditions": {
    title: "Terms & Conditions | HD NEXORA WEBTEC",
    description:
      "Terms & Conditions for HD NEXORA WEBTEC digital marketing services: monthly service, payment terms, scope, cancellation and results.",
    indexable: true,
    prerender: true,
  },
  "/book-project": {
    title: "Book a Project | HD NEXORA WEBTEC",
    description: DEFAULT_DESCRIPTION,
    indexable: false,
    prerender: false,
  },
};

export const NOT_FOUND_TITLE = "Page Not Found | HD NEXORA WEBTEC";
