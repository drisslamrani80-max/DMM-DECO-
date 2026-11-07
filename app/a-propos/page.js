export const metadata = { title: "À propos", description: "D.M.M DECO, atelier de mobilier d'intérieur sur mesure à Marrakech : garantie 5 ans, livraison dans tout le Maroc.", alternates: { canonical: "/a-propos" } };
export default function About() {
  return (
    <section className="sec"><div className="wrap prose">
      <span className="eyebrow">À propos</span><h1>D.M.M DECO, l'atelier de Marrakech</h1>
      <p className="lead" style={{ marginTop: 14 }}>Nous fabriquons sur mesure canapés, fauteuils, chaises, tables, bureaux, coiffeuses, poufs et têtes de lit, pour les particuliers comme pour les professionnels.</p>
      <h2>Comment ça marche</h2>
      <ol><li>Vous choisissez un modèle dans le catalogue, ou vous nous décrivez votre idée.</li><li>Vous recevez un devis gratuit, valable 7 jours, avec le bois et le tissu de votre choix. Nous vous conseillons gratuitement sur les tissus.</li><li>Vous validez en versant 50 % d'avance.</li><li>Nous fabriquons en 2 à 3 semaines, puis nous livrons dans tout le Maroc. Le solde de 50 % est réglé à la livraison, après vérification et validation.</li></ol>
      <h2>Nos engagements</h2>
      <ul><li>Garantie de 5 ans sur les meubles fabriqués par D.M.M DECO.</li><li>Housse de protection offerte avec la commande.</li><li>Travaux de retapissage offerts à nos clients, sous réserve des conditions.</li><li>Discrétion : les noms de nos clients restent confidentiels, conformément à la loi marocaine.</li></ul>
      <p><a className="btn brass" href="/devis">Demander un devis</a></p>
    </div></section>
  );
}
