import { notFound } from "next/navigation";
import { CustomMDX, ScrollToHash } from "@/components";
import {
  Column,
  Heading,
  HeadingNav,
  Row,
  Text,
  SmartLink,
  Avatar,
  Media,
  Line,
} from "@once-ui-system/core";
import { about, blog, person } from "@/resources";
import { formatDate } from "@/utils/formatDate";
import { getPosts } from "@/utils/utils";
import { ogImage, pageMetadata, siteUrl } from "@/utils/seo";
import React from "react";
import { Posts } from "@/components/blog/Posts";
import styles from "./page.module.scss";

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const posts = getPosts(["src", "app", "blog", "posts"]);
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string | string[] }>;
}) {
  const routeParams = await params;
  const slugPath = Array.isArray(routeParams.slug)
    ? routeParams.slug.join("/")
    : routeParams.slug || "";

  const posts = getPosts(["src", "app", "blog", "posts"]);
  const post = posts.find((post) => post.slug === slugPath);

  if (!post) return {};

  return pageMetadata({
    title: post.metadata.title,
    description: post.metadata.summary,
    path: `${blog.path}/${post.slug}`,
    image: post.metadata.image,
    imageAlt: post.metadata.imageAlt,
    type: "article",
    publishedTime: post.metadata.publishedAt,
    modifiedTime: post.metadata.updatedAt,
    keywords: post.metadata.keywords,
    tags: post.metadata.keywords,
    section: post.metadata.tag,
  });
}

export default async function Blog({ params }: { params: Promise<{ slug: string | string[] }> }) {
  const routeParams = await params;
  const slugPath = Array.isArray(routeParams.slug)
    ? routeParams.slug.join("/")
    : routeParams.slug || "";

  const post = getPosts(["src", "app", "blog", "posts"]).find((post) => post.slug === slugPath);

  if (!post) {
    notFound();
  }

  const postUrl = siteUrl(`${blog.path}/${post.slug}`);
  const personId = `${siteUrl("/")}#person`;
  const imageUrl = siteUrl(ogImage(post.metadata.title, post.metadata.image));
  const wordCount = post.content
    .replace(/<[^>]+>/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${postUrl}#article`,
        headline: post.metadata.title,
        description: post.metadata.summary,
        url: postUrl,
        mainEntityOfPage: { "@type": "WebPage", "@id": postUrl },
        image: {
          "@type": "ImageObject",
          url: imageUrl,
          caption: post.metadata.imageAlt || post.metadata.title,
        },
        datePublished: post.metadata.publishedAt,
        dateModified: post.metadata.updatedAt || post.metadata.publishedAt,
        inLanguage: "en",
        ...(post.metadata.tag ? { articleSection: post.metadata.tag } : {}),
        ...(post.metadata.keywords.length ? { keywords: post.metadata.keywords.join(", ") } : {}),
        wordCount,
        author: {
          "@type": "Person",
          "@id": personId,
          name: "Abdelhamid Maaidni",
          url: siteUrl(about.path),
          image: siteUrl(person.avatar),
        },
        publisher: { "@id": personId },
        isPartOf: { "@id": `${siteUrl("/")}#website` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: siteUrl("/") },
          { "@type": "ListItem", position: 2, name: "Blog", item: siteUrl(blog.path) },
          { "@type": "ListItem", position: 3, name: post.metadata.title, item: postUrl },
        ],
      },
    ],
  };

  const avatars =
    post.metadata.team?.map((person) => ({
      src: person.avatar,
    })) || [];

  return (
    <Row fillWidth>
      <Row className={styles.hideOnMobile} maxWidth={12} m={{ hide: true }} />
      <Row fillWidth horizontal="center">
        <Column
          as="section"
          className={styles.mobileFullBleed}
          maxWidth="m"
          horizontal="center"
          gap="l"
          paddingTop="24"
        >
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
          />
          <Column className={styles.mobileFullWidth} maxWidth="s" gap="16" horizontal="center" align="center">
            <SmartLink href="/blog">
              <Text variant="label-strong-m">Blog</Text>
            </SmartLink>
            <Text variant="body-default-xs" onBackground="neutral-weak" marginBottom="12">
              {post.metadata.publishedAt && formatDate(post.metadata.publishedAt)}
              {post.metadata.updatedAt &&
                post.metadata.updatedAt !== post.metadata.publishedAt &&
                ` · Updated ${formatDate(post.metadata.updatedAt)}`}
            </Text>
            <Heading variant="display-strong-m">{post.metadata.title}</Heading>
          </Column>
          <Row marginBottom="32" horizontal="center">
            <Row gap="16" vertical="center">
              <Avatar size="s" src={person.avatar} />
              <Text variant="label-default-m" onBackground="brand-weak">
                {person.name}
              </Text>
            </Row>
          </Row>
          {post.metadata.image && (
            <Media
              src={post.metadata.image}
              alt={post.metadata.imageAlt || post.metadata.title}
              aspectRatio="16/9"
              priority
              sizes="(min-width: 768px) 100vw, 768px"
              border="neutral-alpha-weak"
              radius="l"
              marginTop="12"
              marginBottom="8"
            />
          )}
          <Column className={styles.mobilePostWidth90} as="article" maxWidth="s">
            <CustomMDX source={post.content} />
          </Column>

          <Column fillWidth s={{ hide: true }} gap="40" horizontal="center" marginTop="40">
            <Line maxWidth="40" />
            <Heading as="h2" variant="heading-strong-xl" marginBottom="24">
              Recent posts
            </Heading>
            <Posts exclude={[post.slug]} range={[1, 2]} columns="2" thumbnail direction="column" />
          </Column>
          <ScrollToHash />
        </Column>
      </Row>
      <Column
        className={styles.hideOnMobile}
        maxWidth={12}
        paddingLeft="40"
        fitHeight
        position="sticky"
        top="80"
        gap="16"
        m={{ hide: true }}
      >
        <HeadingNav fitHeight />
      </Column>
    </Row>
  );
}
