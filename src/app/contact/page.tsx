import { Column, Heading, Schema } from "@once-ui-system/core";
import { person, baseURL, about } from "@/resources";
import { Mailchimp } from "@/components";
import { ogImage, pageMetadata, siteUrl } from "@/utils/seo";

const title = "Contact Abdelhamid Maaidni | Web and Mobile Developer";
const description =
  "Have a project in mind? I build Next.js, React, Laravel, and Flutter products and can take it from planning and design through deployment for you.";

export async function generateMetadata() {
  return pageMetadata({
    title,
    description,
    path: "/contact",
  });
}

export default function Contact() {
  return (
    <Column maxWidth="m" gap="xl" paddingY="12" horizontal="center">
      <Schema
        as="webPage"
        baseURL={baseURL}
        title={title}
        description={description}
        path="/contact"
        image={ogImage(title)}
        author={{
          name: person.name,
          url: siteUrl(about.path),
          image: siteUrl(person.avatar),
        }}
      />
      <Heading as="h1" variant="display-strong-l">
        Contact
      </Heading>
      <Mailchimp />
    </Column>
  );
}
