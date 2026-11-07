import { WHATSAPP } from "../lib/site";
export default function Header() {
  return (
    <>
      <div className="topbar">Livraison partout au Maroc · Atelier à Marrakech · Ouvert 7j/7</div>
      <header className="hdr">
        <a className="logo" href="/">D.M.M <span>DECO</span></a>
        <nav aria-label="Navigation principale">
          <a href="/">Accueil</a>
          <a href="/a-propos">À propos</a>
          <a href="/catalogue">Catalogue</a>
          <a href="/devis">Devis</a>
          <a href="/contact">Contact</a>
        </nav>
        <a className="btn brass" href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener">WhatsApp</a>
      </header>
    </>
  );
}
