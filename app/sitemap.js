import { SITE_URL, models } from "../lib/site";
export default function sitemap() {
  const now = new Date();
  const pages = ["", "/catalogue", "/a-propos", "/devis", "/contact", "/mentions-legales", "/conditions-de-vente", "/confidentialite"].map((p) => ({ url: SITE_URL + p, lastModified: now, priority: p === "" ? 1 : 0.6 }));
  return [...pages, ...models.map((m) => ({ url: `${SITE_URL}/modeles/${m.slug}`, lastModified: now, priority: 0.7 }))];
}
