import { notFound } from "next/navigation";
import type { Metadata } from "next";
import styles from "./page-content.module.scss";
import { PageHeader } from "@/components/ui/PageHeader/PageHeader";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { getPage, getAllPageHandles, isShopifyConfigured } from "@/lib/shopify";
import { pageMeta, pageSchema, breadcrumbSchema } from "@/lib/seo";
import { humaniseHandle } from "@/lib/config";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ handle: string }>;
}

// Known content pages that should always resolve to a friendly placeholder in
// preview (before the store is connected), rather than a 404.
const KNOWN_HANDLES = new Set([
  "terms",
  "privacy",
  "shipping",
  "faq",
  "about",
  "contact",
]);

export async function generateStaticParams() {
  const handles = await getAllPageHandles();
  return handles.map((h) => ({ handle: h.handle }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { handle } = await params;
  const page = await getPage(handle);
  if (!page) {
    return pageMeta({ title: humaniseHandle(handle), path: `/pages/${handle}` });
  }
  return pageMeta({
    title: page.seo.title || page.title,
    description: page.seo.description || page.bodySummary || undefined,
    path: `/pages/${handle}`,
  });
}

export default async function ContentPage({ params }: PageProps) {
  const { handle } = await params;
  const page = await getPage(handle);

  // If Shopify is connected but the page doesn't exist, 404. Otherwise show a
  // placeholder so the site is navigable before content is authored.
  if (!page && isShopifyConfigured && !KNOWN_HANDLES.has(handle)) {
    notFound();
  }

  const title = page?.title ?? humaniseHandle(handle);
  const crumbs = [
    { name: "Home", path: "/" },
    { name: title, path: `/pages/${handle}` },
  ];

  return (
    <>
      <JsonLd
        data={page ? [pageSchema(page), breadcrumbSchema(crumbs)] : breadcrumbSchema(crumbs)}
      />
      <PageHeader eyebrow="Informazioni" title={title} />

      <div className={styles.wrap}>
        <Breadcrumbs items={crumbs} />
        {page ? (
          <div className={`rte ${styles.body}`} dangerouslySetInnerHTML={{ __html: page.body }} />
        ) : (
          <div className={styles.placeholder}>
            <p>
              This page will display the <strong>{title}</strong> content from
              your Shopify store.
            </p>
            <p className={styles.hint}>
              In Shopify Admin, create a page under{" "}
              <em>Online Store → Pages</em> with the handle{" "}
              <code>{handle}</code>, and it will appear here automatically.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
