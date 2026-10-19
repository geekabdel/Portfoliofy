import type { MetadataRoute } from "next";
import { routes as routesConfig } from "@/resources";
import { siteUrl } from "@/utils/seo";
import { getPosts } from "@/utils/utils";

const staticPages: Array<{
  path: `/${string}`;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}> = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/about", changeFrequency: "monthly", priority: 0.8 },
  { path: "/work", changeFrequency: "weekly", priority: 0.9 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.8 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.6 },
  { path: "/gallery", changeFrequency: "monthly", priority: 0.4 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = staticPages
    .filter((page) => routesConfig[page.path] !== false)
    .map((page) => ({
      url: siteUrl(page.path),
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    }));

  const blogs = getPosts(["src", "app", "blog", "posts"]).map((post) => ({
    url: siteUrl(`/blog/${post.slug}`),
    lastModified: post.metadata.publishedAt,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const works = getPosts(["src", "app", "work", "projects"]).map((post) => ({
    url: siteUrl(`/work/${post.slug}`),
    lastModified: post.metadata.publishedAt,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...routes, ...blogs, ...works];
}
