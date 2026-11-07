import legal from "../../content/legal.json";
export const metadata = { title: "Conditions de vente", alternates: { canonical: "/conditions-de-vente" } };
export default function Page() { return <section className="sec"><div className="wrap prose" dangerouslySetInnerHTML={{ __html: legal["lg-cgv"] }} /></section>; }
