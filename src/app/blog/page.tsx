import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader/PageHeader";
import { JsonLd } from "@/components/seo/JsonLd";
import { BlogClient } from "./BlogClient";
import { getArticles } from "@/lib/shopify";
import { pageMeta, breadcrumbSchema } from "@/lib/seo";

export const revalidate = 60;

export function generateMetadata(): Metadata {
  return pageMeta({
    title: "The Journal",
    description:
      "Stories, recipes and the people behind Neapolitan food and coffee — the Tutto Napule Journal.",
    path: "/blog",
  });
}

export default async function BlogPage() {
  const articles = await getArticles(20);
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Journal", path: "/blog" },
  ];

  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <PageHeader
        eyebrow="Dal nostro diario"
        title="The Journal"
        description="Recipes, traditions and the makers behind every product — a slow read from Naples to your kitchen."
      />
      <BlogClient articles={articles} />
    </>
  );
}
