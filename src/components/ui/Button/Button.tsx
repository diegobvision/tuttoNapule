import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import styles from "./Button.module.scss";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ochre" | "ghost";
type Size = "md" | "lg";

interface BaseProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

const classesFor = (variant: Variant, size: Size, className?: string) =>
  cn(styles.btn, styles[variant], size === "lg" && styles.lg, className);

/** Link-style button (default) — renders an <a> via next/link. */
export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: BaseProps & ComponentProps<typeof Link>) {
  return (
    <Link className={classesFor(variant, size, className)} {...props}>
      {children}
    </Link>
  );
}

/** Native <button> variant for interactive actions. */
export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: BaseProps & ComponentProps<"button">) {
  return (
    <button className={classesFor(variant, size, className)} {...props}>
      {children}
    </button>
  );
}
