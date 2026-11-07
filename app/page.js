import { cats, models, catSingle } from "../lib/site";
import ModelCard from "../components/ModelCard";
const cover = { canape: "cn_cask", fauteuil: "lady", chaise: "gobi", chaisebar: "sol_y_luna", table: "yoyo", tablemanger: "revolution", tablebasse: "zoulou", bureau: "notaire", coiffeuse: "retro_30", footstool: "leon", tetelit: "th_elara" };
const first = (k) => models.find((m) => m.cat === k);
export default function Home() {
  const hero = models.find((m) => m.photo === "cn_cask") || models[0];
  const picks = ["lady", "revolution", "gobi", "notaire"].map((p) => models.find((m) => m.photo === p)).filter(Boolean);
  return (
    <>
      <section className="hero"><div className="wrap">
        <div>
          <span className="eyebrow" style={{ color: "var(--brass)" }}>Fabriqué sur mesure à Marrakech</span>
          <h1>Le mobilier qui vous ressemble, fait pour durer.</h1>
          <p className="lead">Canapés, fauteuils, tables, bureaux et têtes de lit : choisissez le modèle, le bois et le tissu. Prêt en 2 à 3 semaines, livré dans tout le Maroc.</p>
          <div className="cta"><a className="btn brass" href="/catalogue">Voir le catalogue</a><a className="btn" href="/devis">Demander un devis</a></div>
        </div>
        <figure><img src={`/photos/${hero.photo}.jpg`} alt={`${catSingle(hero.cat)} ${hero.name}`} /><figcaption>{catSingle(hero.cat)} {hero.name}, sur mesure</figcaption></figure>
      </div></section>

      <section className="sec"><div className="wrap">
        <span className="eyebrow">Nos collections</span><h2>Choisissez une pièce</h2>
        <div className="tiles">
          {cats.map((c) => { const m = models.find((x) => x.photo === cover[c.key]) || first(c.key); return (
            <a key={c.key} className="tile" href={`/catalogue?type=${c.key}`}><img src={`/photos/${m.photo}.jpg`} alt={c.label} loading="lazy" /><div><h3>{c.label}</h3><small>{c.count} modèle{c.count > 1 ? "s" : ""}</small></div></a>
          ); })}
        </div>
      </div></section>

      <section className="sec alt"><div className="wrap">
        <span className="eyebrow">Nos garanties</span><h2>Des engagements clairs</h2>
        <ul className="eng">
          <li><b>5 ans</b><h3>Garantie</h3><p>Chaque meuble fabriqué par D.M.M DECO est garanti 5 ans.</p></li>
          <li><b>Maroc</b><h3>Livraison</h3><p>Dans tout le pays. Les frais dépendent de la ville et de la quantité ; généralement, D.M.M DECO les prend en charge.</p></li>
          <li><b>50 / 50</b><h3>Paiement</h3><p>50 % d'avance, 50 % à la livraison, après vérification et validation par le client. Virement ou chèque.</p></li>
          <li><b>Offert</b><h3>Retapissage</h3><p>Travaux de retapissage offerts à nos clients, sous réserve des conditions.</p></li>
        </ul>
      </div></section>

      <section className="sec"><div className="wrap">
        <span className="eyebrow">Coups de cœur</span><h2>Quelques modèles</h2>
        <div className="grid" style={{ marginTop: 26 }}>{picks.map((m) => <ModelCard key={m.slug} m={m} />)}</div>
        <p style={{ marginTop: 26 }}><a className="btn dark" href="/catalogue">Voir les {models.length} modèles</a></p>
      </div></section>
    </>
  );
}
