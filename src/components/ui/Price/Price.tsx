import styles from "./Price.module.scss";
import type { Money } from "@/lib/shopify/types";
import { formatMoney, isOnSale } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface PriceProps {
  price: Money;
  compareAt?: Money | null;
  /** Prefix with "From" for variable-priced products. */
  from?: boolean;
  className?: string;
}

export function Price({ price, compareAt, from, className }: PriceProps) {
  const onSale = isOnSale(price, compareAt ?? null);
  return (
    <span className={cn(styles.price, className)}>
      {from && <span className={styles.from}>From </span>}
      <span className={cn(styles.current, onSale && styles.sale)}>
        {formatMoney(price)}
      </span>
      {onSale && compareAt && (
        <span className={styles.compare}>{formatMoney(compareAt)}</span>
      )}
    </span>
  );
}
