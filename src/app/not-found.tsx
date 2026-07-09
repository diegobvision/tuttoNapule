import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button/Button";
import { SectionDivider } from "@/components/ui/Ornament/Ornament";
import styles from "./not-found.module.scss";

export default function NotFound() {
  return (
    <div className={styles.wrap}>
      <p className={styles.code}>404</p>
      <h1 className={styles.title}>Ah, si perduto!</h1>
      <SectionDivider className={styles.divider} />
      <p className={styles.text}>
        We couldn&rsquo;t find that page. It may have moved, sold out, or never
        existed — like a good espresso, some things are fleeting.
      </p>
      <div className={styles.actions}>
        <ButtonLink href="/" variant="primary">
          Back home
        </ButtonLink>
        <Link href="/collections" className={styles.link}>
          Browse the shop →
        </Link>
      </div>
    </div>
  );
}
