"use client";

import Link from "next/link";
import styles from "./MobileMenu.module.scss";
import { Drawer } from "@/components/ui/Drawer/Drawer";
import { SectionDivider } from "@/components/ui/Ornament/Ornament";
import { CloseIcon, SearchIcon, ChevronRightIcon } from "@/components/ui/Icons";
import type { Collection } from "@/lib/shopify/types";
import { trackNavCollectionClick, trackNavLinkClick } from "@/lib/analytics";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  collections: Collection[];
  onOpenSearch: () => void;
}

const PRIMARY_LINKS = [
  { href: "/collections", label: "Shop all" },
  { href: "/blog", label: "Journal" },
  { href: "/pages/about", label: "Our story" },
];

export function MobileMenu({ open, onClose, collections, onOpenSearch }: MobileMenuProps) {
  return (
    <Drawer open={open} onClose={onClose} side="left" width="min(400px, 88vw)" ariaLabel="Menu">
      <div className={styles.head}>
        <span className={styles.brand}>Tutto Napule</span>
        <button className={styles.close} onClick={onClose} aria-label="Close menu">
          <CloseIcon />
        </button>
      </div>

      <button
        className={styles.searchTrigger}
        onClick={() => {
          onClose();
          onOpenSearch();
        }}
      >
        <SearchIcon width={20} height={20} />
        Search the shop
      </button>

      <nav className={styles.scroll} aria-label="Mobile">
        <ul className={styles.primary}>
          {PRIMARY_LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={styles.primaryLink}
                onClick={() => {
                  trackNavLinkClick(l.label, "mobile_menu");
                  onClose();
                }}
              >
                {l.label}
                <ChevronRightIcon width={18} height={18} />
              </Link>
            </li>
          ))}
        </ul>

        <SectionDivider variant="quatrefoil" className={styles.divider} />

        <p className={styles.groupLabel}>Categorie</p>
        <ul className={styles.categories}>
          {collections.map((c) => (
            <li key={c.id}>
              <Link
                href={`/collections/${c.handle}`}
                className={styles.categoryLink}
                onClick={() => {
                  trackNavCollectionClick(c.handle, "mobile_menu");
                  onClose();
                }}
              >
                {c.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </Drawer>
  );
}
