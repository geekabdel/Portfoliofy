import {
  Heading,
  Text,
  Button,
  Avatar,
  RevealFx,
  Column,
  Badge,
  Row,
  Schema,
  Meta,
  Line,
} from "@once-ui-system/core";
import Image from "next/image";
import { home, about, person, baseURL, routes } from "@/resources";
import { Mailchimp } from "@/components";
import { Projects } from "@/components/work/Projects";
import { Posts } from "@/components/blog/Posts";

export async function generateMetadata() {
  return Meta.generate({
    title: home.title,
    description: home.description,
    baseURL: baseURL,
    path: home.path,
    image: home.image,
  });
}

export default function Home() {
  return (
    <Column maxWidth="m" gap="xl" paddingY="12" horizontal="center">
      <Schema
        as="webPage"
        baseURL={baseURL}
        path={home.path}
        title={home.title}
        description={home.description}
        image={`/api/og/generate?title=${encodeURIComponent(home.title)}`}
        author={{
          name: person.name,
          url: `${baseURL}${about.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      <Column fillWidth horizontal="center" gap="m">
        <Column maxWidth="s" horizontal="center" align="center">
          {home.featured.display && (
            <RevealFx
              fillWidth
              horizontal="center"
              paddingTop="16"
              paddingBottom="32"
              paddingLeft="12"
            >
              <Badge
                background="brand-alpha-weak"
                paddingX="12"
                paddingY="4"
                onBackground="neutral-strong"
                textVariant="label-default-s"
                arrow={false}
                href={home.featured.href}
              >
                <Row paddingY="2">{home.featured.title}</Row>
              </Badge>
            </RevealFx>
          )}
          <RevealFx translateY="4" fillWidth horizontal="center" paddingBottom="16">
            <Heading wrap="balance" variant="display-strong-m">
              {home.headline}
            </Heading>
          </RevealFx>
          <RevealFx translateY="8" delay={0.2} fillWidth horizontal="center" paddingBottom="32">
            <Text wrap="balance" onBackground="neutral-weak" variant="heading-default-l">
              {home.subline}
            </Text>
          </RevealFx>
          <RevealFx paddingTop="12" delay={0.4} horizontal="center" paddingLeft="12">
            <Button
              id="about"
              data-border="rounded"
              href={about.path}
              variant="secondary"
              size="m"
              weight="default"
              arrowIcon
            >
              <Row gap="8" vertical="center" paddingRight="4">
                {about.avatar.display && (
                  <Avatar
                    marginRight="8"
                    style={{ marginLeft: "-0.75rem" }}
                    src={person.avatar}
                    size="m"
                  />
                )}
                {about.title}
              </Row>
            </Button>
          </RevealFx>
        </Column>
      </Column>
      {routes["/work"] && (
        <Column fillWidth gap="24" marginBottom="l">
          <Row fillWidth paddingRight="64">
            <Line maxWidth={48} />
          </Row>
          <Row fillWidth gap="24" marginTop="40" s={{ direction: "column" }}>
            <Row flex={1} paddingLeft="l" paddingTop="24">
              <Heading as="h2" variant="display-strong-xs" wrap="balance">
                Latest Work
              </Heading>
            </Row>
            <Row flex={3} paddingX="20">
              <Projects exclude={["automate-design-handovers-with-a-figma-to-code-pipeline"]} range={[1, 1]} />
            </Row>
          </Row>
          <Row fillWidth paddingLeft="64" horizontal="end">
            <Line maxWidth={48} />
          </Row>
        </Column>
      )}
      {routes["/blog"] && (
        <Column fillWidth gap="24" marginBottom="l">
          <Row fillWidth paddingRight="64">
            <Line maxWidth={48} />
          </Row>
          <Row fillWidth gap="24" marginTop="40" s={{ direction: "column" }}>
            <Row flex={1} paddingLeft="l" paddingTop="24">
              <Heading as="h2" variant="display-strong-xs" wrap="balance">
                Latest from the blog
              </Heading>
            </Row>
            <Row flex={3} paddingX="20">
              <Posts range={[1, 2]} columns="2" thumbnail direction="column" />
            </Row>
          </Row>
          <Row fillWidth paddingLeft="64" horizontal="end">
            <Line maxWidth={48} />
          </Row>
        </Column>
      )}
      <Column fillWidth gap="24" marginBottom="l">
        <Row fillWidth horizontal="center">
          <Row gap="24" horizontal="center" style={{ flexWrap: 'wrap' }}>
            <Image 
              src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/magento/magento-original.svg" 
              alt="Magento" 
              width={48}
              height={48} 
              style={{ filter: 'grayscale(100%) opacity(0.7)' }} 
              loading="lazy"
              unoptimized
            />
            <Image 
              src="https://cdn.simpleicons.org/prestashop/df0067" 
              alt="Prestashop" 
              width={48}
              height={48} 
              style={{ filter: 'grayscale(100%) opacity(0.7)' }}
              unoptimized
            />
            <Image 
              src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/wordpress/wordpress-plain.svg" 
              alt="WordPress" 
              width={48}
              height={48} 
              style={{ filter: 'grayscale(100%) opacity(0.7)' }}
              unoptimized
            />
            <Image 
              src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" 
              alt="Docker" 
              width={48}
              height={48} 
              style={{ filter: 'grayscale(100%) opacity(0.7)' }}
              unoptimized
            />
            <Image 
              src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" 
              alt="Next.js" 
              width={48}
              height={48} 
              style={{ filter: 'grayscale(100%) opacity(0.7)' }}
              unoptimized
            />
            <Image 
              src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" 
              alt="React" 
              width={48}
              height={48} 
              style={{ filter: 'grayscale(100%) opacity(0.7)' }}
              unoptimized
            />
            <Image 
              src="https://cdn.simpleicons.org/laravel/ff2d20" 
              alt="Laravel" 
              width={48}
              height={48} 
              style={{ filter: 'grayscale(100%) opacity(0.7)' }}
              unoptimized
            />
            <Image 
              src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg" 
              alt="Flutter" 
              width={48}
              height={48} 
              style={{ filter: 'grayscale(100%) opacity(0.7)' }}
              unoptimized
            />
            <Image 
              src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dart/dart-original.svg" 
              alt="Dart" 
              width={48}
              height={48} 
              style={{ filter: 'grayscale(100%) opacity(0.7)' }}
              unoptimized
            />
            <Image 
              src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" 
              alt="JavaScript" 
              width={48}
              height={48} 
              style={{ filter: 'grayscale(100%) opacity(0.7)' }}
              unoptimized
            />
            <Image 
              src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" 
              alt="TypeScript" 
              width={48}
              height={48} 
              style={{ filter: 'grayscale(100%) opacity(0.7)' }}
              unoptimized
            />
            <Image 
              src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg" 
              alt="PHP" 
              width={48}
              height={48} 
              style={{ filter: 'grayscale(100%) opacity(0.7)' }}
              unoptimized
            />
            <Image 
              src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" 
              alt="MySQL" 
              width={48}
              height={48} 
              style={{ filter: 'grayscale(100%) opacity(0.7)' }}
              unoptimized
            />
            <Image 
              src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" 
              alt="PostgreSQL" 
              width={48}
              height={48} 
              style={{ filter: 'grayscale(100%) opacity(0.7)' }}
              unoptimized
            />
          </Row>
        </Row>
      </Column>
      <Mailchimp />
    </Column>
  );
}
