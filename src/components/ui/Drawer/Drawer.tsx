"use client";

import { useEffect, useRef } from "react";
import styles from "./Drawer.module.scss";
import { cn } from "@/lib/utils";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  side?: "left" | "right" | "top";
  /** Panel width for left/right drawers (CSS length). */
  width?: string;
  labelledBy?: string;
  ariaLabel?: string;
  className?: string;
  children: React.ReactNode;
}

/**
 * Accessible slide-in panel: scrim + panel, Escape to close, body scroll lock,
 * focus moves into the panel on open and returns to the opener on close.
 */
export function Drawer({
  open,
  onClose,
  side = "right",
  width = "min(420px, 92vw)",
  labelledBy,
  ariaLabel,
  className,
  children,
}: DrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<Element | null>(null);

  useEffect(() => {
    if (open) {
      openerRef.current = document.activeElement;
      document.body.classList.add("no-scroll");
      // Move focus into the panel for keyboard/AT users.
      requestAnimationFrame(() => panelRef.current?.focus());
    } else {
      document.body.classList.remove("no-scroll");
      if (openerRef.current instanceof HTMLElement) openerRef.current.focus();
    }
    return () => document.body.classList.remove("no-scroll");
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <div className={cn(styles.root, open && styles.open)} aria-hidden={!open}>
      <div className={styles.scrim} onClick={onClose} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        aria-label={ariaLabel}
        tabIndex={-1}
        className={cn(styles.panel, styles[side], className)}
        style={side === "top" ? undefined : ({ ["--drawer-w" as string]: width })}
      >
        {children}
      </div>
    </div>
  );
}
