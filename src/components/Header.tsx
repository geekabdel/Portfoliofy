"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import { useMemo } from "react";

import { Fade, Flex, Line, Row, ToggleButton, SmartLink } from "@once-ui-system/core";

import { routes, display, person, about, blog, work, gallery } from "@/resources";
import { ThemeToggle } from "./ThemeToggle";
import styles from "./Header.module.scss";

export const Header = () => {
  const pathname = usePathname() ?? "";
  
  // Memoize pathname checks to prevent unnecessary recalculations
  const pathChecks = useMemo(() => ({
    isHome: pathname === "/",
    isAbout: pathname === "/about",
    isWork: pathname.startsWith("/work"),
    isBlog: pathname.startsWith("/blog"),
    isGallery: pathname.startsWith("/gallery"),
    isContact: pathname === "/contact",
  }), [pathname]);

  return (
    <>
      {/* Mobile theme toggle - fixed top right */}
      {display.themeSwitcher && (
        <div 
          className={styles.mobileThemeToggle}
          style={{
            position: 'fixed',
            top: '12px',
            right: '12px',
            zIndex: 1000,
          }}
        >
          <ThemeToggle />
        </div>
      )}
      <Fade s={{ hide: true }} fillWidth position="fixed" height="80" zIndex={9} />
      <Fade
        hide
        s={{ hide: false }}
        fillWidth
        position="fixed"
        bottom="0"
        to="top"
        height="80"
        zIndex={9}
      />
      <Row
        fitHeight
        className={styles.position}
        position="sticky"
        as="header"
        zIndex={9}
        fillWidth
        padding="8"
        horizontal="center"
        data-border="rounded"
        s={{
          position: "fixed",
        }}
      >
        <Row paddingLeft="12" fillWidth vertical="center" textVariant="body-default-s" s={{ paddingLeft: "8", fillWidth: false, flex: "0 0 auto" }}>
          <SmartLink href="/" className={styles.logoContainer}>
            <Image
              src="/logo-light.png"
              alt="Logo"
              width={150}
              height={60}
              className={styles.logoLight}
              priority
              fetchPriority="high"
            />
            <Image
              src="/logo-dark.png"
              alt="Logo"
              width={150}
              height={60}
              className={styles.logoDark}
              priority
              fetchPriority="high"
            />
          </SmartLink>
        </Row>
        <Row fillWidth horizontal="center" s={{ flex: "1 1 auto", minWidth: "0" }}>
          <Row
            background="page"
            border="neutral-alpha-weak"
            radius="m-4"
            shadow="l"
            padding="4"
            horizontal="center"
            zIndex={1}
            s={{ padding: "2", maxWidth: "100%" }}
          >
            <Row gap="4" vertical="center" textVariant="body-default-m" suppressHydrationWarning className={styles.navbarIcons} s={{ gap: "1", textVariant: "body-default-s" }} style={{ overflow: 'visible' }}>
              {routes["/"] && (
                <ToggleButton prefixIcon="home" href="/" label="Home" selected={pathChecks.isHome} />
              )}
              {routes["/"] && (routes["/about"] || routes["/work"] || routes["/blog"] || routes["/gallery"]) && (
                <Line background="neutral-alpha-medium" vert maxHeight="24" />
              )}
              {routes["/about"] && (
                <ToggleButton
                  prefixIcon="person"
                  href="/about"
                  label="About"
                  selected={pathChecks.isAbout}
                />
              )}
              {routes["/work"] && (
                <ToggleButton
                  prefixIcon="grid"
                  href="/work"
                  label="Work"
                  selected={pathChecks.isWork}
                />
              )}
              {routes["/blog"] && (
                <ToggleButton
                  prefixIcon="book"
                  href="/blog"
                  label="Blog"
                  selected={pathChecks.isBlog}
                />
              )}
              {routes["/gallery"] && (
                <ToggleButton
                  prefixIcon="gallery"
                  href="/gallery"
                  label="Gallery"
                  selected={pathChecks.isGallery}
                />
              )}
              {(routes["/"] || routes["/about"] || routes["/work"] || routes["/blog"] || routes["/gallery"]) && (
                <Line background="neutral-alpha-medium" vert maxHeight="24" />
              )}
              <ToggleButton
                prefixIcon="email"
                href="/contact"
                label="Contact"
                selected={pathChecks.isContact}
              />
              {display.themeSwitcher && (
                <>
                  <Line background="neutral-alpha-medium" vert maxHeight="24" s={{ hide: true }} className={styles.desktopThemeSeparator} />
                  <div className={styles.desktopThemeToggle}>
                    <ThemeToggle />
                  </div>
                </>
              )}
            </Row>
          </Row>
        </Row>
        <Flex fillWidth horizontal="end" vertical="center" s={{ display: "none" }}>
          <Flex
            paddingRight="12"
            horizontal="end"
            vertical="center"
            textVariant="body-default-s"
            gap="20"
          >
          </Flex>
        </Flex>
      </Row>
    </>
  );
};
