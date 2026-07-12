import { TrackedLink } from "@/components/analytics/TrackedLink";
import { DiamondStar } from "@/components/ui/Ornament/Ornament";
import Image from "next/image";
import styles from "./Hero.module.scss";

export function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.media}>
        <Image
          src="/images/hero-naples-bay-2.png"
          alt="The Bay of Naples at sunset, with Vesuvius on the horizon"
          fill
          priority
          sizes="100vw"
          className={styles.image}
        />
        <div className={styles.scrim} />
      </div>

      <div className={styles.inner}>
        <p className={styles.eyebrow}>
          <DiamondStar className={styles.eyebrowMark} />
          Cucina · Casa · Ricette
        </p>
        <h1 id="hero-title" className={styles.title}>
          A little taste of Naples,
          <br /> delivered to your door
        </h1>
        <p className={styles.lead}>
          Authentic Neapolitan and Italian coffee, pasta, pantry treasures and
          kitchenware — sourced with care and shipped across the UK.
        </p>
        <div className={styles.actions}>
          <TrackedLink
            href="/collections"
            className={styles.primary}
            event="hero_cta_click"
            eventParams={{
              cta_label: "Shop the pantry",
              destination: "/collections",
            }}
          >
            Shop the pantry
          </TrackedLink>
          <TrackedLink
            href="/blog"
            className={styles.secondary}
            event="hero_cta_click"
            eventParams={{
              cta_label: "Read the Journal",
              destination: "/blog",
            }}
          >
            Read the Journal
          </TrackedLink>
        </div>
      </div>
    </section>
  );
}
