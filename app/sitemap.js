import { SITE_URL } from "../lib/site";
export default function sitemap() {
  const now = new Date();
  return [
    { url: SITE_URL + "/", lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: SITE_URL + "/mentions-legales", lastModified: now, priority: 0.3 },
    { url: SITE_URL + "/conditions-de-vente", lastModified: now, priority: 0.4 },
    { url: SITE_URL + "/confidentialite", lastModified: now, priority: 0.3 },
  ];
}
