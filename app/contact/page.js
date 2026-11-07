import { PHONE, EMAIL, WHATSAPP } from "../../lib/site";
export const metadata = { title: "Contact", description: "Contactez D.M.M DECO à Marrakech : WhatsApp, téléphone, e-mail. Ouvert 7 jours sur 7.", alternates: { canonical: "/contact" } };
export default function Contact() {
  return (
    <section className="sec"><div className="wrap two">
      <div><span className="eyebrow">Contact</span><h1>Parlons de votre projet</h1>
        <p className="lead" style={{ margin: "14px 0 24px" }}>Atelier à Marrakech, ouvert 7 jours sur 7. Nous répondons surtout sur WhatsApp.</p>
        <a className="btn wa" target="_blank" rel="noopener" href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent("Bonjour D.M.M DECO, je souhaite un devis.")}`}>Écrire sur WhatsApp</a></div>
      <dl className="info">
        <div><dt>Téléphone / WhatsApp</dt><dd><a href={`tel:${PHONE.replace(/ /g, "")}`}>{PHONE}</a></dd></div>
        <div><dt>E-mail</dt><dd><a href={`mailto:${EMAIL}`}>{EMAIL}</a></dd></div>
        <div><dt>Ville</dt><dd>Marrakech, Maroc</dd></div>
        <div><dt>Ouverture</dt><dd>7 jours sur 7</dd></div>
        <div><dt>Livraison</dt><dd>Dans tout le Maroc</dd></div>
      </dl>
    </div></section>
  );
}
