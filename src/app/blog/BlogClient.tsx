"use client";

import { useMemo, useState } from "react";
import styles from "./blog.module.scss";
import { BlogCard } from "@/components/blog/BlogCard/BlogCard";
import type { Article } from "@/lib/shopify/types";
import { cn } from "@/lib/utils";

export function BlogClient({ articles }: { articles: Article[] }) {
  const tags = useMemo(() => {
    const set = new Set<string>();
    articles.forEach((a) => a.tags.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [articles]);

  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filtered = activeTag
    ? articles.filter((a) => a.tags.includes(activeTag))
    : articles;

  return (
    <div className={styles.wrap}>
      {tags.length > 0 && (
        <div className={styles.filters} role="tablist" aria-label="Filter by topic">
          <button
            role="tab"
            aria-selected={activeTag === null}
            className={cn(styles.chip, activeTag === null && styles.chipActive)}
            onClick={() => setActiveTag(null)}
          >
            All
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              role="tab"
              aria-selected={activeTag === tag}
              className={cn(styles.chip, activeTag === tag && styles.chipActive)}
              onClick={() => setActiveTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className={styles.empty}>No stories here yet — check back soon.</p>
      ) : (
        <div className={styles.grid}>
          {filtered.map((article, i) => (
            <BlogCard
              key={article.id}
              article={article}
              featured={!activeTag && i === 0}
              priority={i === 0}
            />
          ))}
        </div>
      )}
    </div>
  );
}
