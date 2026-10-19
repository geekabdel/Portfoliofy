import { home, person } from "@/resources";
import { profileLinks, siteUrl } from "@/utils/seo";

export function SiteJsonLd() {
  const personId = `${siteUrl("/")}#person`;
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": personId,
        name: "Abdelhamid Maaidni",
        alternateName: person.name,
        jobTitle: person.role,
        email: person.email,
        url: siteUrl("/"),
        image: siteUrl(person.avatar),
        address: {
          "@type": "PostalAddress",
          addressLocality: "Casablanca",
          addressCountry: "MA",
        },
        knowsAbout: ["Next.js", "React", "Laravel", "Flutter", "Magento", "PHP"],
        sameAs: profileLinks(),
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl("/")}#website`,
        url: siteUrl("/"),
        name: home.title,
        description: home.description,
        inLanguage: "en",
        publisher: { "@id": personId },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
