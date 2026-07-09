import { shopifyFetch } from "./client";
import { REVALIDATE, isShopifyConfigured } from "./config";
import * as Q from "./queries";
import {
  Product,
  ProductCardData,
  Collection,
  CollectionWithProducts,
  ShopifyPage,
  Article,
  Cart,
  Connection,
  Edge,
  flatten,
} from "./types";

export * from "./types";
export { isShopifyConfigured } from "./config";

// ── Internal normalisers ─────────────────────────────────────────────────
interface RawProduct extends Omit<Product, "images" | "variants"> {
  images: Connection<Product["images"][number]>;
  variants: Connection<Product["variants"][number]>;
}

function normaliseProduct(raw: RawProduct | null): Product | null {
  if (!raw) return null;
  return {
    ...raw,
    images: flatten(raw.images),
    variants: flatten(raw.variants),
  };
}

/**
 * Wrap a fetch so a missing/unconfigured Shopify never crashes a page render.
 * Logs once server-side and returns the provided fallback.
 */
async function safe<T>(fn: () => Promise<T>, fallback: T, label: string): Promise<T> {
  if (!isShopifyConfigured) return fallback;
  try {
    return await fn();
  } catch (err) {
    console.error(`[shopify] ${label} failed:`, (err as Error).message);
    return fallback;
  }
}

// ── Products ─────────────────────────────────────────────────────────────
export async function getProduct(handle: string): Promise<Product | null> {
  return safe(
    async () => {
      const data = await shopifyFetch<{ product: RawProduct | null }>({
        query: Q.PRODUCT_BY_HANDLE_QUERY,
        variables: { handle },
        revalidate: REVALIDATE.content,
      });
      return normaliseProduct(data.product);
    },
    null,
    `getProduct(${handle})`
  );
}

export type ProductSort = {
  sortKey: "RELEVANCE" | "PRICE" | "CREATED_AT" | "BEST_SELLING" | "TITLE";
  reverse: boolean;
};

export async function searchProducts(
  query: string,
  sort: ProductSort = { sortKey: "RELEVANCE", reverse: false },
  first = 40
): Promise<ProductCardData[]> {
  return safe(
    async () => {
      const data = await shopifyFetch<{ products: Connection<ProductCardData> }>({
        query: Q.PRODUCTS_QUERY,
        variables: { first, query, ...sort },
        cache: "no-store",
      });
      return flatten(data.products);
    },
    [],
    `searchProducts(${query})`
  );
}

/** Shopify's native product recommendations (related products). */
export async function getProductRecommendations(
  productId: string,
  limit = 4
): Promise<ProductCardData[]> {
  return safe(
    async () => {
      const data = await shopifyFetch<{ productRecommendations: ProductCardData[] | null }>({
        query: Q.PRODUCT_RECOMMENDATIONS_QUERY,
        variables: { productId },
        revalidate: REVALIDATE.content,
      });
      return (data.productRecommendations ?? []).slice(0, limit);
    },
    [],
    `getProductRecommendations(${productId})`
  );
}

/**
 * Products matching ANY of the given tags (cached). Powers blog-article
 * product recommendations. Falls back to an empty array; the caller decides
 * on a collection fallback.
 */
export async function getProductsByTags(
  tags: string[],
  first = 4
): Promise<ProductCardData[]> {
  if (tags.length === 0) return [];
  const query = tags.map((t) => `tag:"${t.replace(/"/g, "")}"`).join(" OR ");
  return safe(
    async () => {
      const data = await shopifyFetch<{ products: Connection<ProductCardData> }>({
        query: Q.PRODUCTS_QUERY,
        variables: { first, query, sortKey: "BEST_SELLING", reverse: false },
        revalidate: REVALIDATE.content,
      });
      return flatten(data.products);
    },
    [],
    `getProductsByTags(${tags.join(",")})`
  );
}

// ── Collections ──────────────────────────────────────────────────────────
export type CollectionSort = {
  sortKey: "COLLECTION_DEFAULT" | "PRICE" | "CREATED" | "BEST_SELLING" | "TITLE";
  reverse: boolean;
};

interface RawCollectionWithProducts extends Collection {
  products: Connection<ProductCardData>;
}

export async function getCollection(
  handle: string,
  sort: CollectionSort = { sortKey: "COLLECTION_DEFAULT", reverse: false },
  first = 60
): Promise<CollectionWithProducts | null> {
  return safe(
    async () => {
      const data = await shopifyFetch<{ collection: RawCollectionWithProducts | null }>({
        query: Q.COLLECTION_BY_HANDLE_QUERY,
        variables: { handle, first, ...sort },
        revalidate: REVALIDATE.content,
      });
      if (!data.collection) return null;
      return { ...data.collection, products: flatten(data.collection.products) };
    },
    null,
    `getCollection(${handle})`
  );
}

/** Collection meta (no products) — used for homepage category tiles. */
export async function getCollectionMeta(handle: string): Promise<Collection | null> {
  return safe(
    async () => {
      const data = await shopifyFetch<{ collection: Collection | null }>({
        query: Q.COLLECTION_META_QUERY,
        variables: { handle },
        revalidate: REVALIDATE.content,
      });
      return data.collection;
    },
    null,
    `getCollectionMeta(${handle})`
  );
}

// Shopify auto-creates a default "frontpage" collection ("Home page") that
// isn't a real category — never surface it in navigation.
const HIDDEN_COLLECTION_HANDLES = new Set(["frontpage"]);

/** Every collection — powers the nav "Categorie" slide-over. */
export async function getAllCollections(first = 40): Promise<Collection[]> {
  return safe(
    async () => {
      const data = await shopifyFetch<{ collections: Connection<Collection> }>({
        query: Q.ALL_COLLECTIONS_QUERY,
        variables: { first },
        revalidate: REVALIDATE.content,
      });
      return flatten(data.collections).filter(
        (c) => !HIDDEN_COLLECTION_HANDLES.has(c.handle)
      );
    },
    [],
    "getAllCollections"
  );
}

/** Featured products of a collection (homepage cards, recommendations). */
export async function getCollectionProducts(
  handle: string,
  first = 8
): Promise<ProductCardData[]> {
  const col = await getCollection(handle, undefined, first);
  return col?.products ?? [];
}

// ── Shopify Pages ────────────────────────────────────────────────────────
export async function getPage(handle: string): Promise<ShopifyPage | null> {
  return safe(
    async () => {
      const data = await shopifyFetch<{ page: ShopifyPage | null }>({
        query: Q.PAGE_BY_HANDLE_QUERY,
        variables: { handle },
        revalidate: REVALIDATE.content,
      });
      return data.page;
    },
    null,
    `getPage(${handle})`
  );
}

// ── Blog / Articles ──────────────────────────────────────────────────────
interface RawArticle extends Omit<Article, "author" | "blogHandle"> {
  author: { name: string } | null;
  blog: { handle: string };
}

function normaliseArticle(raw: RawArticle): Article {
  const { blog, author, ...rest } = raw;
  return { ...rest, author: author?.name ?? null, blogHandle: blog.handle };
}

export async function getArticles(first = 20): Promise<Article[]> {
  return safe(
    async () => {
      const data = await shopifyFetch<{
        blogs: Connection<{ handle: string; articles: Connection<RawArticle> }>;
      }>({
        query: Q.ARTICLES_QUERY,
        variables: { first },
        revalidate: REVALIDATE.content,
      });
      const firstBlog = data.blogs.edges[0]?.node;
      if (!firstBlog) return [];
      return flatten(firstBlog.articles).map(normaliseArticle);
    },
    [],
    "getArticles"
  );
}

export async function getBlogHandles(): Promise<string[]> {
  return safe(
    async () => {
      const data = await shopifyFetch<{ blogs: Connection<{ handle: string }> }>({
        query: Q.BLOG_HANDLES_QUERY,
        revalidate: REVALIDATE.handles,
      });
      return flatten(data.blogs).map((b) => b.handle);
    },
    [],
    "getBlogHandles"
  );
}

/**
 * Resolve an article by its handle alone. Article handles are unique within a
 * blog; we loop over blogs (usually just one) to find the owner.
 */
export async function getArticleByHandle(articleHandle: string): Promise<Article | null> {
  return safe(
    async () => {
      const blogHandles = await getBlogHandles();
      for (const blogHandle of blogHandles) {
        const data = await shopifyFetch<{
          blogByHandle: { articleByHandle: RawArticle | null } | null;
        }>({
          query: Q.ARTICLE_BY_HANDLE_QUERY,
          variables: { blogHandle, articleHandle },
          revalidate: REVALIDATE.content,
        });
        const raw = data.blogByHandle?.articleByHandle;
        if (raw) return normaliseArticle(raw);
      }
      return null;
    },
    null,
    `getArticleByHandle(${articleHandle})`
  );
}

// ── Sitemap handle listings ──────────────────────────────────────────────
export interface HandleEntry {
  handle: string;
  updatedAt?: string;
  publishedAt?: string;
}

async function paginateHandles(
  query: string,
  root: "products" | "collections" | "pages"
): Promise<HandleEntry[]> {
  return safe(
    async () => {
      const out: HandleEntry[] = [];
      let after: string | null = null;
      // Cap pagination for safety.
      for (let i = 0; i < 20; i++) {
        const data: Record<string, {
          pageInfo: { hasNextPage: boolean; endCursor: string | null };
          edges: Edge<HandleEntry>[];
        }> = await shopifyFetch({
          query,
          variables: { first: 250, after },
          revalidate: REVALIDATE.handles,
        });
        const conn = data[root];
        out.push(...conn.edges.map((e) => e.node));
        if (!conn.pageInfo.hasNextPage) break;
        after = conn.pageInfo.endCursor;
      }
      return out;
    },
    [],
    `paginateHandles(${root})`
  );
}

export const getAllProductHandles = () =>
  paginateHandles(Q.ALL_PRODUCT_HANDLES_QUERY, "products");
export const getAllCollectionHandles = () =>
  paginateHandles(Q.ALL_COLLECTION_HANDLES_QUERY, "collections");
export const getAllPageHandles = () =>
  paginateHandles(Q.ALL_PAGE_HANDLES_QUERY, "pages");

export async function getAllArticleHandles(): Promise<HandleEntry[]> {
  return safe(
    async () => {
      const data = await shopifyFetch<{
        blogs: Connection<{ articles: Connection<HandleEntry> }>;
      }>({
        query: Q.ALL_ARTICLE_HANDLES_QUERY,
        variables: { first: 250 },
        revalidate: REVALIDATE.handles,
      });
      const firstBlog = data.blogs.edges[0]?.node;
      return firstBlog ? flatten(firstBlog.articles) : [];
    },
    [],
    "getAllArticleHandles"
  );
}

// ── Cart (server-side; called from the /api/cart route) ──────────────────
type RawCart = Omit<Cart, "lines"> & { lines: Connection<Cart["lines"][number]> };

interface CartMutationResult {
  cart: RawCart | null;
  userErrors: { field: string[] | null; message: string }[];
}

function normaliseCart(raw: RawCart | null): Cart | null {
  if (!raw) return null;
  return { ...raw, lines: flatten(raw.lines) };
}

export interface CartLineInput {
  merchandiseId: string;
  quantity: number;
}

export async function getCart(cartId: string): Promise<Cart | null> {
  const data = await shopifyFetch<{ cart: RawCart | null }>({
    query: Q.CART_QUERY,
    variables: { id: cartId },
    cache: "no-store",
  });
  return normaliseCart(data.cart);
}

export async function createCart(lines: CartLineInput[]): Promise<Cart | null> {
  const data = await shopifyFetch<{ cartCreate: CartMutationResult }>({
    query: Q.CART_CREATE_MUTATION,
    variables: { lines },
    cache: "no-store",
  });
  return normaliseCart(data.cartCreate.cart);
}

export async function addCartLines(cartId: string, lines: CartLineInput[]): Promise<Cart | null> {
  const data = await shopifyFetch<{ cartLinesAdd: CartMutationResult }>({
    query: Q.CART_LINES_ADD_MUTATION,
    variables: { cartId, lines },
    cache: "no-store",
  });
  return normaliseCart(data.cartLinesAdd.cart);
}

export async function updateCartLines(
  cartId: string,
  lines: { id: string; quantity: number }[]
): Promise<Cart | null> {
  const data = await shopifyFetch<{ cartLinesUpdate: CartMutationResult }>({
    query: Q.CART_LINES_UPDATE_MUTATION,
    variables: { cartId, lines },
    cache: "no-store",
  });
  return normaliseCart(data.cartLinesUpdate.cart);
}

export async function removeCartLines(cartId: string, lineIds: string[]): Promise<Cart | null> {
  const data = await shopifyFetch<{ cartLinesRemove: CartMutationResult }>({
    query: Q.CART_LINES_REMOVE_MUTATION,
    variables: { cartId, lineIds },
    cache: "no-store",
  });
  return normaliseCart(data.cartLinesRemove.cart);
}
