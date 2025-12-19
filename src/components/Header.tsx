"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import { useMemo, useState, useEffect } from "react";

import { Fade, Flex, Line, Row, ToggleButton, SmartLink, Icon } from "@once-ui-system/core";

import { routes, display, person, about, blog, work, gallery } from "@/resources";
import { ThemeToggle } from "./ThemeToggle";
import styles from "./Header.module.scss";

export const Header = () => {
  const pathname = usePathname() ?? "";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Memoize pathname checks to prevent unnecessary recalculations,
  const pathChecks = useMemo(() => ({
    isHome: pathname === "/",
    isAbout: pathname === "/about",
    isWork: pathname.startsWith("/work"),
    isBlog: pathname.startsWith("/blog"),
    isGallery: pathname.startsWith("/gallery"),
    isContact: pathname === "/contact",
  }), [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Close mobile menu when pathname changes
  useEffect(() => {
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  }, [pathname, isMobileMenuOpen]);

  return (
    <>
      {/* Mobile Burger Menu Button - fixed top left */}
      <button
        type="button"
        className={styles.burgerButton}
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle menu"
        aria-expanded={isMobileMenuOpen}
      >
        <div className={`${styles.burgerIcon} ${isMobileMenuOpen ? styles.burgerIconOpen : ''}`}>
          <span />
          <span />
          <span />
        </div>
      </button>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className={styles.mobileMenuOverlay}
          onClick={() => setIsMobileMenuOpen(false)}
          onKeyDown={(e) => {
            if (e.key === 'Escape' || e.key === 'Enter') {
              setIsMobileMenuOpen(false);
            }
          }}
          role="button"
          tabIndex={0}
          aria-label="Close menu"
        />
      )}

      {/* Mobile Menu */}
      <div className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.mobileMenuOpen : ''}`}>
        <nav className={styles.mobileNav}>
          {routes["/"] && (
            <SmartLink href="/" className={`${styles.mobileNavItem} ${pathChecks.isHome ? styles.active : ''}`}>
              <Icon name="home" />
              <span>Home</span>
            </SmartLink>
          )}
          {routes["/about"] && (
            <SmartLink href="/about" className={`${styles.mobileNavItem} ${pathChecks.isAbout ? styles.active : ''}`}>
              <Icon name="person" />
              <span>About</span>
            </SmartLink>
          )}
          {routes["/work"] && (
            <SmartLink href="/work" className={`${styles.mobileNavItem} ${pathChecks.isWork ? styles.active : ''}`}>
              <Icon name="grid" />
              <span>Work</span>
            </SmartLink>
          )}
          {routes["/blog"] && (
            <SmartLink href="/blog" className={`${styles.mobileNavItem} ${pathChecks.isBlog ? styles.active : ''}`}>
              <Icon name="book" />
              <span>Blog</span>
            </SmartLink>
          )}
          {routes["/gallery"] && (
            <SmartLink href="/gallery" className={`${styles.mobileNavItem} ${pathChecks.isGallery ? styles.active : ''}`}>
              <Icon name="gallery" />
              <span>Gallery</span>
            </SmartLink>
          )}
          <SmartLink href="/contact" className={`${styles.mobileNavItem} ${pathChecks.isContact ? styles.active : ''}`}>
            <Icon name="email" />
            <span>Contact</span>
          </SmartLink>
          
          {display.themeSwitcher && (
            <div className={styles.mobileMenuThemeToggle}>
              <ThemeToggle />
            </div>
          )}
        </nav>
      </div>

      {/* Desktop Navigation */}
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
      >
        <Row paddingLeft="12" fillWidth vertical="center" textVariant="body-default-s" className={styles.desktopLogoContainer}>
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
        <Row fillWidth horizontal="center" className={styles.desktopNavContainer}>
          <Row
            background="page"
            border="neutral-alpha-weak"
            radius="m-4"
            shadow="l"
            padding="4"
            horizontal="center"
            zIndex={1}
          >
            <Row gap="4" vertical="center" textVariant="body-default-m" suppressHydrationWarning className={styles.navbarIcons}>
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
                  <Line background="neutral-alpha-medium" vert maxHeight="24" className={styles.desktopThemeSeparator} />
                  <div className={styles.desktopThemeToggle}>
                    <ThemeToggle />
                  </div>
                </>
              )}
            </Row>
          </Row>
        </Row>
      </Row>
    </>
  );
};
