import styles from "./Ornament.module.scss";
import { cn } from "@/lib/utils";

/** Four-point star / diamond — the mark between "tutto" and "Napule". */
export function DiamondStar({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn(styles.icon, className)}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M12 0 L14 10 L24 12 L14 14 L12 24 L10 14 L0 12 L10 10 Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Four-dot quatrefoil cluster (the little flower in the logo). */
export function Quatrefoil({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn(styles.icon, className)}
      aria-hidden="true"
      focusable="false"
    >
      <g fill="currentColor">
        <circle cx="12" cy="6" r="3.4" />
        <circle cx="12" cy="18" r="3.4" />
        <circle cx="6" cy="12" r="3.4" />
        <circle cx="18" cy="12" r="3.4" />
      </g>
    </svg>
  );
}

/**
 * The brand's horizontal rule: a hairline flanked by an ochre diamond. Use in
 * place of a plain <hr>. `variant="quatrefoil"` swaps the centre mark.
 */
export function SectionDivider({
  variant = "diamond",
  className,
}: {
  variant?: "diamond" | "quatrefoil";
  className?: string;
}) {
  return (
    <div className={cn(styles.divider, className)} role="presentation">
      <span className={styles.rule} />
      {variant === "diamond" ? (
        <DiamondStar className={styles.mark} />
      ) : (
        <Quatrefoil className={styles.mark} />
      )}
      <span className={styles.rule} />
    </div>
  );
}
