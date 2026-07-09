"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./Header.module.scss";
import { Logo } from "@/components/ui/Logo/Logo";
import { SearchIcon, CartIcon, MenuIcon, ChevronDownIcon, GridIcon } from "@/components/ui/Icons";
import { CategoriesSlideOver } from "@/components/layout/CategoriesSlideOver/CategoriesSlideOver";
import { MobileMenu } from "@/components/layout/MobileMenu/MobileMenu";
import { SearchBar } from "@/components/layout/SearchBar/SearchBar";
import { useCart } from "@/context/CartContext";
import type { Collection } from "@/lib/shopify/types";
import {
  trackNavCategoriesOpen,
  trackNavCollectionClick,
  trackNavLinkClick,
  trackSearchOpen,
} from "@/lib/analytics";

interface HeaderClientProps {
  /** Collections shown directly in the top nav (from NEXT_PUBLIC_NAV_COLLECTIONS). */
  navCollections: { handle: string; title: string }[];
  /** Every collection — for the "Categorie" slide-over + mobile menu. */
  allCollections: Collection[];
}

export function HeaderClient({ navCollections, allCollections }: HeaderClientProps) {
  const [scrolled, setScrolled] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { totalQuantity, openCart } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const openCategories = () => {
    trackNavCategoriesOpen("header");
    setCategoriesOpen(true);
  };

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

          {/* Center: desktop nav */}
          <nav className={styles.nav} aria-label="Primary">
            <button className={styles.navButton} onClick={openCategories} aria-haspopup="dialog">
              <GridIcon width={18} height={18} />
              Categorie
              <ChevronDownIcon width={16} height={16} />
            </button>

            {navCollections.map((c) => (
              <Link
                key={c.handle}
                href={`/collections/${c.handle}`}
                className={styles.navLink}
                onClick={() => trackNavCollectionClick(c.handle, "header")}
              >
                {c.title}
              </Link>
            ))}

            <Link
              href="/blog"
              className={styles.navLink}
              onClick={() => trackNavLinkClick("Journal", "header")}
            >
              Journal
            </Link>
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

      <CategoriesSlideOver
        open={categoriesOpen}
        onClose={() => setCategoriesOpen(false)}
        collections={allCollections}
      />
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
