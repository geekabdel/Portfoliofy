import { getPosts } from "@/utils/utils";
import { blog, person } from "@/resources";
import { siteUrl } from "@/utils/seo";
import { NextResponse } from "next/server";

function xmlEscape(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const posts = getPosts(["src", "app", "blog", "posts"]);

  // Sort posts by date (newest first)
  const sortedPosts = posts.sort((a, b) => {
    return new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime();
  });

  // Generate RSS XML
  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${xmlEscape(blog.title)}</title>
    <link>${siteUrl("/blog")}</link>
    <description>${xmlEscape(blog.description)}</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl("/api/rss")}" rel="self" type="application/rss+xml" />
    <managingEditor>${xmlEscape(person.email)} (${xmlEscape(person.name)})</managingEditor>
    <webMaster>${xmlEscape(person.email)} (${xmlEscape(person.name)})</webMaster>
    <image>
      <url>${siteUrl(person.avatar || "/images/avatar.jpg")}</url>
      <title>${xmlEscape(blog.title)}</title>
      <link>${siteUrl("/blog")}</link>
    </image>
    ${sortedPosts
      .map(
        (post) => `
    <item>
      <title>${xmlEscape(post.metadata.title)}</title>
      <link>${siteUrl(`/blog/${post.slug}`)}</link>
      <guid>${siteUrl(`/blog/${post.slug}`)}</guid>
      <pubDate>${new Date(post.metadata.publishedAt).toUTCString()}</pubDate>
      <description><![CDATA[${post.metadata.summary}]]></description>
      ${post.metadata.image ? `<enclosure url="${siteUrl(post.metadata.image)}" type="image/jpeg" />` : ""}
      ${post.metadata.tag ? `<category>${xmlEscape(post.metadata.tag)}</category>` : ""}
      <author>${xmlEscape(person.email)} (${xmlEscape(person.name)})</author>
    </item>`,
      )
      .join("")}
  </channel>
</rss>`;

  // Return the RSS XML with the appropriate content type
  return new NextResponse(rssXml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
