import type { ReactNode } from "react";
import styles from "./SectionHeader.module.scss";
import { SectionDivider } from "@/components/ui/Ornament/Ornament";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  eyebrow?: string;
  title: ReactNode;
  note?: ReactNode;
  align?: "center" | "left";
  as?: "h1" | "h2" | "h3";
  className?: string;
}

/**
 * The brand's centred label composition:
 * eyebrow → serif title → ornament divider → optional note.
 */
export function SectionHeader({
  eyebrow,
  title,
  note,
  align = "center",
  as: Heading = "h2",
  className,
}: SectionHeaderProps) {
  return (
    <header className={cn(styles.header, styles[align], className)}>
      {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
      <Heading className={styles.title}>{title}</Heading>
      <SectionDivider className={styles.divider} />
      {note && <p className={styles.note}>{note}</p>}
    </header>
  );
}
