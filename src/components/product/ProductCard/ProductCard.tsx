"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./ProductCard.module.scss";
import { Price } from "@/components/ui/Price/Price";
import type { ProductCardData } from "@/lib/shopify/types";
import { discountPercent } from "@/lib/utils";
import { trackSelectItem } from "@/lib/analytics";

interface ProductCardProps {
  product: ProductCardData;
  /** GA4 item_list_id for select_item tracking. */
  listId?: string;
  priority?: boolean;
}

export function ProductCard({ product, listId, priority }: ProductCardProps) {
  const { minVariantPrice } = product.priceRange;
  const compareAt = product.compareAtPriceRange.minVariantPrice;
  const discount = discountPercent(minVariantPrice, compareAt);
  const soldOut = !product.availableForSale;

  const handleClick = () => {
    if (!listId) return;
    trackSelectItem(
      {
        item_id: product.handle,
        item_name: product.title,
        item_brand: product.vendor || undefined,
        price: Number(minVariantPrice.amount),
        currency: minVariantPrice.currencyCode,
      },
      listId
    );
  };

  return (
    <article className={styles.card} data-gtm="product-card">
      <Link
        href={`/products/${product.handle}`}
        className={styles.link}
        onClick={handleClick}
      >
        <div className={styles.imageWell}>
          {product.featuredImage ? (
            <Image
              src={product.featuredImage.url}
              alt={product.featuredImage.altText ?? product.title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className={styles.image}
              priority={priority}
            />
          ) : (
            <div className={styles.placeholder} aria-hidden="true">
              Tutto Napule
            </div>
          )}

          <div className={styles.badges}>
            {discount !== null && (
              <span className={styles.saleBadge}>−{discount}%</span>
            )}
            {soldOut && <span className={styles.soldBadge}>Sold out</span>}
          </div>
        </div>

        <div className={styles.body}>
          {product.vendor && <p className={styles.vendor}>{product.vendor}</p>}
          <h3 className={styles.title}>{product.title}</h3>
          <Price
            price={minVariantPrice}
            compareAt={compareAt}
            from={
              product.priceRange.minVariantPrice.amount !==
              product.priceRange.maxVariantPrice.amount
            }
            className={styles.price}
          />
        </div>
      </Link>
    </article>
  );
}
