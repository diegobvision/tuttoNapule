import styles from "./ValueProps.module.scss";

const ITEMS = [
  {
    title: "Sourced in Italy",
    text: "Directly from Neapolitan roasters, pastifici and family producers.",
  },
  {
    title: "Shipped across the UK",
    text: "Carefully packed and delivered to your door, wherever you are.",
  },
  {
    title: "Artigianale, dal cuore",
    text: "Small-batch, authentic products chosen the way a nonna would.",
  },
];

/** Thin reassurance band sitting directly beneath the hero. */
export function ValueProps() {
  return (
    <section className={styles.band} aria-label="Why Tutto Napule">
      <ul className={styles.inner}>
        {ITEMS.map((item) => (
          <li key={item.title} className={styles.item}>
            <h2 className={styles.title}>{item.title}</h2>
            <p className={styles.text}>{item.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
