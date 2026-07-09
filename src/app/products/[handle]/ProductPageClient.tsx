"use client";

import { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import styles from "./product.module.scss";
import { Button } from "@/components/ui/Button/Button";
import { Price } from "@/components/ui/Price/Price";
import { ShareButtons } from "@/components/share/ShareButtons/ShareButtons";
import { MinusIcon, PlusIcon, CheckIcon } from "@/components/ui/Icons";
import { useCart } from "@/context/CartContext";
import type { Product, ProductVariant } from "@/lib/shopify/types";
import { itemFromProduct, trackViewItem, trackAddToCart } from "@/lib/analytics";
import { cn } from "@/lib/utils";

interface ProductPageClientProps {
  product: Product;
  url: string;
}

/** Find the variant matching the current option selections. */
function matchVariant(
  variants: ProductVariant[],
  selected: Record<string, string>
): ProductVariant | undefined {
  return variants.find((v) =>
    v.selectedOptions.every((o) => selected[o.name] === o.value)
  );
}

export function ProductPageClient({ product, url }: ProductPageClientProps) {
  const { addItem, isLoading } = useCart();
  const hasRealOptions =
    product.options.length > 0 &&
    !(product.options.length === 1 && product.options[0].values.length === 1);

  const [selected, setSelected] = useState<Record<string, string>>(() =>
    Object.fromEntries(product.options.map((o) => [o.name, o.values[0]]))
  );
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [justAdded, setJustAdded] = useState(false);

  const variant = useMemo(
    () => matchVariant(product.variants, selected) ?? product.variants[0],
    [product.variants, selected]
  );

  // GA4 view_item on mount.
  useEffect(() => {
    trackViewItem(itemFromProduct(product, variant, 1));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const images = product.images.length > 0 ? product.images : product.featuredImage ? [product.featuredImage] : [];
  const inStock = variant?.availableForSale ?? product.availableForSale;

  const onAdd = async () => {
    if (!variant) return;
    const ok = await addItem(variant.id, quantity);
    if (ok) {
      trackAddToCart(itemFromProduct(product, variant, quantity), "product_detail");
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1800);
    }
  };

  return (
    <div className={styles.layout}>
      {/* Gallery */}
      <div className={styles.gallery}>
        <div className={styles.mainImage}>
          {images[activeImage] ? (
            <Image
              src={images[activeImage].url}
              alt={images[activeImage].altText ?? product.title}
              fill
              priority
              sizes="(max-width: 900px) 100vw, 55vw"
              className={styles.image}
            />
          ) : (
            <div className={styles.imagePlaceholder}>Tutto Napule</div>
          )}
        </div>
        {images.length > 1 && (
          <div className={styles.thumbs} role="tablist" aria-label="Product images">
            {images.map((img, i) => (
              <button
                key={img.url}
                role="tab"
                aria-selected={i === activeImage}
                className={cn(styles.thumb, i === activeImage && styles.thumbActive)}
                onClick={() => setActiveImage(i)}
              >
                <Image src={img.url} alt="" fill sizes="80px" className={styles.thumbImg} />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Details */}
      <div className={styles.details}>
        {product.vendor && <p className={styles.vendor}>{product.vendor}</p>}
        <h1 className={styles.title}>{product.title}</h1>

        {variant && (
          <Price
            price={variant.price}
            compareAt={variant.compareAtPrice}
            className={styles.price}
          />
        )}

        <div className={styles.stock}>
          <span className={cn(styles.dot, inStock ? styles.inStock : styles.outStock)} />
          {inStock ? "In stock — ready to ship" : "Currently out of stock"}
        </div>

        {product.descriptionHtml && (
          <div
            className={cn("rte", styles.description)}
            dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
          />
        )}

        {/* Variant options */}
        {hasRealOptions &&
          product.options.map((option) => (
            <div key={option.id} className={styles.option}>
              <span className={styles.optionLabel}>{option.name}</span>
              <div className={styles.optionValues}>
                {option.values.map((value) => {
                  const isSelected = selected[option.name] === value;
                  return (
                    <button
                      key={value}
                      className={cn(styles.swatch, isSelected && styles.swatchActive)}
                      onClick={() =>
                        setSelected((prev) => ({ ...prev, [option.name]: value }))
                      }
                      aria-pressed={isSelected}
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

        {/* Quantity + add to cart */}
        <div className={styles.buyRow}>
          <div className={styles.qty}>
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              aria-label="Decrease quantity"
            >
              <MinusIcon width={18} height={18} />
            </button>
            <span aria-live="polite">{quantity}</span>
            <button onClick={() => setQuantity((q) => q + 1)} aria-label="Increase quantity">
              <PlusIcon width={18} height={18} />
            </button>
          </div>

          <Button
            variant="primary"
            size="lg"
            className={styles.addBtn}
            onClick={onAdd}
            disabled={!inStock || isLoading}
          >
            {justAdded ? (
              <>
                <CheckIcon width={18} height={18} /> Added
              </>
            ) : inStock ? (
              "Add to basket"
            ) : (
              "Out of stock"
            )}
          </Button>
        </div>

        <div className={styles.share}>
          <ShareButtons
            url={url}
            title={product.title}
            contentType="product"
            id={product.handle}
            image={product.featuredImage?.url}
          />
        </div>
      </div>
    </div>
  );
}
