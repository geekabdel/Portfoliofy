import { Column, Heading, Schema } from "@once-ui-system/core";
import { baseURL, about, person, work } from "@/resources";
import { Projects } from "@/components/work/Projects";
import { ogImage, pageMetadata, siteUrl } from "@/utils/seo";

export async function generateMetadata() {
  return pageMetadata({
    title: work.title,
    description: work.description,
    path: work.path,
  });
}

export default function Work() {
  return (
    <Column maxWidth="m" paddingTop="24">
      <Schema
        as="webPage"
        baseURL={baseURL}
        path={work.path}
        title={work.title}
        description={work.description}
        image={ogImage(work.title)}
        author={{
          name: person.name,
          url: siteUrl(about.path),
          image: siteUrl(person.avatar),
        }}
      />
      <Heading marginBottom="l" variant="heading-strong-xl" align="center">
        {work.title}
      </Heading>
      <Projects />
    </Column>
  );
}
