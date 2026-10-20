import { Column, Heading, Schema } from "@once-ui-system/core";
import { baseURL, about, person, work } from "@/resources";
import { Projects } from "@/components/work/Projects";
import { ogImage, pageMetadata, siteUrl } from "@/utils/seo";

const metaTitle = "Projects by Abdelhamid Maaidni | Web and Mobile Work";

export async function generateMetadata() {
  return pageMetadata({
    title: metaTitle,
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
        title={metaTitle}
        description={work.description}
        image={ogImage(metaTitle)}
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
