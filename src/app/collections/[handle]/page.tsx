import { notFound } from "next/navigation";
import type { Metadata } from "next";
import styles from "./collection.module.scss";
import { PageHeader } from "@/components/ui/PageHeader/PageHeader";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { CollectionPageClient } from "./CollectionPageClient";
import { getCollection, getAllCollectionHandles } from "@/lib/shopify";
import type { CollectionSort } from "@/lib/shopify";
import { pageMeta, collectionSchema, breadcrumbSchema } from "@/lib/seo";
import { humaniseHandle } from "@/lib/config";

export const revalidate = 60;

type SortKey = CollectionSort["sortKey"];

const SORT_MAP: Record<string, CollectionSort> = {
  manual: { sortKey: "COLLECTION_DEFAULT", reverse: false },
  "best-selling": { sortKey: "BEST_SELLING", reverse: false },
  "price-asc": { sortKey: "PRICE", reverse: false },
  "price-desc": { sortKey: "PRICE", reverse: true },
  "created-desc": { sortKey: "CREATED" as SortKey, reverse: true },
  "title-asc": { sortKey: "TITLE", reverse: false },
};

interface PageProps {
  params: Promise<{ handle: string }>;
  searchParams: Promise<{ sort?: string }>;
}

export async function generateStaticParams() {
  const handles = await getAllCollectionHandles();
  return handles.map((h) => ({ handle: h.handle }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { handle } = await params;
  const collection = await getCollection(handle, undefined, 1);
  if (!collection) {
    return pageMeta({ title: humaniseHandle(handle), path: `/collections/${handle}` });
  }
  return pageMeta({
    title: collection.seo.title || collection.title,
    description: collection.seo.description || collection.description || undefined,
    path: `/collections/${handle}`,
    image: collection.image?.url ?? null,
  });
}

export default async function CollectionPage({ params, searchParams }: PageProps) {
  const { handle } = await params;
  const { sort = "manual" } = await searchParams;
  const sortConfig = SORT_MAP[sort] ?? SORT_MAP.manual;

  const collection = await getCollection(handle, sortConfig);
  if (!collection) notFound();

  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/collections" },
    { name: collection.title, path: `/collections/${handle}` },
  ];

  return (
    <>
      <JsonLd
        data={[
          collectionSchema(
            collection,
            collection.products.map((p) => p.handle)
          ),
          breadcrumbSchema(crumbs),
        ]}
      />

      <PageHeader
        eyebrow="Categoria"
        title={collection.title}
        description={collection.description || undefined}
      />

      <div className={styles.wrap}>
        <Breadcrumbs items={crumbs} />
        <CollectionPageClient
          products={collection.products}
          sort={sort}
          collectionHandle={handle}
          collectionTitle={collection.title}
        />
      </div>
    </>
  );
}
