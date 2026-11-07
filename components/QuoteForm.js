"use client";
import { useState } from "react";
import { WHATSAPP } from "../lib/site";
export default function QuoteForm({ defaultModel = "" }) {
  const [f, setF] = useState({ nom: "", tel: "", modele: defaultModel, bois: "", tissu: "", dim: "", note: "" });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const msg = `Bonjour D.M.M DECO, je souhaite recevoir un devis.\n\nModèle : ${f.modele || "-"}\nBois : ${f.bois || "-"}\nTissu : ${f.tissu || "-"}\nDimensions : ${f.dim || "-"}\nPrécisions : ${f.note || "aucune"}\n\nNom : ${f.nom || "-"}\nTéléphone : ${f.tel || "-"}`;
  const wa = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
  return (
    <form className="qf" onSubmit={(e) => { e.preventDefault(); window.open(wa, "_blank", "noopener"); }}>
      <label>Votre nom<input value={f.nom} onChange={set("nom")} required autoComplete="name" /></label>
      <label>Téléphone<input value={f.tel} onChange={set("tel")} required inputMode="tel" autoComplete="tel" /></label>
      <label className="full">Modèle souhaité<input value={f.modele} onChange={set("modele")} placeholder="Ex. Canapé Cask" required /></label>
      <label>Bois<input value={f.bois} onChange={set("bois")} placeholder="Ex. chêne" /></label>
      <label>Tissu<input value={f.tissu} onChange={set("tissu")} placeholder="Ex. chenille" /></label>
      <label className="full">Dimensions<input value={f.dim} onChange={set("dim")} placeholder="Ex. 190 cm de large" /></label>
      <label className="full">Précisions<textarea rows="3" value={f.note} onChange={set("note")} /></label>
      <button className="btn brass full" type="submit">Envoyer ma demande sur WhatsApp</button>
      <p className="full small">Le devis est gratuit, valable 7 jours. Prix hors taxe, TVA 20 % en sus. Paiement : 50 % d'avance, 50 % à la livraison.</p>
    </form>
  );
}
