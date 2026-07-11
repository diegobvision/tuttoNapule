"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./Header.module.scss";
import { Logo } from "@/components/ui/Logo/Logo";
import { SearchIcon, CartIcon, MenuIcon } from "@/components/ui/Icons";
import { MobileMenu } from "@/components/layout/MobileMenu/MobileMenu";
import { SearchBar } from "@/components/layout/SearchBar/SearchBar";
import { useCart } from "@/context/CartContext";
import type { Collection } from "@/lib/shopify/types";
import type { NavCollection } from "./Header";
import { trackNavCollectionClick, trackNavLinkClick, trackSearchOpen } from "@/lib/analytics";

interface HeaderClientProps {
  /** Collections shown in the top nav (from NEXT_PUBLIC_NAV_COLLECTIONS). */
  navCollections: NavCollection[];
  /** Every collection — for the mobile menu. */
  allCollections: Collection[];
}

export function HeaderClient({ navCollections, allCollections }: HeaderClientProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  // After a nav click the header persists across the route change, so the
  // link keeps :focus / :hover and its preview panel would stay open. Suppress
  // that panel until the pointer leaves and re-enters the item.
  const [suppressedHandle, setSuppressedHandle] = useState<string | null>(null);
  const { totalQuantity, openCart } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const openSearch = () => {
    trackSearchOpen("header");
    setSearchOpen(true);
  };

  return (
    <>
      <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
        <div className={styles.bar}>
          {/* Left: mobile hamburger + logo */}
          <div className={styles.left}>
            <button
              className={styles.iconBtn}
              data-mobile
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <MenuIcon />
            </button>
            <Logo priority className={styles.logo} />
          </div>

          {/* Center: desktop nav — each collection link reveals a preview
              panel (cover image + short description) on hover/focus. */}
          <nav className={styles.nav} aria-label="Primary">
            <ul className={styles.navList}>
              {navCollections.map((c) => (
                <li
                  key={c.handle}
                  className={styles.navItem}
                  onMouseLeave={() => setSuppressedHandle((h) => (h === c.handle ? null : h))}
                >
                  <Link
                    href={`/collections/${c.handle}`}
                    className={styles.navLink}
                    onClick={(e) => {
                      trackNavCollectionClick(c.handle, "header");
                      setSuppressedHandle(c.handle);
                      e.currentTarget.blur();
                    }}
                  >
                    {c.title}
                  </Link>

                  {c.image && (
                    <div
                      className={`${styles.panel} ${
                        suppressedHandle === c.handle ? styles.panelSuppressed : ""
                      }`}
                      aria-hidden="true"
                    >
                      <div className={styles.panelCard}>
                        <Image
                          src={c.image.url}
                          alt=""
                          width={480}
                          height={300}
                          className={styles.panelImage}
                        />
                        {c.description && (
                          <p className={styles.panelText}>{c.description}</p>
                        )}
                      </div>
                    </div>
                  )}
                </li>
              ))}

              <li className={styles.navItem}>
                <Link
                  href="/blog"
                  className={styles.navLink}
                  onClick={() => trackNavLinkClick("Journal", "header")}
                >
                  Journal
                </Link>
              </li>
            </ul>
          </nav>

          {/* Right: actions */}
          <div className={styles.actions}>
            <button className={styles.iconBtn} onClick={openSearch} aria-label="Search">
              <SearchIcon />
            </button>
            <button
              className={styles.iconBtn}
              onClick={openCart}
              aria-label={`Basket, ${totalQuantity} item${totalQuantity === 1 ? "" : "s"}`}
            >
              <CartIcon />
              {totalQuantity > 0 && <span className={styles.badge}>{totalQuantity}</span>}
            </button>
          </div>
        </div>
      </header>

      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        collections={allCollections}
        onOpenSearch={openSearch}
      />
      <SearchBar open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
