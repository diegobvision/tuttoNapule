import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import styles from "./collections-index.module.scss";
import { PageHeader } from "@/components/ui/PageHeader/PageHeader";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs/Breadcrumbs";
import { ChevronRightIcon } from "@/components/ui/Icons";
import { getAllCollections } from "@/lib/shopify";
import { pageMeta, breadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";

export const revalidate = 60;

export function generateMetadata(): Metadata {
  return pageMeta({
    title: "Shop all categories",
    description:
      "Browse the full Tutto Napule shop — Neapolitan coffee, pasta, pantry staples, sweets and kitchenware, delivered across the UK.",
    path: "/collections",
  });
}

export default async function CollectionsIndexPage() {
  const collections = await getAllCollections();
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/collections" },
  ];

  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <PageHeader
        eyebrow="Il negozio"
        title="Shop all categories"
        description="Everything we carry, organised the way an Italian kitchen would — from the morning coffee to the after-dinner sweets."
      />

      <div className={styles.wrap}>
        <Breadcrumbs items={crumbs} />

        {collections.length === 0 ? (
          <p className={styles.empty}>
            Collections will appear here once your Shopify store is connected.
          </p>
        ) : (
          <ul className={styles.grid}>
            {collections.map((c) => (
              <li key={c.id}>
                <Link href={`/collections/${c.handle}`} className={styles.tile}>
                  <span className={styles.media}>
                    {c.image ? (
                      <Image
                        src={c.image.url}
                        alt={c.image.altText ?? c.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className={styles.image}
                      />
                    ) : (
                      <span className={styles.fallback} aria-hidden="true">
                        {c.title.charAt(0)}
                      </span>
                    )}
                    <span className={styles.scrim} />
                  </span>
                  <span className={styles.body}>
                    <span className={styles.title}>{c.title}</span>
                    {c.description && <span className={styles.desc}>{c.description}</span>}
                    <span className={styles.cta}>
                      Shop now <ChevronRightIcon width={16} height={16} />
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
