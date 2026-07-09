import Link from "next/link";
import styles from "./Footer.module.scss";
import { Logo } from "@/components/ui/Logo/Logo";
import { SectionDivider } from "@/components/ui/Ornament/Ornament";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { InstagramIcon, FacebookIcon } from "@/components/ui/Icons";
import { getAllCollections } from "@/lib/shopify";
import { NAV_COLLECTION_HANDLES, humaniseHandle, SITE_NAME } from "@/lib/config";

const LEGAL_LINKS = [
  { href: "/pages/shipping", label: "Shipping & Returns" },
  { href: "/pages/faq", label: "FAQ" },
  { href: "/pages/terms", label: "Terms & Conditions" },
  { href: "/pages/privacy", label: "Privacy Policy" },
];

const EXPLORE_LINKS = [
  { href: "/collections", label: "Shop all" },
  { href: "/blog", label: "Journal" },
  { href: "/pages/about", label: "Our story" },
  { href: "/pages/contact", label: "Contact us" },
];

export async function Footer() {
  const all = await getAllCollections();
  // Prefer real collections; otherwise show the configured nav handles.
  const shopLinks = (
    all.length > 0
      ? all.slice(0, 6).map((c) => ({ handle: c.handle, label: c.title }))
      : NAV_COLLECTION_HANDLES.map((h) => ({ handle: h, label: humaniseHandle(h) }))
  ).map((c) => ({ href: `/collections/${c.handle}`, label: c.label }));

  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <div className={styles.brand}>
          <Logo variant="badge" asLink={false} />
          <p className={styles.tagline}>
            A taste of Naples, delivered across the UK. Sourced with care,
            packed with heart — <em>artigianale, dal cuore</em>.
          </p>
          <div className={styles.social}>
            <a href="https://instagram.com" aria-label="Instagram" className={styles.socialLink}>
              <InstagramIcon />
            </a>
            <a href="https://facebook.com" aria-label="Facebook" className={styles.socialLink}>
              <FacebookIcon />
            </a>
          </div>
        </div>

        <nav className={styles.cols} aria-label="Footer">
          <div className={styles.col}>
            <h3 className={styles.colTitle}>Shop</h3>
            <ul>
              {shopLinks.map((l) => (
                <li key={l.href}>
                  <TrackedLink
                    href={l.href}
                    event="footer_link_click"
                    eventParams={{ link_text: l.label, destination: l.href, group: "shop" }}
                    className={styles.link}
                  >
                    {l.label}
                  </TrackedLink>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.col}>
            <h3 className={styles.colTitle}>Explore</h3>
            <ul>
              {EXPLORE_LINKS.map((l) => (
                <li key={l.href}>
                  <TrackedLink
                    href={l.href}
                    event="footer_link_click"
                    eventParams={{ link_text: l.label, destination: l.href, group: "explore" }}
                    className={styles.link}
                  >
                    {l.label}
                  </TrackedLink>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.col}>
            <h3 className={styles.colTitle}>Help</h3>
            <ul>
              {LEGAL_LINKS.map((l) => (
                <li key={l.href}>
                  <TrackedLink
                    href={l.href}
                    event="footer_link_click"
                    eventParams={{ link_text: l.label, destination: l.href, group: "help" }}
                    className={styles.link}
                  >
                    {l.label}
                  </TrackedLink>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>

      <div className={styles.bottom}>
        <SectionDivider variant="quatrefoil" className={styles.divider} />
        <p className={styles.legal}>
          © {year} {SITE_NAME}. Cucina · Casa · Ricette. All rights reserved.
        </p>
        <p className={styles.built}>
          Handmade in the UK · <Link href="/pages/privacy" className={styles.legalLink}>Privacy</Link> ·{" "}
          <Link href="/pages/terms" className={styles.legalLink}>Terms</Link>
        </p>
      </div>
    </footer>
  );
}
