import QuoteForm from "../../components/QuoteForm";
export const metadata = { title: "Demander un devis", description: "Devis gratuit pour votre meuble sur mesure D.M.M DECO, valable 7 jours.", alternates: { canonical: "/devis" } };
export default async function Devis({ searchParams }) {
  const sp = await searchParams;
  return (
    <section className="sec"><div className="wrap">
      <span className="eyebrow">Devis gratuit</span><h1>Demandez votre devis</h1>
      <p className="lead" style={{ margin: "14px 0 28px" }}>Décrivez votre projet : le formulaire prépare votre message et l'ouvre dans WhatsApp, prêt à envoyer.</p>
      <QuoteForm defaultModel={typeof sp.modele === "string" ? sp.modele : ""} />
    </div></section>
  );
}
