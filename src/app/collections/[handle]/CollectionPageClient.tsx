"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import styles from "./collection.module.scss";
import { ProductGrid } from "@/components/product/ProductGrid/ProductGrid";
import { SortSelect } from "@/components/collection/SortSelect/SortSelect";
import type { ProductCardData } from "@/lib/shopify/types";
import { trackViewItemList } from "@/lib/analytics";

interface CollectionPageClientProps {
  products: ProductCardData[];
  sort: string;
  collectionHandle: string;
  collectionTitle: string;
}

export function CollectionPageClient({
  products,
  sort,
  collectionHandle,
  collectionTitle,
}: CollectionPageClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Fire view_item_list once per collection view.
  useEffect(() => {
    if (products.length === 0) return;
    trackViewItemList(
      products.slice(0, 24).map((p) => ({
        item_id: p.handle,
        item_name: p.title,
        item_brand: p.vendor || undefined,
        price: Number(p.priceRange.minVariantPrice.amount),
        currency: p.priceRange.minVariantPrice.currencyCode,
      })),
      `collection-${collectionHandle}`,
      collectionTitle
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionHandle]);

  const onSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "manual") params.delete("sort");
    else params.set("sort", value);
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  return (
    <>
      <div className={styles.toolbar}>
        <p className={styles.count}>
          {products.length} {products.length === 1 ? "product" : "products"}
        </p>
        <SortSelect value={sort} onChange={onSortChange} />
      </div>

      {products.length === 0 ? (
        <p className={styles.empty}>
          No products here yet — check back soon, or explore another category.
        </p>
      ) : (
        <ProductGrid products={products} listId={`collection-${collectionHandle}`} priorityCount={4} />
      )}
    </>
  );
}
