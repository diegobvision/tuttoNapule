import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import styles from "./article.module.scss";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs/Breadcrumbs";
import { SectionDivider } from "@/components/ui/Ornament/Ornament";
import { JsonLd } from "@/components/seo/JsonLd";
import { ShareButtons } from "@/components/share/ShareButtons/ShareButtons";
import { ProductGrid } from "@/components/product/ProductGrid/ProductGrid";
import { SectionHeader } from "@/components/ui/SectionHeader/SectionHeader";
import {
  getArticleByHandle,
  getAllArticleHandles,
  getProductsByTags,
  getCollectionProducts,
} from "@/lib/shopify";
import { FEATURED_COLLECTION_HANDLES } from "@/lib/config";
import { pageMeta, articleSchema, breadcrumbSchema, absoluteUrl } from "@/lib/seo";
import { formatDate } from "@/lib/utils";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ handle: string }>;
}

export async function generateStaticParams() {
  const handles = await getAllArticleHandles();
  return handles.map((h) => ({ handle: h.handle }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { handle } = await params;
  const article = await getArticleByHandle(handle);
  if (!article) {
    return pageMeta({ title: "Article not found", path: `/blog/${handle}`, noindex: true });
  }
  return pageMeta({
    title: article.seo.title || article.title,
    description: article.seo.description || article.excerpt || undefined,
    path: `/blog/${handle}`,
    image: article.image?.url ?? null,
    type: "article",
    publishedTime: article.publishedAt,
    authors: article.author ? [article.author] : undefined,
    tags: article.tags,
  });
}

export default async function ArticlePage({ params }: PageProps) {
  const { handle } = await params;
  const article = await getArticleByHandle(handle);
  if (!article) notFound();

  // Recommendations: tag-matched, else fall back to the first featured collection.
  let recommendations = await getProductsByTags(article.tags, 4);
  let recSource = "tag-match";
  if (recommendations.length === 0 && FEATURED_COLLECTION_HANDLES[0]) {
    recommendations = await getCollectionProducts(FEATURED_COLLECTION_HANDLES[0], 4);
    recSource = "collection-fallback";
  }

  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Journal", path: "/blog" },
    { name: article.title, path: `/blog/${handle}` },
  ];

  return (
    <>
      <JsonLd data={[articleSchema(article), breadcrumbSchema(crumbs)]} />

      <article className={styles.article}>
        <div className={styles.head}>
          <Breadcrumbs items={crumbs} />
          <p className={styles.meta}>
            <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
            {article.author && <span> · {article.author}</span>}
          </p>
          <h1 className={styles.title}>{article.title}</h1>
          {article.tags.length > 0 && (
            <ul className={styles.tags}>
              {article.tags.map((t) => (
                <li key={t} className={styles.tag}>
                  {t}
                </li>
              ))}
            </ul>
          )}
        </div>

        {article.image && (
          <div className={styles.hero}>
            <Image
              src={article.image.url}
              alt={article.image.altText ?? article.title}
              fill
              priority
              sizes="(max-width: 900px) 100vw, 900px"
              className={styles.heroImg}
            />
          </div>
        )}

        <div
          className={`rte ${styles.body}`}
          dangerouslySetInnerHTML={{ __html: article.contentHtml }}
        />

        <div className={styles.footer}>
          <SectionDivider variant="quatrefoil" />
          <div className={styles.share}>
            <ShareButtons
              url={absoluteUrl(`/blog/${handle}`)}
              title={article.title}
              contentType="article"
              id={article.handle}
              image={article.image?.url}
            />
            <Link href="/blog" className={styles.back}>
              ← All stories
            </Link>
          </div>
        </div>
      </article>

      {recommendations.length > 0 && (
        <section
          className={styles.recs}
          data-gtm="blog-recommendations"
          data-gtm-rec-source={recSource}
        >
          <SectionHeader eyebrow="Dalla dispensa" title="Shop the story" />
          <ProductGrid products={recommendations} listId="blog-recommendations" />
        </section>
      )}
    </>
  );
}
