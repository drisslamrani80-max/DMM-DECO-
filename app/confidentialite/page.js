import legal from "../../content/legal.json";
export const metadata = { title: "Politique de confidentialité", alternates: { canonical: "/confidentialite" } };
export default function Page() { return <section className="sec"><div className="wrap prose" dangerouslySetInnerHTML={{ __html: legal["lg-conf"] }} /></section>; }
