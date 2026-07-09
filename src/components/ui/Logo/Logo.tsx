import Image from "next/image";
import Link from "next/link";
import styles from "./Logo.module.scss";
import { SITE_NAME } from "@/lib/config";
import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "wordmark" | "badge";
  className?: string;
  /** Render as a plain image (no link) — e.g. inside another link. */
  asLink?: boolean;
  priority?: boolean;
}

const SOURCES = {
  wordmark: { src: "/logo-wordmark.png", w: 320, h: 210 },
  badge: { src: "/logo-badge.png", w: 200, h: 200 },
};

export function Logo({
  variant = "wordmark",
  className,
  asLink = true,
  priority,
}: LogoProps) {
  const { src, w, h } = SOURCES[variant];
  const img = (
    <Image
      src={src}
      alt={`${SITE_NAME} — Cucina, Casa, Ricette`}
      width={w}
      height={h}
      priority={priority}
      className={cn(styles.img, styles[variant])}
    />
  );

  if (!asLink) return img;

  return (
    <Link href="/" className={cn(styles.logo, className)} aria-label={`${SITE_NAME} home`}>
      {img}
    </Link>
  );
}
