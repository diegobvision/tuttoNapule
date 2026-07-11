import type { Metadata } from "next";
import { Playfair_Display, Inter, Ephesis } from "next/font/google";
import "@/styles/globals.scss";

import { CartProvider } from "@/context/CartContext";
import { Header } from "@/components/layout/Header/Header";
import { Footer } from "@/components/layout/Footer/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer/CartDrawer";
import {
  GoogleTagManagerScript,
  GoogleTagManagerNoScript,
} from "@/components/analytics/GoogleTagManager";
import { PageViewTracker } from "@/components/analytics/PageViewTracker";
import { JsonLd } from "@/components/seo/JsonLd";
import { organizationSchema, websiteSchema } from "@/lib/seo";
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from "@/lib/config";

const serif = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-serif",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

// Brand script — used only for the "Tutto Napule" wordmark (header, footer).
const script = Ephesis({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-script",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Authentic Neapolitan & Italian Food in the UK`,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Authentic Neapolitan & Italian Food in the UK`,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: "/logo/favicon.svg", type: "image/svg+xml" },
      { url: "/logo/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/logo/favicon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/logo/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${serif.variable} ${sans.variable} ${script.variable}`}>
      <head>
        <GoogleTagManagerScript />
        <link rel="preconnect" href="https://cdn.shopify.com" />
      </head>
      <body>
        <GoogleTagManagerNoScript />
        <JsonLd data={[organizationSchema(), websiteSchema()]} />

        <a href="#main" className="skip-link">
          Skip to content
        </a>

        <CartProvider>
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <CartDrawer />
        </CartProvider>

        <PageViewTracker />
      </body>
    </html>
  );
}
