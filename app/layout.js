import { SITE_URL, TITLE, DESCRIPTION } from "../lib/site";
import ld from "../content/ld.json";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website", siteName: "D.M.M DECO", locale: "fr_MA", url: "/", title: TITLE,
    description: "Canapés, fauteuils, tables et plus encore, fabriqués sur commande. Prix sur devis, prêt en 2 à 3 semaines.",
  },
  twitter: { card: "summary" },
};
export const viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#1D1745" };

export default function RootLayout({ children }) {
  const jsonLd = { ...ld, url: SITE_URL + "/" };
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,500;0,6..96,600;1,6..96,400&family=Hanken+Grotesk:wght@400;500;600&display=swap" rel="stylesheet" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
