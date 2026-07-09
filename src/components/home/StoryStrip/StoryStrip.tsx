import Image from "next/image";
import styles from "./StoryStrip.module.scss";
import { ButtonLink } from "@/components/ui/Button/Button";
import { SectionDivider } from "@/components/ui/Ornament/Ornament";

/** Editorial band — brand story, speaking to both audiences. */
export function StoryStrip() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.media}>
          <Image
            src="/images/positano-dusk.jpg"
            alt="The Amalfi coast at dusk"
            fill
            sizes="(max-width: 900px) 100vw, 50vw"
            className={styles.image}
          />
        </div>

        <div className={styles.copy}>
          <p className={styles.eyebrow}>La nostra storia</p>
          <h2 className={styles.title}>
            The flavours of home, wherever home is now
          </h2>
          <SectionDivider className={styles.divider} />
          <p className={styles.body}>
            Whether you grew up on Sunday ragù in Naples or you&rsquo;re a
            Londoner who fell for a proper espresso, Tutto Napule brings the
            real thing to your kitchen. We work with small Italian producers to
            source coffee, pasta, conserve and the beautiful tools that make
            them — then ship it all, carefully, across the UK.
          </p>
          <ButtonLink href="/pages/about" variant="secondary">
            Read our story
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
