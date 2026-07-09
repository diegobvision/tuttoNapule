// Lightweight inline SVG icons — stroke inherits currentColor.
import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = (props: IconProps): IconProps => ({
  width: 22,
  height: 22,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  focusable: false,
  ...props,
});

export const SearchIcon = (props: IconProps) => (
  <svg {...base(props)}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);

export const CartIcon = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="M6 6h15l-1.5 9h-12z" />
    <path d="M6 6 5 3H2" />
    <circle cx="9" cy="20" r="1.4" />
    <circle cx="18" cy="20" r="1.4" />
  </svg>
);

export const MenuIcon = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="M3 6h18M3 12h18M3 18h18" />
  </svg>
);

export const CloseIcon = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

export const ChevronRightIcon = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="m9 6 6 6-6 6" />
  </svg>
);

export const ChevronDownIcon = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export const ArrowRightIcon = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="M4 12h16M14 6l6 6-6 6" />
  </svg>
);

export const MinusIcon = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="M5 12h14" />
  </svg>
);

export const PlusIcon = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const GridIcon = (props: IconProps) => (
  <svg {...base(props)}>
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);

export const CheckIcon = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

// ── Social / share (filled where it reads better) ─────────────────────────
export const FacebookIcon = (props: IconProps) => (
  <svg {...base({ ...props, fill: "currentColor", stroke: "none" })}>
    <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12Z" />
  </svg>
);

export const XIcon = (props: IconProps) => (
  <svg {...base({ ...props, fill: "currentColor", stroke: "none" })}>
    <path d="M18.9 2H22l-6.9 7.9L23 22h-6.4l-5-6.6L5.8 22H2.7l7.4-8.5L2 2h6.6l4.5 6 5.8-6Zm-1.1 18h1.7L7.3 3.8H5.5L17.8 20Z" />
  </svg>
);

export const PinterestIcon = (props: IconProps) => (
  <svg {...base({ ...props, fill: "currentColor", stroke: "none" })}>
    <path d="M12 2a10 10 0 0 0-3.6 19.3c-.08-.8-.15-2.06.03-2.95.16-.77 1.06-4.9 1.06-4.9s-.27-.54-.27-1.34c0-1.26.73-2.2 1.64-2.2.77 0 1.14.58 1.14 1.28 0 .78-.5 1.94-.75 3.02-.22.9.45 1.64 1.34 1.64 1.6 0 2.84-1.7 2.84-4.15 0-2.17-1.56-3.69-3.79-3.69-2.58 0-4.1 1.94-4.1 3.94 0 .78.3 1.62.68 2.07a.27.27 0 0 1 .06.26l-.25 1.02c-.04.17-.13.2-.3.12-1.13-.52-1.83-2.16-1.83-3.48 0-2.83 2.06-5.43 5.93-5.43 3.11 0 5.53 2.22 5.53 5.18 0 3.1-1.95 5.59-4.66 5.59-.91 0-1.77-.47-2.06-1.03l-.56 2.14c-.2.78-.75 1.76-1.12 2.36A10 10 0 1 0 12 2Z" />
  </svg>
);

export const WhatsAppIcon = (props: IconProps) => (
  <svg {...base({ ...props, fill: "currentColor", stroke: "none" })}>
    <path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.26A10 10 0 1 0 12 2Zm5.8 14.2c-.24.68-1.4 1.3-1.94 1.34-.5.05-1.13.07-1.82-.11a15 15 0 0 1-1.65-.61 12.9 12.9 0 0 1-4.94-4.37c-.37-.5-1.02-1.48-1.02-2.82 0-1.34.7-2 .95-2.27a1 1 0 0 1 .72-.34h.52c.17 0 .4-.06.62.47l.85 2.06c.07.14.11.31.02.5-.09.19-.13.31-.27.47l-.4.47c-.13.13-.27.28-.11.55.16.27.7 1.16 1.51 1.88 1.04.93 1.92 1.22 2.2 1.36.27.13.43.11.58-.07l.83-.97c.19-.23.35-.18.58-.1l2.02.95c.24.11.4.17.46.27.06.1.06.6-.18 1.28Z" />
  </svg>
);

export const EmailIcon = (props: IconProps) => (
  <svg {...base(props)}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m4 7 8 6 8-6" />
  </svg>
);

export const LinkIcon = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="M9 15 15 9" />
    <path d="M11 6.5 12.5 5a4 4 0 0 1 5.6 5.6L16.5 12" />
    <path d="M13 17.5 11.5 19a4 4 0 0 1-5.6-5.6L7.5 12" />
  </svg>
);

export const InstagramIcon = (props: IconProps) => (
  <svg {...base(props)}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
  </svg>
);
