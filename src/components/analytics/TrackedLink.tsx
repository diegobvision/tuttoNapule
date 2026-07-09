"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { trackEvent } from "@/lib/analytics";

type TrackedLinkProps = ComponentProps<typeof Link> & {
  /** dataLayer event name to emit on click. */
  event: string;
  /** Extra params merged into the event. */
  eventParams?: Record<string, unknown>;
};

/**
 * A next/link that emits a GTM event on click. Lets server components (Hero,
 * FeaturedCategory, Footer) track interactions without becoming client
 * components themselves.
 */
export function TrackedLink({ event, eventParams, onClick, ...props }: TrackedLinkProps) {
  return (
    <Link
      {...props}
      onClick={(e) => {
        trackEvent(event, eventParams ?? {});
        onClick?.(e);
      }}
    />
  );
}
