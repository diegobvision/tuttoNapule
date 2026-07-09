import styles from "./LatestPosts.module.scss";
import { SectionHeader } from "@/components/ui/SectionHeader/SectionHeader";
import { BlogCard } from "@/components/blog/BlogCard/BlogCard";
import { ButtonLink } from "@/components/ui/Button/Button";
import { getArticles } from "@/lib/shopify";

/** Homepage "Journal" section — the latest 5 articles from Shopify. */
export async function LatestPosts() {
  const articles = await getArticles(5);
  if (articles.length === 0) return null;

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <SectionHeader
          eyebrow="Dal nostro diario"
          title="From the Journal"
          note="Stories, recipes and the people behind the products — a slow read from the kitchens of Naples."
        />

        <div className={styles.grid}>
          {articles.map((article, i) => (
            <BlogCard
              key={article.id}
              article={article}
              featured={i === 0}
              priority={i === 0}
            />
          ))}
        </div>

        <div className={styles.viewAllWrap}>
          <ButtonLink href="/blog" variant="secondary">
            Read the Journal
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
