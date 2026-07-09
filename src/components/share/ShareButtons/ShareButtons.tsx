"use client";

import { useState } from "react";
import styles from "./ShareButtons.module.scss";
import {
  FacebookIcon,
  XIcon,
  PinterestIcon,
  WhatsAppIcon,
  EmailIcon,
  LinkIcon,
  CheckIcon,
} from "@/components/ui/Icons";
import { trackShare } from "@/lib/analytics";

interface ShareButtonsProps {
  url: string;
  title: string;
  contentType: "product" | "article";
  id: string;
  image?: string;
}

export function ShareButtons({ url, title, contentType, id, image }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const enc = encodeURIComponent;

  const targets = [
    {
      method: "facebook",
      label: "Share on Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`,
      Icon: FacebookIcon,
    },
    {
      method: "x",
      label: "Share on X",
      href: `https://twitter.com/intent/tweet?url=${enc(url)}&text=${enc(title)}`,
      Icon: XIcon,
    },
    {
      method: "pinterest",
      label: "Pin on Pinterest",
      href: `https://pinterest.com/pin/create/button/?url=${enc(url)}&description=${enc(title)}${
        image ? `&media=${enc(image)}` : ""
      }`,
      Icon: PinterestIcon,
    },
    {
      method: "whatsapp",
      label: "Share on WhatsApp",
      href: `https://wa.me/?text=${enc(`${title} ${url}`)}`,
      Icon: WhatsAppIcon,
    },
    {
      method: "email",
      label: "Share by email",
      href: `mailto:?subject=${enc(title)}&body=${enc(url)}`,
      Icon: EmailIcon,
    },
  ] as const;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      trackShare("copy_link", contentType, id);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className={styles.bar} data-gtm="share-bar">
      <span className={styles.label}>Share</span>
      <div className={styles.buttons}>
        {targets.map(({ method, label, href, Icon }) => (
          <a
            key={method}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.btn}
            aria-label={label}
            data-gtm="share"
            data-gtm-share-method={method}
            data-gtm-share-content-type={contentType}
            data-gtm-share-id={id}
            onClick={() => trackShare(method, contentType, id)}
          >
            <Icon width={18} height={18} />
          </a>
        ))}
        <button
          type="button"
          className={styles.btn}
          onClick={copyLink}
          aria-label="Copy link"
          data-gtm="share"
          data-gtm-share-method="copy_link"
          data-gtm-share-content-type={contentType}
          data-gtm-share-id={id}
        >
          {copied ? <CheckIcon width={18} height={18} /> : <LinkIcon width={18} height={18} />}
        </button>
        {copied && <span className={styles.copied} role="status">Link copied!</span>}
      </div>
    </div>
  );
}
