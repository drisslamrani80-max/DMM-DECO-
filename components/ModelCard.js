import { catSingle } from "../lib/site";
export default function ModelCard({ m }) {
  return (
    <a className="card" href={`/modeles/${m.slug}`}>
      <div className="pic"><img src={`/photos/${m.photo}.jpg`} alt={`${catSingle(m.cat)} ${m.name} sur mesure`} loading="lazy" /></div>
      <div className="cb"><span className="eyebrow">{catSingle(m.cat)}</span><h3>{m.name}</h3><span className="price">Sur devis</span></div>
    </a>
  );
}
