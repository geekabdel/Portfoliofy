import { Flex, Schema } from "@once-ui-system/core";
import GalleryView from "@/components/gallery/GalleryView";
import { baseURL, gallery, person, about } from "@/resources";
import { ogImage, pageMetadata, siteUrl } from "@/utils/seo";

export async function generateMetadata() {
  return pageMetadata({
    title: gallery.title,
    description: gallery.description,
    path: gallery.path,
    noindex: true,
  });
}

export default function Gallery() {
  return (
    <Flex maxWidth="l">
      <Schema
        as="webPage"
        baseURL={baseURL}
        title={gallery.title}
        description={gallery.description}
        path={gallery.path}
        image={ogImage(gallery.title)}
        author={{
          name: person.name,
          url: siteUrl(about.path),
          image: siteUrl(person.avatar),
        }}
      />
      <GalleryView />
    </Flex>
  );
}
