# D.M.M DECO — site Next.js

Site vitrine de D.M.M DECO (mobilier d'intérieur sur commande), reconstruit avec Next.js.

## Mettre en ligne sur Vercel (gratuit)
1. Créez un compte sur vercel.com (« Continue with GitHub »).
2. « Add New… » → « Project » → choisissez le dépôt DMM-DECO- → branche `nextjs`.
3. Ne changez aucun réglage, cliquez « Deploy ».
4. Quand le domaine dmmdeco.ma est acheté : Project → Settings → Domains → ajoutez-le et suivez les DNS indiqués.
5. Dans Settings → Environment Variables, ajoutez NEXT_PUBLIC_SITE_URL = https://dmmdeco.ma puis redéployez (sitemap et Google).

## Utiliser en local
npm install && npm run dev  (http://localhost:3000)

## Structure
- app/ : pages (accueil, version mobile, mentions légales, conditions de vente, confidentialité, sitemap, robots)
- middleware.js : les téléphones reçoivent la version mobile, les robots Google la version principale
- content/ : textes HTML et styles du site
- public/photos/ : les 212 photos des modèles (fichiers JPG)
- public/main.js et public/mobile.js : comportement du site (galeries, devis, favoris)
- lib/site.js : adresse publique du site
