"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./CategoriesSlideOver.module.scss";
import { Drawer } from "@/components/ui/Drawer/Drawer";
import { SectionDivider } from "@/components/ui/Ornament/Ornament";
import { CloseIcon, ChevronRightIcon } from "@/components/ui/Icons";
import type { Collection } from "@/lib/shopify/types";
import { trackNavCollectionClick } from "@/lib/analytics";

interface CategoriesSlideOverProps {
  open: boolean;
  onClose: () => void;
  collections: Collection[];
}

/**
 * The "Categorie" slide-over: shows EVERY collection as a card, so all 5–6
 * categories are reachable without crowding the top nav. Opens from the right.
 */
export function CategoriesSlideOver({ open, onClose, collections }: CategoriesSlideOverProps) {
  return (
    <Drawer
      open={open}
      onClose={onClose}
      side="right"
      width="min(560px, 96vw)"
      labelledBy="categories-title"
    >
      <div className={styles.head}>
        <div className={styles.headText}>
          <p className={styles.eyebrow}>Il nostro negozio</p>
          <h2 id="categories-title" className={styles.title}>
            Tutte le categorie
          </h2>
        </div>
        <button className={styles.close} onClick={onClose} aria-label="Close categories">
          <CloseIcon />
        </button>
      </div>

      <SectionDivider className={styles.divider} />

      <nav className={styles.scroll} aria-label="All categories">
        {collections.length === 0 ? (
          <p className={styles.empty}>
            Categories will appear here once your Shopify collections are connected.
          </p>
        ) : (
          <ul className={styles.list}>
            {collections.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/collections/${c.handle}`}
                  className={styles.item}
                  onClick={() => {
                    trackNavCollectionClick(c.handle, "categories_slideover");
                    onClose();
                  }}
                >
                  <span className={styles.thumb}>
                    {c.image ? (
                      <Image
                        src={c.image.url}
                        alt={c.image.altText ?? c.title}
                        fill
                        sizes="88px"
                        className={styles.thumbImg}
                      />
                    ) : (
                      <span className={styles.thumbFallback} aria-hidden="true">
                        {c.title.charAt(0)}
                      </span>
                    )}
                  </span>
                  <span className={styles.itemBody}>
                    <span className={styles.itemTitle}>{c.title}</span>
                    {c.description && (
                      <span className={styles.itemDesc}>{c.description}</span>
                    )}
                  </span>
                  <ChevronRightIcon className={styles.chevron} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </nav>

      <div className={styles.footer}>
        <Link href="/collections" className={styles.viewAll} onClick={onClose}>
          Browse the full shop
          <ChevronRightIcon width={18} height={18} />
        </Link>
      </div>
    </Drawer>
  );
}
