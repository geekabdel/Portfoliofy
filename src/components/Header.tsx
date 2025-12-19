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
  
  // Memoize pathname checks to prevent unnecessary recalculations
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
      // Prevent scrolling on body
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.height = '100%';
    } else {
      // Re-enable scrolling
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
    }
    
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
    };
  }, [isMobileMenuOpen]);

  // Close mobile menu when pathname changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: We intentionally want to run this when pathname changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Handle burger menu toggle
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prev => !prev);
  };

  // Handle overlay click/key to close menu
  const handleOverlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMobileMenuOpen(false);
  };

  const handleOverlayKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsMobileMenuOpen(false);
    }
  };

  // Handle escape key to close menu
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* Mobile Burger Menu Button - fixed top left */}
      <button
        type="button"
        className={styles.burgerButton}
        onClick={toggleMobileMenu}
        aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        aria-expanded={isMobileMenuOpen}
        aria-controls="mobile-menu"
      >
        <div className={`${styles.burgerIcon} ${isMobileMenuOpen ? styles.burgerIconOpen : ''}`}>
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </div>
      </button>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className={styles.mobileMenuOverlay}
          onClick={handleOverlayClick}
          onKeyDown={handleOverlayKeyDown}
          role="button"
          tabIndex={0}
          aria-label="Close menu overlay"
        />
      )}

      {/* Mobile Menu */}
      <aside 
        id="mobile-menu"
        className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.mobileMenuOpen : ''}`}
        aria-hidden={!isMobileMenuOpen}
      >
        <nav className={styles.mobileNav} aria-label="Mobile navigation">
          {routes["/"] && (
            <SmartLink 
              href="/" 
              className={`${styles.mobileNavItem} ${pathChecks.isHome ? styles.active : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Icon name="home" />
              <span>Home</span>
            </SmartLink>
          )}
          {routes["/about"] && (
            <SmartLink 
              href="/about" 
              className={`${styles.mobileNavItem} ${pathChecks.isAbout ? styles.active : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Icon name="person" />
              <span>About</span>
            </SmartLink>
          )}
          {routes["/work"] && (
            <SmartLink 
              href="/work" 
              className={`${styles.mobileNavItem} ${pathChecks.isWork ? styles.active : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Icon name="grid" />
              <span>Work</span>
            </SmartLink>
          )}
          {routes["/blog"] && (
            <SmartLink 
              href="/blog" 
              className={`${styles.mobileNavItem} ${pathChecks.isBlog ? styles.active : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Icon name="book" />
              <span>Blog</span>
            </SmartLink>
          )}
          {routes["/gallery"] && (
            <SmartLink 
              href="/gallery" 
              className={`${styles.mobileNavItem} ${pathChecks.isGallery ? styles.active : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Icon name="gallery" />
              <span>Gallery</span>
            </SmartLink>
          )}
          <SmartLink 
            href="/contact" 
            className={`${styles.mobileNavItem} ${pathChecks.isContact ? styles.active : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Icon name="email" />
            <span>Contact</span>
          </SmartLink>
          
          {display.themeSwitcher && (
            <div className={styles.mobileMenuThemeToggle}>
              <ThemeToggle />
            </div>
          )}
        </nav>
      </aside>

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
        <Row paddingLeft="12" vertical="center" textVariant="body-default-s" className={styles.desktopLogoContainer}>
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
        <Row className={styles.desktopNavContainer}>
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
