import { models, catLabel, catSingle, waLink, SITE_URL } from "../../../lib/site";
import ModelCard from "../../../components/ModelCard";
import { notFound } from "next/navigation";
export const dynamicParams = false;
export function generateStaticParams() { return models.map((m) => ({ slug: m.slug })); }
const find = (slug) => models.find((m) => m.slug === slug);
export async function generateMetadata({ params }) {
  const m = find((await params).slug); if (!m) return {};
  const t = `${catSingle(m.cat)} ${m.name} sur mesure`;
  return { title: t, description: `${m.desc} Fabriqué sur mesure à Marrakech, bois et tissu au choix. Prix sur devis.`, alternates: { canonical: `/modeles/${m.slug}` }, openGraph: { title: t, images: [`/photos/${m.photo}.jpg`] } };
}
export default async function ModelPage({ params }) {
  const m = find((await params).slug); if (!m) notFound();
  const same = models.filter((x) => x.cat === m.cat && x.slug !== m.slug).slice(0, 4);
  const name = `${catSingle(m.cat)} ${m.name}`;
  const ld = { "@context": "https://schema.org", "@type": "Product", name, description: m.desc, image: `${SITE_URL}/photos/${m.photo}.jpg`, brand: { "@type": "Brand", name: "D.M.M DECO" }, category: catLabel(m.cat) };
  return (
    <section className="sec"><div className="wrap">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <p className="crumb"><a href="/">Accueil</a> › <a href="/catalogue">Catalogue</a> › <a href={`/catalogue?type=${m.cat}`}>{catLabel(m.cat)}</a> › {m.name}</p>
      <div className="pg">
        <div className="big"><img src={`/photos/${m.photo}.jpg`} alt={`${name} sur mesure`} /></div>
        <div>
          <span className="eyebrow">{catSingle(m.cat)}</span>
          <h1>{m.name}</h1>
          <p className="lead" style={{ marginTop: 12 }}>{m.desc}</p>
          <dl>
            <div><dt>Prix</dt><dd>Sur devis, gratuit, valable 7 jours</dd></div>
            <div><dt>Bois et tissu</dt><dd>À votre choix, avec conseil gratuit sur les tissus</dd></div>
            <div><dt>Délai</dt><dd>2 à 3 semaines après validation</dd></div>
            <div><dt>Garantie</dt><dd>5 ans · housse de protection offerte</dd></div>
            <div><dt>Livraison</dt><dd>Dans tout le Maroc</dd></div>
          </dl>
          <div className="acts">
            <a className="btn wa" target="_blank" rel="noopener" href={waLink(`Bonjour, je souhaite un devis pour : ${name}.\nDimensions souhaitées : \nBois / tissu : `)}>Devis rapide sur WhatsApp</a>
            <a className="btn dark" href={`/devis?modele=${encodeURIComponent(name)}`}>Remplir une demande de devis</a>
          </div>
        </div>
      </div>
      {same.length > 0 && <><h2 style={{ marginTop: 56, marginBottom: 22 }}>Dans la même collection</h2><div className="grid">{same.map((x) => <ModelCard key={x.slug} m={x} />)}</div></>}
    </div></section>
  );
}
