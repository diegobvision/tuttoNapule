// GA4 / GTM dataLayer helpers. Components never touch `dataLayer` directly —
// they call these typed pushers, so event names stay consistent with the GTM
// container config in analytics/gtm-container.json.

import type { Cart, CartLine, Product, ProductVariant, Money } from "./shopify/types";

type DataLayerObject = Record<string, unknown>;

declare global {
  interface Window {
    dataLayer?: DataLayerObject[];
  }
}

function push(obj: DataLayerObject): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(obj);
}

/** Generic semantic event. */
export function trackEvent(event: string, params: DataLayerObject = {}): void {
  push({ event, ...params });
}

// ── GA4 ecommerce item helpers ───────────────────────────────────────────
export interface GA4Item {
  item_id: string;
  item_name: string;
  item_brand?: string;
  item_category?: string;
  price?: number;
  quantity?: number;
  currency?: string;
}

export function itemFromProduct(
  product: Pick<Product, "handle" | "title" | "vendor" | "productType" | "priceRange">,
  variant?: ProductVariant,
  quantity = 1
): GA4Item {
  const price = Number(
    variant?.price.amount ?? product.priceRange.minVariantPrice.amount
  );
  return {
    item_id: product.handle,
    item_name: product.title,
    item_brand: product.vendor || undefined,
    item_category: product.productType || undefined,
    price,
    quantity,
    currency:
      variant?.price.currencyCode ?? product.priceRange.minVariantPrice.currencyCode,
  };
}

function itemFromLine(line: CartLine): GA4Item {
  return {
    item_id: line.merchandise.product.handle,
    item_name: line.merchandise.product.title,
    price: Number(line.merchandise.price.amount),
    quantity: line.quantity,
    currency: line.merchandise.price.currencyCode,
  };
}

function summariseCart(cart: Cart): { currency: string; value: number; items: GA4Item[] } {
  return {
    currency: cart.cost.totalAmount.currencyCode,
    value: Number(cart.cost.totalAmount.amount),
    items: cart.lines.map(itemFromLine),
  };
}

// Clear the previous ecommerce object before each push, per GA4 guidance.
function pushEcommerce(event: string, ecommerce: DataLayerObject, extra: DataLayerObject = {}): void {
  push({ ecommerce: null });
  push({ event, ecommerce, ...extra });
}

// ── Ecommerce events ─────────────────────────────────────────────────────
export function trackViewItem(item: GA4Item): void {
  pushEcommerce("view_item", {
    currency: item.currency,
    value: item.price,
    items: [item],
  });
}

export function trackAddToCart(item: GA4Item, context?: string): void {
  pushEcommerce(
    "add_to_cart",
    {
      currency: item.currency,
      value: (item.price ?? 0) * (item.quantity ?? 1),
      items: [item],
    },
    context ? { add_context: context } : {}
  );
}

export function trackViewCart(cart: Cart): void {
  if (cart.totalQuantity === 0) return;
  const { currency, value, items } = summariseCart(cart);
  pushEcommerce("view_cart", { currency, value, items });
}

export function trackBeginCheckout(cart: Cart): void {
  const { currency, value, items } = summariseCart(cart);
  pushEcommerce("begin_checkout", { currency, value, items });
}

export function trackViewItemList(items: GA4Item[], listId: string, listName?: string): void {
  pushEcommerce("view_item_list", {
    item_list_id: listId,
    item_list_name: listName ?? listId,
    items,
  });
}

export function trackSelectItem(item: GA4Item, listId: string): void {
  pushEcommerce("select_item", { item_list_id: listId, items: [item] });
}

// ── Engagement / navigation events ───────────────────────────────────────
export const trackHeroCta = (label: string, destination: string) =>
  trackEvent("hero_cta_click", { cta_label: label, destination });

export const trackViewCollection = (handle: string, title: string) =>
  trackEvent("view_collection_click", { collection_handle: handle, collection_title: title });

export const trackNavCollectionClick = (handle: string, location: string) =>
  trackEvent("nav_collection_click", { collection_handle: handle, location });

export const trackNavLinkClick = (text: string, location: string) =>
  trackEvent("nav_link_click", { link_text: text, location });

export const trackSearchOpen = (location: string) =>
  trackEvent("search_open", { location });

export const trackSearch = (term: string) => trackEvent("search", { search_term: term });

export const trackShare = (
  method: string,
  contentType: "product" | "article",
  itemId: string
) => trackEvent("share", { method, content_type: contentType, item_id: itemId });

export const trackFooterLink = (text: string, destination: string, group: string) =>
  trackEvent("footer_link_click", { link_text: text, destination, group });

export type { Money };
