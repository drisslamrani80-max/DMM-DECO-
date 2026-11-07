import { PHONE, EMAIL } from "../lib/site";
export default function Footer() {
  return (
    <footer className="ftr">
      <div className="wrap fgrid">
        <div>
          <a className="logo" href="/">D.M.M <span>DECO</span></a>
          <p>Mobilier d'intérieur fabriqué sur mesure à Marrakech. Livraison dans tout le Maroc.</p>
          <p>{PHONE}<br />{EMAIL}<br />Ouvert 7 jours sur 7</p>
        </div>
        <div>
          <h4>Le site</h4>
          <a href="/catalogue">Catalogue</a><a href="/a-propos">À propos</a><a href="/devis">Demander un devis</a><a href="/contact">Contact</a>
        </div>
        <div>
          <h4>Informations légales</h4>
          <dl>
            <div><dt>SARL</dt><dd>D.M.M DECO · Marrakech</dd></div>
            <div><dt>ICE</dt><dd>002310520000055</dd></div>
            <div><dt>RC</dt><dd>98217</dd></div>
            <div><dt>IF</dt><dd>37622586</dd></div>
            <div><dt>Patente</dt><dd>64600849</dd></div>
            <div><dt>CNSS</dt><dd>1634938</dd></div>
          </dl>
        </div>
      </div>
      <div className="wrap fbottom">
        <span>© 2026 D.M.M DECO SARL — Tous droits réservés.</span>
        <span><a href="/mentions-legales">Mentions légales</a> · <a href="/conditions-de-vente">Conditions de vente</a> · <a href="/confidentialite">Confidentialité</a></span>
      </div>
    </footer>
  );
}
