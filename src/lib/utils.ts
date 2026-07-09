import type { Money } from "./shopify/types";

/** Join class names, skipping falsy values. */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

/** Format a Shopify Money object using the browser/Node Intl API. */
export function formatMoney(money: Money): string {
  const amount = Number(money.amount);
  try {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: money.currencyCode,
      // Drop the decimals on round amounts (e.g. £12 not £12.00).
      minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    }).format(amount);
  } catch {
    return `${money.currencyCode} ${amount.toFixed(2)}`;
  }
}

/** Format an ISO date as e.g. "9 July 2026". */
export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

/** Whether a compareAt price represents a genuine markdown. */
export function isOnSale(price: Money, compareAt: Money | null): boolean {
  return Boolean(compareAt && Number(compareAt.amount) > Number(price.amount));
}

/** Percentage discount, rounded, or null when not on sale. */
export function discountPercent(price: Money, compareAt: Money | null): number | null {
  if (!isOnSale(price, compareAt) || !compareAt) return null;
  const from = Number(compareAt.amount);
  const to = Number(price.amount);
  return Math.round(((from - to) / from) * 100);
}

/** Strip HTML tags to a plain-text excerpt of a given length. */
export function toExcerpt(html: string, length = 160): string {
  const text = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  return text.length > length ? `${text.slice(0, length).trimEnd()}…` : text;
}
