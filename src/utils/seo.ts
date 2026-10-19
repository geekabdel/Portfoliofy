import { Meta } from "@once-ui-system/core";
import type { Metadata } from "next";
import { baseURL, person, social } from "@/resources";

type PageMetadataOptions = {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  noindex?: boolean;
};

export function siteUrl(path = "/"): string {
  const base = baseURL.replace(/\/+$/, "");
  if (!path || path === "/") return base;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized.replace(/\/+$/, "")}`;
}

export function profileLinks(): string[] {
  return social
    .map((item) => item.link)
    .filter((link): link is string => Boolean(link) && !link.startsWith("mailto:"));
}

export function ogImage(title: string, image?: string): string {
  if (image) return image;
  return `/api/og/generate?title=${encodeURIComponent(title)}`;
}

export function pageMetadata({
  title,
  description,
  path,
  image,
  type = "website",
  publishedTime,
  noindex = false,
}: PageMetadataOptions): Metadata {
  const canonical = siteUrl(path);
  const resolvedImage = ogImage(title, image);
  const generated = Meta.generate({
    title,
    description,
    baseURL,
    path,
    image: resolvedImage,
    type,
    publishedTime,
    canonical,
    author: {
      name: person.name,
      url: siteUrl("/about"),
    },
    robots: noindex ? "noindex, follow" : "index, follow",
    alternates: [{ href: canonical, hrefLang: "en" }],
  });

  return {
    ...generated,
    alternates: {
      canonical,
      types: {
        "application/rss+xml": siteUrl("/api/rss"),
      },
    },
    openGraph: {
      ...generated.openGraph,
      url: canonical,
      siteName: person.name,
      locale: "en_US",
    },
    robots: noindex
      ? { index: false, follow: true }
      : {
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
  };
}
