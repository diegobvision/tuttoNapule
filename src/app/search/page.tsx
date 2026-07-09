import type { Metadata } from "next";
import styles from "./search.module.scss";
import { PageHeader } from "@/components/ui/PageHeader/PageHeader";
import { ProductGrid } from "@/components/product/ProductGrid/ProductGrid";
import { ButtonLink } from "@/components/ui/Button/Button";
import { searchProducts } from "@/lib/shopify";
import { pageMeta } from "@/lib/seo";

// Search results are live and thin/duplicate — never index.
export const dynamic = "force-dynamic";

export function generateMetadata(): Metadata {
  return pageMeta({
    title: "Search",
    description: "Search Tutto Napule for Italian coffee, pasta, pantry staples and more.",
    path: "/search",
    noindex: true,
  });
}

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: PageProps) {
  const { q = "" } = await searchParams;
  const query = q.trim();
  const results = query ? await searchProducts(query) : [];

  return (
    <>
      <PageHeader
        eyebrow="Ricerca"
        title={query ? `Results for “${query}”` : "Search"}
        description={
          query
            ? `${results.length} ${results.length === 1 ? "product" : "products"} found`
            : "Type a search above to find products across the shop."
        }
      />

      <div className={styles.wrap}>
        {query && results.length === 0 ? (
          <div className={styles.empty}>
            <p className={styles.emptyTitle}>No products matched “{query}”.</p>
            <p className={styles.emptyNote}>
              Try a different term, or browse the full shop.
            </p>
            <ButtonLink href="/collections" variant="primary">
              Browse all categories
            </ButtonLink>
          </div>
        ) : (
          <ProductGrid products={results} listId="search-results" />
        )}
      </div>
    </>
  );
}
