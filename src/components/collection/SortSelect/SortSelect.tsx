"use client";

import styles from "./SortSelect.module.scss";
import { ChevronDownIcon } from "@/components/ui/Icons";

export interface SortOption {
  value: string;
  label: string;
}

export const COLLECTION_SORTS: SortOption[] = [
  { value: "manual", label: "Featured" },
  { value: "best-selling", label: "Best selling" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "created-desc", label: "Newest" },
  { value: "title-asc", label: "Alphabetical" },
];

interface SortSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export function SortSelect({ value, onChange }: SortSelectProps) {
  return (
    <label className={styles.wrap}>
      <span className={styles.label}>Sort</span>
      <span className={styles.selectWrap}>
        <select
          className={styles.select}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {COLLECTION_SORTS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDownIcon className={styles.icon} width={16} height={16} />
      </span>
    </label>
  );
}
