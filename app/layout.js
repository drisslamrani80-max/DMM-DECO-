import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { SITE_URL } from "../lib/site";
import ld from "../content/ld.json";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "D.M.M DECO | Mobilier d'intérieur sur commande à Marrakech", template: "%s | D.M.M DECO" },
  description: "D.M.M DECO fabrique sur commande canapés, fauteuils, tables, bureaux, coiffeuses et têtes de lit à Marrakech. Livraison dans tout le Maroc. Devis gratuit.",
  openGraph: { type: "website", siteName: "D.M.M DECO", locale: "fr_MA" },
  robots: { index: true, follow: true },
};
export const viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#1D1745" };

export default function RootLayout({ children }) {
  const jsonLd = { ...ld, url: SITE_URL + "/" };
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,500;0,6..96,600&family=Hanken+Grotesk:wght@400;500;600&display=swap" rel="stylesheet" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
