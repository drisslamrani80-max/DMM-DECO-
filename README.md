# D.M.M DECO — site Next.js avec catalogue filtrable

Pages : accueil, /catalogue (filtres par type + recherche), /modeles/[modèle] (une page par meuble, 212 pages), /a-propos, /devis (formulaire vers WhatsApp), /contact, mentions légales, conditions de vente, confidentialité, sitemap.xml, robots.txt.

## Mise en ligne sur Vercel (gratuit)
1. vercel.com → « Continue with GitHub ».
2. Add New → Project → dépôt DMM-DECO- → branche `catalogue` → Deploy.
3. Domaine : Settings → Domains. Puis Settings → Environment Variables : NEXT_PUBLIC_SITE_URL = https://dmmdeco.ma, et redéployer.

## En local
npm install && npm run dev
