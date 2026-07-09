"use client";

import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./SearchBar.module.scss";
import { Drawer } from "@/components/ui/Drawer/Drawer";
import { SearchIcon, CloseIcon } from "@/components/ui/Icons";
import { trackSearch } from "@/lib/analytics";

interface SearchBarProps {
  open: boolean;
  onClose: () => void;
}

const SUGGESTIONS = ["Caffè", "Pasta di Gragnano", "Passata", "Moka", "Taralli"];

export function SearchBar({ open, onClose }: SearchBarProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState("");

  useEffect(() => {
    if (open) requestAnimationFrame(() => inputRef.current?.focus());
    else setValue("");
  }, [open]);

  const submit = (term: string) => {
    const q = term.trim();
    if (!q) return;
    trackSearch(q);
    onClose();
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <Drawer open={open} onClose={onClose} side="top" ariaLabel="Search products">
      <div className={styles.inner}>
        <form
          className={styles.form}
          onSubmit={(e) => {
            e.preventDefault();
            submit(value);
          }}
          role="search"
        >
          <SearchIcon className={styles.icon} width={24} height={24} />
          <input
            ref={inputRef}
            type="search"
            name="q"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Search for coffee, pasta, gifts…"
            className={styles.input}
            aria-label="Search products"
            autoComplete="off"
          />
          <button type="submit" className={styles.submit}>
            Search
          </button>
          <button
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label="Close search"
          >
            <CloseIcon />
          </button>
        </form>

        <div className={styles.suggestions}>
          <span className={styles.suggestLabel}>Popular</span>
          {SUGGESTIONS.map((s) => (
            <button key={s} type="button" className={styles.chip} onClick={() => submit(s)}>
              {s}
            </button>
          ))}
        </div>
      </div>
    </Drawer>
  );
}
