"use client";

import { Row, Icon, Text, SmartLink } from "@once-ui-system/core";
import { person, social } from "@/resources";
import styles from "./Footer.module.scss";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Row as="footer" fillWidth padding="8" horizontal="center" s={{ direction: "column" }} style={{ minHeight: '120px', position: 'relative', zIndex: 100 }}>
      <Row
        className={styles.mobile}
        maxWidth="m"
        paddingY="8"
        paddingX="16"
        gap="16"
        horizontal="between"
        vertical="center"
        s={{
          direction: "column",
          horizontal: "center",
          align: "center",
        }}
        style={{ position: 'relative', zIndex: 1 }}
      >
        <Text variant="body-default-s" onBackground="neutral-strong" align="center">
          <Text onBackground="neutral-weak">© 2020 Abdelhamid Maaidni, All rights reserved.</Text>
        </Text>
        <Row gap="16" style={{ position: 'relative', zIndex: 2 }}>
          {social.map(
            (item) =>
              item.link && (
                <SmartLink
                  key={item.name}
                  href={item.link}
                  title={item.name}
                  aria-label={item.name}
                  style={{ position: 'relative', zIndex: 3, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Icon name={item.icon} size="m" onBackground="neutral-weak" />
                </SmartLink>
              ),
          )}
        </Row>
      </Row>
      <Row height="80" hide s={{ hide: false }} />
    </Row>
  );
};
