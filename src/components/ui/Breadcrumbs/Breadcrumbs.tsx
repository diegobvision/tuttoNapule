import Link from "next/link";
import styles from "./Breadcrumbs.module.scss";
import type { Breadcrumb } from "@/lib/seo";

/** Visual breadcrumb trail. Pair with breadcrumbSchema() for the JSON-LD. */
export function Breadcrumbs({ items }: { items: Breadcrumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className={styles.nav}>
      <ol className={styles.list}>
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={item.path} className={styles.item}>
              {isLast ? (
                <span aria-current="page" className={styles.current}>
                  {item.name}
                </span>
              ) : (
                <>
                  <Link href={item.path} className={styles.link}>
                    {item.name}
                  </Link>
                  <span className={styles.sep} aria-hidden="true">
                    /
                  </span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
