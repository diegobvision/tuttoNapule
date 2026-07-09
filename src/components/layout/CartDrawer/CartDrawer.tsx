"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./CartDrawer.module.scss";
import { Drawer } from "@/components/ui/Drawer/Drawer";
import { Button, ButtonLink } from "@/components/ui/Button/Button";
import { CloseIcon, MinusIcon, PlusIcon } from "@/components/ui/Icons";
import { useCart } from "@/context/CartContext";
import { formatMoney } from "@/lib/utils";
import { trackBeginCheckout } from "@/lib/analytics";

export function CartDrawer() {
  const { cart, isOpen, isLoading, closeCart, updateItem, removeItem } = useCart();
  const lines = cart?.lines ?? [];
  const isEmpty = lines.length === 0;

  const checkout = () => {
    if (cart) {
      trackBeginCheckout(cart);
      window.location.href = cart.checkoutUrl;
    }
  };

  return (
    <Drawer open={isOpen} onClose={closeCart} side="right" width="min(440px, 96vw)" labelledBy="cart-title">
      <div className={styles.head}>
        <h2 id="cart-title" className={styles.title}>
          Your basket
          {cart && cart.totalQuantity > 0 && (
            <span className={styles.count}>{cart.totalQuantity}</span>
          )}
        </h2>
        <button className={styles.close} onClick={closeCart} aria-label="Close basket">
          <CloseIcon />
        </button>
      </div>

      {isEmpty ? (
        <div className={styles.empty}>
          <p className={styles.emptyTitle}>Your basket is empty</p>
          <p className={styles.emptyNote}>
            Fill it with a little taste of Naples — coffee, pasta, sweets and more.
          </p>
          <ButtonLink href="/collections" variant="primary" onClick={closeCart}>
            Start shopping
          </ButtonLink>
        </div>
      ) : (
        <>
          <ul className={styles.lines} aria-busy={isLoading}>
            {lines.map((line) => {
              const img = line.merchandise.product.featuredImage;
              const variantLabel = line.merchandise.selectedOptions
                .filter((o) => o.value !== "Default Title")
                .map((o) => o.value)
                .join(" · ");
              return (
                <li key={line.id} className={styles.line}>
                  <Link
                    href={`/products/${line.merchandise.product.handle}`}
                    className={styles.thumb}
                    onClick={closeCart}
                  >
                    {img ? (
                      <Image
                        src={img.url}
                        alt={img.altText ?? line.merchandise.product.title}
                        fill
                        sizes="80px"
                        className={styles.thumbImg}
                      />
                    ) : null}
                  </Link>

                  <div className={styles.lineBody}>
                    <Link
                      href={`/products/${line.merchandise.product.handle}`}
                      className={styles.lineTitle}
                      onClick={closeCart}
                    >
                      {line.merchandise.product.title}
                    </Link>
                    {variantLabel && <p className={styles.variant}>{variantLabel}</p>}

                    <div className={styles.lineFoot}>
                      <div className={styles.qty}>
                        <button
                          onClick={() => updateItem(line.id, line.quantity - 1)}
                          aria-label="Decrease quantity"
                          disabled={isLoading}
                        >
                          <MinusIcon width={16} height={16} />
                        </button>
                        <span aria-live="polite">{line.quantity}</span>
                        <button
                          onClick={() => updateItem(line.id, line.quantity + 1)}
                          aria-label="Increase quantity"
                          disabled={isLoading}
                        >
                          <PlusIcon width={16} height={16} />
                        </button>
                      </div>
                      <span className={styles.linePrice}>
                        {formatMoney(line.cost.totalAmount)}
                      </span>
                    </div>

                    <button
                      className={styles.remove}
                      onClick={() => removeItem(line.id)}
                      disabled={isLoading}
                    >
                      Remove
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className={styles.footer}>
            <div className={styles.subtotal}>
              <span>Subtotal</span>
              <span className={styles.subtotalValue}>
                {cart && formatMoney(cart.cost.subtotalAmount)}
              </span>
            </div>
            <p className={styles.taxNote}>Taxes and shipping calculated at checkout.</p>
            <Button variant="primary" size="lg" className={styles.checkout} onClick={checkout} disabled={isLoading}>
              Proceed to checkout
            </Button>
            <button className={styles.continue} onClick={closeCart}>
              Continue shopping
            </button>
          </div>
        </>
      )}
    </Drawer>
  );
}
