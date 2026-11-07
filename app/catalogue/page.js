import { cats, models, catLabel } from "../../lib/site";
import ModelCard from "../../components/ModelCard";
export const metadata = { title: "Catalogue complet", description: "Tous les modèles D.M.M DECO : canapés, fauteuils, chaises, tables, bureaux, poufs et têtes de lit, fabriqués sur mesure.", alternates: { canonical: "/catalogue" } };
const norm = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
export default async function Catalogue({ searchParams }) {
  const sp = await searchParams;
  const type = typeof sp.type === "string" && cats.some((c) => c.key === sp.type) ? sp.type : "";
  const q = typeof sp.q === "string" ? sp.q.trim() : "";
  let list = models.filter((m) => (!type || m.cat === type) && (!q || norm(m.name + " " + m.desc).includes(norm(q))));
  return (
    <section className="sec"><div className="wrap">
      <span className="eyebrow">Notre collection</span>
      <h1>Catalogue complet</h1>
      <p className="lead">Choisissez par type de meuble, puis demandez votre devis : chaque modèle se fabrique dans le bois et le tissu de votre choix.</p>
      <div className="pills" role="navigation" aria-label="Filtrer par type">
        <a className={"pill" + (!type ? " on" : "")} href="/catalogue">Toutes les pièces</a>
        {cats.map((c) => <a key={c.key} className={"pill" + (type === c.key ? " on" : "")} href={`/catalogue?type=${c.key}`}>{c.label}</a>)}
      </div>
      <form className="sf" action="/catalogue" method="get" role="search">
        {type && <input type="hidden" name="type" value={type} />}
        <input name="q" defaultValue={q} placeholder="Rechercher un modèle (Lady, cuir, angle…)" aria-label="Rechercher" />
        <button className="btn dark" type="submit">Rechercher</button>
      </form>
      <p className="count">{list.length} modèle{list.length > 1 ? "s" : ""}{type ? ` · ${catLabel(type)}` : ""}{q ? ` · « ${q} »` : ""}</p>
      {list.length ? <div className="grid">{list.map((m) => <ModelCard key={m.slug} m={m} />)}</div> : <p>Aucun modèle trouvé. <a href="/devis">Décrivez-nous votre idée</a>, nous la fabriquons sur mesure.</p>}
    </div></section>
  );
}
