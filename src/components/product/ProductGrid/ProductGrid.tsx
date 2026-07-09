import styles from "./ProductGrid.module.scss";
import { ProductCard } from "@/components/product/ProductCard/ProductCard";
import type { ProductCardData } from "@/lib/shopify/types";

interface ProductGridProps {
  products: ProductCardData[];
  listId?: string;
  priorityCount?: number;
}

export function ProductGrid({ products, listId, priorityCount = 0 }: ProductGridProps) {
  return (
    <ul className={styles.grid}>
      {products.map((product, i) => (
        <li key={product.id} className={styles.cell}>
          <ProductCard product={product} listId={listId} priority={i < priorityCount} />
        </li>
      ))}
    </ul>
  );
}
