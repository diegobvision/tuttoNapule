import Image from "next/image";
import Link from "next/link";
import styles from "./Logo.module.scss";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/config";
import { cn } from "@/lib/utils";

interface LogoProps {
  /**
   * "wordmark" — the script typemark alone (header, light grounds).
   * "badge" — the full lockup (Vesuvius emblem + typemark + tagline),
   *   ivory-inked for dark surfaces (footer).
   */
  variant?: "wordmark" | "badge";
  className?: string;
  /** Render without the home link — e.g. inside another link. */
  asLink?: boolean;
  priority?: boolean;
}

// Intrinsic viewBox dimensions of the SVGs (public/logo/) — display size is
// set in Logo.module.scss.
const SOURCES = {
  wordmark: { src: "/logo/typemark.svg", w: 3357, h: 1048 },
  badge: { src: "/logo/full-inverse.svg", w: 3357, h: 2243 },
};

export function Logo({ variant = "wordmark", className, asLink = true, priority }: LogoProps) {
  const { src, w, h } = SOURCES[variant];
  const img = (
    <Image
      src={src}
      alt={`${SITE_NAME} — ${SITE_TAGLINE}`}
      width={w}
      height={h}
      priority={priority}
      unoptimized
      className={cn(styles.img, styles[variant])}
    />
  );

  if (!asLink) return <span className={cn(styles.logo, className)}>{img}</span>;

  return (
    <Link href="/" className={cn(styles.logo, className)} aria-label={`${SITE_NAME} home`}>
      {img}
    </Link>
  );
}
