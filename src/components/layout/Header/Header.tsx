import { HeaderClient } from "./HeaderClient";
import { getAllCollections } from "@/lib/shopify";
import { NAV_COLLECTION_HANDLES, humaniseHandle } from "@/lib/config";
import type { Collection } from "@/lib/shopify/types";

/**
 * Async server component. Fetches every collection once (for the slide-over +
 * mobile menu) and resolves the top-nav titles from that same list — falling
 * back to a humanised handle when the store isn't connected yet.
 */
export async function Header() {
  const allCollections = await getAllCollections();

  const byHandle = new Map(allCollections.map((c) => [c.handle, c]));

  // Preserve the order defined in NEXT_PUBLIC_NAV_COLLECTIONS.
  const navCollections = NAV_COLLECTION_HANDLES.map((handle) => ({
    handle,
    title: byHandle.get(handle)?.title ?? humaniseHandle(handle),
  }));

  // If Shopify hasn't returned collections yet, still let the slide-over show
  // the configured handles so the UI is navigable in preview.
  const slideOverCollections: Collection[] =
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

  return (
    <HeaderClient navCollections={navCollections} allCollections={slideOverCollections} />
  );
}
