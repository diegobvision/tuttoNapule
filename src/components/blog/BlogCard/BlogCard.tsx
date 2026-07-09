import Image from "next/image";
import Link from "next/link";
import styles from "./BlogCard.module.scss";
import type { Article } from "@/lib/shopify/types";
import { formatDate } from "@/lib/utils";

interface BlogCardProps {
  article: Article;
  /** The first (featured) card in a listing gets a larger treatment. */
  featured?: boolean;
  priority?: boolean;
}

export function BlogCard({ article, featured, priority }: BlogCardProps) {
  return (
    <article className={`${styles.card} ${featured ? styles.featured : ""}`}>
      <Link href={`/blog/${article.handle}`} className={styles.link}>
        <div className={styles.imageWell}>
          {article.image ? (
            <Image
              src={article.image.url}
              alt={article.image.altText ?? article.title}
              fill
              sizes={featured ? "(max-width: 768px) 100vw, 60vw" : "(max-width: 768px) 100vw, 33vw"}
              className={styles.image}
              priority={priority}
            />
          ) : (
            <div className={styles.placeholder} aria-hidden="true">
              Tutto Napule · Journal
            </div>
          )}
        </div>

        <div className={styles.body}>
          <div className={styles.meta}>
            <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
            {article.author && <span className={styles.author}>· {article.author}</span>}
          </div>
          <h3 className={styles.title}>{article.title}</h3>
          {article.excerpt && <p className={styles.excerpt}>{article.excerpt}</p>}
          <span className={styles.readMore}>Read the story →</span>
        </div>
      </Link>
    </article>
  );
}
