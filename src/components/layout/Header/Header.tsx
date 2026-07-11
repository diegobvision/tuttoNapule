import { HeaderClient } from "./HeaderClient";
import { getAllCollections } from "@/lib/shopify";
import { NAV_COLLECTION_HANDLES, humaniseHandle } from "@/lib/config";
import type { Collection } from "@/lib/shopify/types";

export interface NavCollection {
  handle: string;
  title: string;
  /** First sentence of the collection description — shown in the hover panel. */
  description: string;
  image: { url: string; altText: string } | null;
}

// Local imagery as a graceful fallback before Shopify collection images are
// set (keyed by position, mirroring FeaturedCategories).
const FALLBACK_IMAGES = [
  "/images/coffee-moka.jpg",
  "/images/italian-pantry.jpg",
  "/images/positano-dusk.jpg",
  "/images/hero-naples-bay.jpg",
];

/** Trim a description to something hover-panel sized. */
function shortDescription(text: string): string {
  const clean = text.trim();
  if (clean.length <= 120) return clean;
  return `${clean.slice(0, 117).trimEnd()}…`;
}

/**
 * Async server component. Fetches every collection once and resolves the
 * top-nav items (title + cover image + short description for the hover
 * panels) from that list — falling back to humanised handles and local
 * imagery when the store isn't connected yet.
 */
export async function Header() {
  const allCollections = await getAllCollections();

  const byHandle = new Map(allCollections.map((c) => [c.handle, c]));

  // Preserve the order defined in NEXT_PUBLIC_NAV_COLLECTIONS.
  const navCollections: NavCollection[] = NAV_COLLECTION_HANDLES.map((handle, i) => {
    const c: Collection | undefined = byHandle.get(handle);
    const title = c?.title ?? humaniseHandle(handle);
    return {
      handle,
      title,
      description: shortDescription(c?.description ?? ""),
      image: c?.image
        ? { url: c.image.url, altText: c.image.altText ?? title }
        : { url: FALLBACK_IMAGES[i % FALLBACK_IMAGES.length], altText: title },
    };
  });

  // The mobile menu lists every collection (not just the nav handles).
  const menuCollections: Collection[] =
    allCollections.length > 0
      ? allCollections
      : NAV_COLLECTION_HANDLES.map((handle) => ({
          id: handle,
          handle,
          title: humaniseHandle(handle),
          description: "",
          descriptionHtml: "",
          seo: { title: null, description: null },
          image: null,
        }));

  return <HeaderClient navCollections={navCollections} allCollections={menuCollections} />;
}
