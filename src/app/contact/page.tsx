import { Column, Heading, Schema } from "@once-ui-system/core";
import { person, baseURL, about } from "@/resources";
import { Mailchimp } from "@/components";
import { ogImage, pageMetadata, siteUrl } from "@/utils/seo";

const title = `Contact – ${person.name}`;
const description = `Get in touch with ${person.name}, a web and mobile developer based in Casablanca.`;

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
