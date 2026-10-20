import { Column, Heading, Schema } from "@once-ui-system/core";
import { Posts } from "@/components/blog/Posts";
import { baseURL, blog, person, about } from "@/resources";
import { ogImage, pageMetadata, siteUrl } from "@/utils/seo";

const metaTitle = "Blog | Abdelhamid Maaidni on Next.js and Web Development";

export async function generateMetadata() {
  return pageMetadata({
    title: metaTitle,
    description: blog.description,
    path: blog.path,
  });
}

export default function Blog() {
  return (
    <Column maxWidth="m" paddingTop="24">
      <Schema
        as="webPage"
        baseURL={baseURL}
        title={metaTitle}
        description={blog.description}
        path={blog.path}
        image={ogImage(metaTitle)}
        author={{
          name: person.name,
          url: siteUrl(about.path),
          image: siteUrl(person.avatar),
        }}
      />
      <Heading marginBottom="l" variant="heading-strong-xl" marginLeft="24">
        {blog.title}
      </Heading>
      <Column fillWidth flex={1} gap="40">
        <Posts columns="2" thumbnail direction="column" />
      </Column>
    </Column>
  );
}
