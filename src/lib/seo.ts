import type { Metadata } from "next";
import { site } from "@/data/site";

export function absoluteUrl(path = "/"): string {
  const base = site.url.replace(/\/$/, "");
  if (path === "/" || path === "") return `${base}/`;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function createRootMetadata(): Metadata {
  return {
    metadataBase: new URL(site.url),
    title: {
      default: site.title,
      template: `%s | ${site.name}`,
    },
    description: site.description,
    applicationName: site.name,
    authors: [{ name: site.author, url: site.url }],
    creator: site.author,
    publisher: site.author,
    keywords: [...site.keywords],
    category: "portfolio",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    alternates: {
      canonical: "/",
    },
    openGraph: {
      type: "website",
      locale: site.locale,
      url: "/",
      siteName: site.name,
      title: site.title,
      description: site.tagline,
    },
    twitter: {
      card: "summary_large_image",
      title: site.title,
      description: site.tagline,
      creator: site.twitterHandle,
      site: site.twitterHandle,
    },
    appleWebApp: {
      capable: true,
      title: site.name,
      statusBarStyle: "black-translucent",
    },
    manifest: "/manifest.json",
  };
}

export function createPageMetadata({
  title,
  description = site.description,
  path = "/",
  noIndex = false,
}: {
  title: string;
  description?: string;
  path?: string;
  noIndex?: boolean;
}): Metadata {
  const url = absoluteUrl(path);

  return {
    title,
    description,
    alternates: noIndex ? undefined : { canonical: url },
    robots: noIndex ? { index: false, follow: true } : undefined,
    openGraph: {
      type: "website",
      locale: site.locale,
      url,
      siteName: site.name,
      title: `${title} | ${site.name}`,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${site.name}`,
      description,
      creator: site.twitterHandle,
    },
  };
}

export function structuredDataJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${site.url}/#website`,
        url: site.url,
        name: site.name,
        description: site.description,
        inLanguage: "en",
        publisher: { "@id": `${site.url}/#person` },
      },
      {
        "@type": "Person",
        "@id": `${site.url}/#person`,
        name: site.author,
        url: site.url,
        email: site.email,
        jobTitle: site.jobTitle,
        image: `${site.url}/icon.png`,
        sameAs: [...site.socialLinks],
      },
      {
        "@type": "WebApplication",
        "@id": `${site.url}/#app`,
        name: site.name,
        url: site.url,
        description: site.description,
        applicationCategory: "BrowserApplication",
        operatingSystem: "Web",
        browserRequirements: "Requires JavaScript",
        author: { "@id": `${site.url}/#person` },
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
      },
    ],
  };
}
