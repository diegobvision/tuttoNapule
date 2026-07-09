import type { ReactNode } from "react";
import styles from "./PageHeader.module.scss";
import { SectionDivider } from "@/components/ui/Ornament/Ornament";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  children?: ReactNode;
}

/** Centred sub-page header band: eyebrow → serif title → rule → description. */
export function PageHeader({ eyebrow, title, description, children }: PageHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        {children}
        {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
        <h1 className={styles.title}>{title}</h1>
        <SectionDivider className={styles.divider} />
        {description && <p className={styles.description}>{description}</p>}
      </div>
    </header>
  );
}
