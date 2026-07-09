// TypeScript models mirroring the slices of the Storefront API we query.

export interface Money {
  amount: string;
  currencyCode: string;
}

export interface ShopImage {
  url: string;
  altText: string | null;
  width: number | null;
  height: number | null;
}

export interface SEO {
  title: string | null;
  description: string | null;
}

export interface ProductVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  quantityAvailable: number | null;
  price: Money;
  compareAtPrice: Money | null;
  selectedOptions: { name: string; value: string }[];
  image: ShopImage | null;
}

export interface ProductOption {
  id: string;
  name: string;
  values: string[];
}

export interface Product {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  vendor: string;
  productType: string;
  tags: string[];
  availableForSale: boolean;
  seo: SEO;
  featuredImage: ShopImage | null;
  images: ShopImage[];
  options: ProductOption[];
  variants: ProductVariant[];
  priceRange: { minVariantPrice: Money; maxVariantPrice: Money };
  compareAtPriceRange: { minVariantPrice: Money; maxVariantPrice: Money };
  createdAt: string;
  updatedAt: string;
}

/** Trimmed product shape used in grids/cards. */
export interface ProductCardData {
  id: string;
  handle: string;
  title: string;
  vendor: string;
  availableForSale: boolean;
  featuredImage: ShopImage | null;
  priceRange: { minVariantPrice: Money; maxVariantPrice: Money };
  compareAtPriceRange: { minVariantPrice: Money; maxVariantPrice: Money };
}

export interface Collection {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  seo: SEO;
  image: ShopImage | null;
}

export interface CollectionWithProducts extends Collection {
  products: ProductCardData[];
}

export interface ShopifyPage {
  id: string;
  handle: string;
  title: string;
  body: string; // HTML
  bodySummary: string;
  seo: SEO;
  createdAt: string;
  updatedAt: string;
}

export interface Article {
  id: string;
  handle: string;
  title: string;
  excerpt: string;
  contentHtml: string;
  publishedAt: string;
  author: string | null;
  image: ShopImage | null;
  tags: string[];
  seo: SEO;
  blogHandle: string;
}

// ── Cart ────────────────────────────────────────────────────────────────
export interface CartLineMerchandise {
  id: string; // variant id
  title: string;
  product: {
    handle: string;
    title: string;
    featuredImage: ShopImage | null;
  };
  price: Money;
  selectedOptions: { name: string; value: string }[];
}

export interface CartLine {
  id: string;
  quantity: number;
  cost: { totalAmount: Money };
  merchandise: CartLineMerchandise;
}

export interface Cart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: Money;
    totalAmount: Money;
    totalTaxAmount: Money | null;
  };
  lines: CartLine[];
}

// ── GraphQL edge/connection helpers ──────────────────────────────────────
export interface Edge<T> {
  node: T;
}
export interface Connection<T> {
  edges: Edge<T>[];
}
export const flatten = <T>(conn: Connection<T> | undefined | null): T[] =>
  conn?.edges.map((e) => e.node) ?? [];
