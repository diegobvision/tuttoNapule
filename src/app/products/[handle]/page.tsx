import { notFound } from "next/navigation";
import type { Metadata } from "next";
import styles from "./product.module.scss";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { ProductPageClient } from "./ProductPageClient";
import { ProductGrid } from "@/components/product/ProductGrid/ProductGrid";
import { SectionHeader } from "@/components/ui/SectionHeader/SectionHeader";
import { getProduct, getAllProductHandles, getProductRecommendations } from "@/lib/shopify";
import { pageMeta, productSchema, breadcrumbSchema, absoluteUrl } from "@/lib/seo";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ handle: string }>;
}

export async function generateStaticParams() {
  const handles = await getAllProductHandles();
  return handles.map((h) => ({ handle: h.handle }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) {
    return pageMeta({ title: "Product not found", path: `/products/${handle}`, noindex: true });
  }
  return pageMeta({
    title: product.seo.title || product.title,
    description:
      product.seo.description ||
      product.description.slice(0, 160) ||
      `${product.title} — available at Tutto Napule.`,
    path: `/products/${handle}`,
    image: product.featuredImage?.url ?? null,
    type: "product",
  });
}

export default async function ProductPage({ params }: PageProps) {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) notFound();

  const recommendations = await getProductRecommendations(product.id, 4);

  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/collections" },
    { name: product.title, path: `/products/${handle}` },
  ];

  return (
    <>
      <JsonLd data={[productSchema(product), breadcrumbSchema(crumbs)]} />

      <div className={styles.wrap}>
        <Breadcrumbs items={crumbs} />
        <ProductPageClient product={product} url={absoluteUrl(`/products/${handle}`)} />
      </div>

      {recommendations.length > 0 && (
        <section className={styles.related}>
          <SectionHeader eyebrow="Ti potrebbe piacere" title="You may also like" />
          <ProductGrid products={recommendations} listId="product-recommendations" />
        </section>
      )}
    </>
  );
}
