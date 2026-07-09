import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/config";
import {
  getAllProductHandles,
  getAllCollectionHandles,
  getAllPageHandles,
  getAllArticleHandles,
} from "@/lib/shopify";

// Sitemap listings change rarely — cache for an hour (see AGENTS.md).
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, collections, pages, articles] = await Promise.all([
    getAllProductHandles(),
    getAllCollectionHandles(),
    getAllPageHandles(),
    getAllArticleHandles(),
  ]);

  const url = (path: string) => `${SITE_URL}${path}`;

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: url("/"), changeFrequency: "daily", priority: 1 },
    { url: url("/collections"), changeFrequency: "weekly", priority: 0.9 },
    { url: url("/blog"), changeFrequency: "weekly", priority: 0.7 },
  ];

  const collectionRoutes: MetadataRoute.Sitemap = collections.map((c) => ({
    url: url(`/collections/${c.handle}`),
    lastModified: c.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: url(`/products/${p.handle}`),
    lastModified: p.updatedAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const articleRoutes: MetadataRoute.Sitemap = articles.map((a) => ({
    url: url(`/blog/${a.handle}`),
    lastModified: a.publishedAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const pageRoutes: MetadataRoute.Sitemap = pages.map((p) => ({
    url: url(`/pages/${p.handle}`),
    lastModified: p.updatedAt,
    changeFrequency: "monthly",
    priority: 0.4,
  }));

  return [
    ...staticRoutes,
    ...collectionRoutes,
    ...productRoutes,
    ...articleRoutes,
    ...pageRoutes,
  ];
}
