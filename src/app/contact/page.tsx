import { Column, Schema, Meta } from "@once-ui-system/core";
import { home, person, baseURL } from "@/resources";
import { Mailchimp } from "@/components";

export async function generateMetadata() {
  return Meta.generate({
    title: `Contact – ${person.name}`,
    description: `Get in touch with ${person.name}`,
    baseURL: baseURL,
    path: "/contact",
    image: home.image,
  });
}

export default function Contact() {
  return (
    <Column maxWidth="m" gap="xl" paddingY="12" horizontal="center">
      <Schema
        as="webPage"
        baseURL={baseURL}
        title={`Contact – ${person.name}`}
        description={`Get in touch with ${person.name}`}
        path="/contact"
        image={`/api/og/generate?title=${encodeURIComponent(`Contact – ${person.name}`)}`}
        author={{
          name: person.name,
          url: `${baseURL}/about`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      <Mailchimp />
    </Column>
  );
}
