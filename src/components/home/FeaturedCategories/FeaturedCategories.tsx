import Image from "next/image";
import styles from "./FeaturedCategories.module.scss";
import { SectionHeader } from "@/components/ui/SectionHeader/SectionHeader";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { ChevronRightIcon } from "@/components/ui/Icons";
import { getCollectionMeta } from "@/lib/shopify";
import { FEATURED_COLLECTION_HANDLES, humaniseHandle } from "@/lib/config";

// Local imagery used as a graceful fallback before Shopify collection images
// are set (keyed by position so tiles always look intentional in preview).
const FALLBACK_IMAGES = [
  "/images/coffee-moka.jpg",
  "/images/italian-pantry.jpg",
  "/images/positano-dusk.jpg",
  "/images/hero-naples-bay.jpg",
];

export async function FeaturedCategories() {
  const metas = await Promise.all(
    FEATURED_COLLECTION_HANDLES.map((handle) => getCollectionMeta(handle))
  );

  const tiles = FEATURED_COLLECTION_HANDLES.map((handle, i) => {
    const meta = metas[i];
    return {
      handle,
      title: meta?.title ?? humaniseHandle(handle),
      description: meta?.description ?? "",
      image: meta?.image?.url ?? FALLBACK_IMAGES[i % FALLBACK_IMAGES.length],
      alt: meta?.image?.altText ?? meta?.title ?? humaniseHandle(handle),
    };
  });

  if (tiles.length === 0) return null;

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <SectionHeader
          eyebrow="Il nostro negozio"
          title="Shop by category"
          note="From the morning moka to Sunday's ragù — a hand-picked selection of the flavours that make Naples, Naples."
        />

        <ul className={styles.grid}>
          {tiles.map((tile, i) => (
            <li key={tile.handle} className={i === 0 ? styles.cellWide : styles.cell}>
              <TrackedLink
                href={`/collections/${tile.handle}`}
                className={styles.tile}
                event="view_collection_click"
                eventParams={{ collection_handle: tile.handle, collection_title: tile.title }}
              >
                <Image
                  src={tile.image}
                  alt={tile.alt}
                  fill
                  sizes={i === 0 ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 50vw, 25vw"}
                  className={styles.image}
                />
                <span className={styles.tileScrim} />
                <span className={styles.tileBody}>
                  <span className={styles.tileTitle}>{tile.title}</span>
                  <span className={styles.tileCta}>
                    Explore <ChevronRightIcon width={16} height={16} />
                  </span>
                </span>
              </TrackedLink>
            </li>
          ))}
        </ul>

        <div className={styles.viewAllWrap}>
          <TrackedLink
            href="/collections"
            className={styles.viewAll}
            event="view_collection_click"
            eventParams={{ collection_handle: "all", collection_title: "All collections" }}
          >
            View the full shop
            <ChevronRightIcon width={18} height={18} />
          </TrackedLink>
        </div>
      </div>
    </section>
  );
}
